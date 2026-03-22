import { create } from "zustand";
import type { FetchVideoSuccessResponse } from "@/actions/fetch-video";

type Video = FetchVideoSuccessResponse["video"];

type VideoStoreState = {
  isFetching: boolean;
  video: Video | null;
};

type VideoStoreActions = {
  setVideo: (video: Video | null) => void;
  setFetching: (value: boolean) => void;
};

type VideoStore = VideoStoreState & VideoStoreActions;

export const useVideoStore = create<VideoStore>((set) => ({
  isFetching: false,
  video: null,
  setVideo: (video) => set({ video }),
  setFetching: (value) => set({ isFetching: value }),
}));
