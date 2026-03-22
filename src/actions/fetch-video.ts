"use server";

import type Innertube from "youtubei.js";
// import youtubedl from "youtube-dl-exec";
import z from "zod";
import { actionClient } from "@/lib/safe-action";
import { getYoutube } from "@/lib/yt";
import { en } from "@/locales/en";

const fetchVideoSchema = z.object({
  url: z.url().min(1).max(150),
});

export type FetchVideoSuccessResponse = {
  success: true;
  video: {
    id: string;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
    formats: VideoFormatType[];
  };
};

type VideoFormatType = {
  itag: number;
  mimeType: string;
  quality: string;
  qualityLabel: string;
  hasAudio: boolean;
};

export const fetchVideo = actionClient
  .inputSchema(fetchVideoSchema)
  .action(async ({ parsedInput: { url } }) => {
    try {
      const videoId = getVideoIdFromUrl(url);

      const yt = await getYoutube();
      const videoInfo = await yt.getInfo(videoId);

      const { basic_info } = videoInfo;

      const thumbnail = basic_info.thumbnail?.[0].url;
      const title = basic_info.title;
      const author = basic_info.author;
      const views = basic_info.view_count;

      if (!thumbnail || !title || !author || !views) {
        return {
          success: false,
          message: en.fetchVideo.couldNotFetch,
        };
      }

      const formats = getBestFormats(videoInfo);

      return {
        success: true,
        video: {
          id: videoId,
          title,
          thumbnail,
          author,
          views,
          formats,
        },
      } satisfies FetchVideoSuccessResponse;
    } catch (err) {
      if (err instanceof Error)
        return {
          success: false,
          message: err.message,
        };
    }
  });

const getVideoIdFromUrl = (url: string): string => {
  let id = url.split("v=")[1];
  const ampersandPosition = id.indexOf("&");
  if (ampersandPosition !== -1) {
    id = id.substring(0, ampersandPosition);
  }

  return id;
};

function getBestFormats(videoInfo: Awaited<ReturnType<Innertube["getInfo"]>>) {
  const raw = [
    ...(videoInfo.streaming_data?.formats ?? []),
    ...(videoInfo.streaming_data?.adaptive_formats ?? []),
  ];

  const validFormats = raw
    .filter(
      (
        f,
      ): f is typeof f & {
        itag: number;
        mime_type: string;
        quality: string;
        quality_label: string;
        has_video: true;
      } =>
        typeof f.itag === "number" &&
        typeof f.mime_type === "string" &&
        typeof f.quality === "string" &&
        typeof f.quality_label === "string" &&
        f.has_video === true,
    )
    .map((f) => ({
      itag: f.itag,
      mimeType: f.mime_type,
      quality: f.quality,
      qualityLabel: f.quality_label,
      hasAudio: f.has_audio ?? false,
      bitrate: f.bitrate ?? 0,
    }));

  const best = new Map<string, (typeof validFormats)[number]>();

  for (const format of validFormats) {
    const existing = best.get(format.qualityLabel);

    if (!existing) {
      best.set(format.qualityLabel, format);
      continue;
    }

    const isBetter =
      (!existing.hasAudio && format.hasAudio) ||
      (existing.hasAudio === format.hasAudio &&
        format.bitrate > existing.bitrate);

    if (isBetter) {
      best.set(format.qualityLabel, format);
    }
  }

  const resolution = (label: string) => Number(label.match(/\d+/)?.[0] ?? 0);

  return Array.from(best.values())
    .sort((a, b) => resolution(b.qualityLabel) - resolution(a.qualityLabel))
    .map(
      ({
        itag,
        mimeType,
        quality,
        qualityLabel,
        hasAudio,
      }): VideoFormatType => ({
        itag,
        mimeType,
        quality,
        qualityLabel,
        hasAudio,
      }),
    );
}
