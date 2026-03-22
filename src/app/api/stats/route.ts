import { getStats } from "@/lib/download-logger";
import { en } from "@/locales/en";

export const runtime = "nodejs";

const ADMIN_KEY = process.env.ADMIN_API_KEY;

export const GET = async (request: Request) => {
  if (ADMIN_KEY) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== ADMIN_KEY) {
      return Response.json(
        { success: false, message: en.api.unauthorized },
        { status: 401 },
      );
    }
  }

  const stats = await getStats();

  return Response.json({ success: true, data: stats });
};
