"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { en } from "@/locales/en";
import { useVideoStore } from "@/stores/video-store";

const formSchema = z.object({
  itag: z.string().refine((val) => +val, en.validation.selectQuality),
  acceptTerms: z.boolean().refine((val) => !!val, {
    message: en.validation.acceptTerms,
  }),
});

export const useDownloadForm = () => {
  const video = useVideoStore((state) => state.video);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itag: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async ({
    itag,
    acceptTerms,
  }: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      if (!video) return;

      try {
        const response = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoId: video.id,
            itag: +itag,
            acceptTerms,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const filename =
          response.headers
            .get("Content-Disposition")
            ?.match(/filename="(.+)"/)?.[1] ?? en.download.defaultFilename;

        // Streamuj bezpośrednio do pobrania bez ładowania do pamięci
        const blob = new Blob([await response.arrayBuffer()], {
          type: "video/mp4",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          toast.error(err.message || en.toast.genericError);
        } else {
          toast.error(en.toast.genericError);
        }
      }
    });
  };

  return { form, onSubmit, isPending };
};
