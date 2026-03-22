import { Disclaimer } from "@/components/disclaimer";
import DownloadCard from "@/components/download-card";
import FetchCard from "@/components/fetch-card";
import ResetVideoEffect from "@/components/reset-video-effect";
import VideoCard from "@/components/video-card";

export default function Home() {
  return (
    <main className="w-full sm:min-w-xl flex flex-col gap-4 max-w-xl pb-10">
      <ResetVideoEffect />
      <FetchCard />
      <VideoCard />
      <DownloadCard />
      <Disclaimer />
    </main>
  );
}
