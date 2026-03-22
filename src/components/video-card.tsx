"use client";

import Image from "next/image";
import { en } from "@/locales/en";
import { useVideoStore } from "@/stores/video-store";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const VideoCard = () => {
  const video = useVideoStore((state) => state.video);
  const isFetching = useVideoStore((state) => state.isFetching);

  if (!video) return null;

  if (isFetching) {
    return <SkeletonVideoCard />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="w-full aspect-video relative">
          <Image
            src={video.thumbnail}
            alt={en.videoCard.thumbnailAlt}
            fill
            quality={100}
            sizes="(max-width: 640px) 100vw, 640px"
          />
        </div>
        <CardTitle className="truncate max-w-full">{video.title}</CardTitle>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground truncate max-w-[50%]">
            {video.author}
          </CardTitle>
          <CardTitle className="text-muted-foreground truncate max-w-[50%]">
            {`${video.views.toLocaleString("en-US")} ${en.videoCard.viewsLabel}`}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

const SkeletonVideoCard = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="w-full aspect-video" />
      <Skeleton className="w-full h-[20px]" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-[30%] h-[20px]" />
        <Skeleton className="w-[40%] h-[20px]" />
      </div>
    </CardHeader>
  </Card>
);

export default VideoCard;
