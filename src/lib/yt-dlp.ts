import "server-only";
import { readdirSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9 _\-().]/g, "_").slice(0, 180);
}

function getVideoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export async function downloadToFile(videoId: string, itag: number) {
  const ffmpegCheck = Bun.spawn(["ffmpeg", "-version"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const ffmpegOut = await new Response(ffmpegCheck.stdout).text();
  const ffmpegExit = await ffmpegCheck.exited;
  console.log(
    `[ffmpeg check] exit: ${ffmpegExit}, output: ${ffmpegOut.split("\n")[0]}`,
  );

  const url = getVideoUrl(videoId);
  const tmpDir = await mkdtemp(join(tmpdir(), "ytdl-"));
  // Wymuszamy rozszerzenie .mp4 zamiast %(ext)s
  const outputPath = join(tmpDir, "output.mp4");

  const proc = Bun.spawn(
    [
      "yt-dlp",
      "-f",
      `${itag}+bestaudio/best`,
      "--merge-output-format",
      "mp4",
      "--ppa",
      "Merger:-c:v copy -c:a aac -b:a 192k",
      "--no-part",
      "--no-warnings",
      // Wymusza remux nawet jak jeden stream
      "--remux-video",
      "mp4",
      "-o",
      outputPath,
      url,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  console.log(`[yt-dlp stdout] ${stdout}`);
  if (stderr) console.error(`[yt-dlp stderr] ${stderr}`);
  console.log(`[yt-dlp exit code] ${exitCode}`);

  if (exitCode !== 0) {
    await rm(tmpDir, { recursive: true, force: true });
    throw new Error(`yt-dlp error (exit ${exitCode}): ${stderr}`);
  }

  const files = readdirSync(tmpDir);
  console.log(`[yt-dlp files in tmpDir] ${JSON.stringify(files)}`);

  // Po merge powinien być output.mp4
  const outputFile =
    files.find((f) => f === "output.mp4") ??
    files.find((f) => f.endsWith(".mp4")) ??
    files.find((f) => f.startsWith("output"));

  if (!outputFile) {
    await rm(tmpDir, { recursive: true, force: true });
    throw new Error(
      `yt-dlp did not produce output file. Files: ${JSON.stringify(files)}`,
    );
  }

  const tmpFile = join(tmpDir, outputFile);

  const titleProc = Bun.spawn(["yt-dlp", "--get-title", "--no-warnings", url], {
    stdout: "pipe",
    stderr: "ignore",
  });
  const title = (await new Response(titleProc.stdout).text()).trim();
  await titleProc.exited;

  return {
    tmpFile,
    tmpDir,
    filename: `${sanitizeFilename(title || videoId)}.mp4`,
  };
}

export async function cleanupDownload(tmpDir: string) {
  try {
    await rm(tmpDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
