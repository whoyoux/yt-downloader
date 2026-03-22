"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import type { FetchVideoSuccessResponse } from "@/actions/fetch-video";
import { fetchVideo } from "@/actions/fetch-video";
import { en } from "@/locales/en";
import { useVideoStore } from "@/stores/video-store";

const formSchema = z.object({
  url: z.url(en.validation.invalidUrl),
});

type FetchVideoSuccessData = FetchVideoSuccessResponse["video"];

export const useFetchVideoForm = () => {
  const setVideo = useVideoStore((state) => state.setVideo);
  const setFetching = useVideoStore((state) => state.setFetching);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setFetching(true);
      const res = await fetchVideo({ url: data.url });
      setFetching(false);

      if (res.data?.success && res?.data?.video) {
        setVideo(res?.data?.video);
      } else if (!res.data?.success) {
        toast.error(en.toast.genericError);
      }
    });
  };

  const copyFromClipboardToURLInput = async () => {
    const text = await navigator.clipboard.readText();
    form.setValue("url", text);
    form.trigger("url");
  };

  return {
    form,
    isPending,
    onSubmit,
    copyFromClipboardToURLInput,
  };
};

export type { FetchVideoSuccessData };
