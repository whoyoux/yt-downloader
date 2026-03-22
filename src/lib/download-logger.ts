import "server-only";
import { redis } from "./redis";

type DownloadLog = {
  ip: string;
  videoId: string;
  itag: number;
  filename: string;
  fileSize: number;
  timestamp: string;
  userAgent: string;
};

export async function logDownload(data: DownloadLog) {
  const entry = JSON.stringify(data);
  const day = data.timestamp.slice(0, 10); // YYYY-MM-DD

  await Promise.all([
    // Lista wszystkich pobrań (ostatnie 10000)
    redis.lpush("downloads:log", entry),
    redis.ltrim("downloads:log", 0, 9999),

    // Pobrania per dzień
    redis.lpush(`downloads:daily:${day}`, entry),
    redis.expire(`downloads:daily:${day}`, 60 * 60 * 24 * 30), // 30 dni

    // Pobrania per IP
    redis.lpush(`downloads:ip:${data.ip}`, entry),
    redis.ltrim(`downloads:ip:${data.ip}`, 0, 99),
    redis.expire(`downloads:ip:${data.ip}`, 60 * 60 * 24 * 7), // 7 dni

    // Countery
    redis.incr("stats:total"),
    redis.incr(`stats:daily:${day}`),
    redis.expire(`stats:daily:${day}`, 60 * 60 * 24 * 30),

    // Najpopularniejsze filmy
    redis.zincrby("stats:popular-videos", 1, data.videoId),
  ]);
}

export async function getStats() {
  const today = new Date().toISOString().slice(0, 10);

  const [total, todayCount, recentLogs, popularVideos] = await Promise.all([
    redis.get("stats:total"),
    redis.get(`stats:daily:${today}`),
    redis.lrange("downloads:log", 0, 49),
    redis.zrevrange("stats:popular-videos", 0, 9, "WITHSCORES"),
  ]);

  // Parsuj popular videos z [id, score, id, score, ...] do obiektów
  const popular: { videoId: string; count: number }[] = [];
  for (let i = 0; i < popularVideos.length; i += 2) {
    popular.push({
      videoId: popularVideos[i].toString(),
      count: +popularVideos[i + 1],
    });
  }

  return {
    total: +(total ?? "0"),
    today: +(todayCount ?? "0"),
    recent: recentLogs.map((log) => JSON.parse(log) as DownloadLog),
    popular,
  };
}

export async function getLogsByIp(ip: string) {
  const logs = await redis.lrange(`downloads:ip:${ip}`, 0, -1);
  return logs.map((log) => JSON.parse(log) as DownloadLog);
}
