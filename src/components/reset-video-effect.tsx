"use client";

import { useEffect } from "react";
import { useVideoStore } from "@/stores/video-store";

const ResetVideoEffect = () => {
  const setVideo = useVideoStore((state) => state.setVideo);

  useEffect(() => {
    setVideo(null);
  }, [setVideo]);

  return null;
};

export default ResetVideoEffect;
