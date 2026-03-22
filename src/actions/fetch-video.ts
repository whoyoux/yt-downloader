"use server";

import z from "zod";
import { actionClient } from "@/lib/safe-action";
import { getVideoInfo } from "@/lib/yt";
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
      const video = await getVideoInfo(videoId);

      return {
        success: true,
        video,
      } satisfies FetchVideoSuccessResponse;
    } catch (err) {
      console.error(`[FETCH VIDEO] Error:`, err);
      if (err instanceof Error)
        return {
          success: false,
          message: err.message,
        };

      return {
        success: false,
        message: en.fetchVideo.couldNotFetch,
      };
    }
  });

const getVideoIdFromUrl = (url: string): string => {
  const patterns = [
    /(?:v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error("Invalid YouTube URL");
};
