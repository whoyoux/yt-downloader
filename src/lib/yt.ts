import "server-only";

export type VideoInfo = {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  views: number;
  formats: VideoFormat[];
};

export type VideoFormat = {
  itag: number;
  mimeType: string;
  quality: string;
  qualityLabel: string;
  hasAudio: boolean;
};

type RawFormat = {
  format_id?: string;
  ext?: string;
  vcodec?: string;
  acodec?: string;
  height?: number;
  format_note?: string;
  tbr?: number;
  quality?: number;
};

export async function getVideoInfo(videoId: string): Promise<VideoInfo> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const proc = Bun.spawn(
    ["yt-dlp", "--dump-json", "--no-download", "--no-warnings", url],
    { stdout: "pipe", stderr: "pipe" },
  );

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    throw new Error(`yt-dlp error: ${stderr}`);
  }

  const data = JSON.parse(stdout);

  const formats = getBestFormats(data.formats ?? []);

  return {
    id: videoId,
    title: data.title ?? "Unknown",
    thumbnail:
      data.thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    author: data.uploader ?? data.channel ?? "Unknown",
    views: data.view_count ?? 0,
    formats,
  };
}

function getBestFormats(raw: RawFormat[]): VideoFormat[] {
  const videoFormats = raw.filter(
    (f) =>
      f.vcodec !== "none" &&
      f.vcodec != null &&
      f.height != null &&
      f.height > 0,
  );

  const best = new Map<number, RawFormat>();

  for (const f of videoFormats) {
    const height = f.height!;
    const existing = best.get(height);

    if (!existing) {
      best.set(height, f);
      continue;
    }

    const existingHasAudio =
      existing.acodec !== "none" && existing.acodec != null;
    const currentHasAudio = f.acodec !== "none" && f.acodec != null;

    const isBetter =
      (!existingHasAudio && currentHasAudio) ||
      (existingHasAudio === currentHasAudio &&
        (f.tbr ?? 0) > (existing.tbr ?? 0));

    if (isBetter) {
      best.set(height, f);
    }
  }

  return Array.from(best.entries())
    .sort(([a], [b]) => b - a)
    .map(([height, f]) => ({
      itag: parseInt(f.format_id ?? "0"),
      mimeType: `video/${f.ext ?? "mp4"}`,
      quality: f.format_note ?? `${height}p`,
      qualityLabel: `${height}p`,
      hasAudio: f.acodec !== "none" && f.acodec != null,
    }));
}
