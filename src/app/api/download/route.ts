import { stat } from "node:fs/promises";
import { headers } from "next/headers";
import z from "zod";
import { logDownload } from "@/lib/download-logger";
import { rateLimit } from "@/lib/rate-limit";
import { cleanupDownload, downloadToFile } from "@/lib/yt-dlp";
import { en } from "@/locales/en";

export const runtime = "nodejs";

const downloadSchema = z.object({
  videoId: z.string().min(1).max(50),
  itag: z.number(),
  acceptTerms: z.literal(true),
});

export const POST = async (request: Request) => {
  let tmpDir: string | null = null;

  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown";
    const userAgent = headersList.get("user-agent") ?? "unknown";

    const limit = await rateLimit(ip, {
      maxRequests: 5,
      windowSeconds: 60,
    });

    if (!limit.success) {
      return Response.json(
        {
          success: false,
          message: en.api.rateLimited(limit.retryAfter ?? 60),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfter),
          },
        },
      );
    }

    const body = downloadSchema.safeParse(await request.json());

    if (!body.success) {
      return Response.json(
        { success: false, message: en.api.invalidRequest },
        { status: 400 },
      );
    }

    const { videoId, itag } = body.data;
    const result = await downloadToFile(videoId, itag);
    tmpDir = result.tmpDir;

    const fileStats = await stat(result.tmpFile);
    const file = Bun.file(result.tmpFile);
    const { readable, writable } = new TransformStream();

    file
      .stream()
      .pipeTo(writable)
      .finally(() => cleanupDownload(result.tmpDir));

    // Loguj pobranie (fire & forget — nie blokuje response)
    logDownload({
      ip,
      videoId,
      itag,
      filename: result.filename,
      fileSize: fileStats.size,
      timestamp: new Date().toISOString(),
      userAgent,
    }).catch((err) => console.error(`[LOG ERROR] ${err}`));

    return new Response(readable, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(fileStats.size),
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (err) {
    if (tmpDir) await cleanupDownload(tmpDir);
    console.error(`[DOWNLOAD ROUTE] Error: ${err}`);
    return Response.json(
      {
        success: false,
        message: en.api.downloadFailed,
      },
      { status: 500 },
    );
  }
};
