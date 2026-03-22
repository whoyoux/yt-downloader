"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useDownloadForm } from "@/hooks/use-download-form";
import { en } from "@/locales/en";
import { useVideoStore } from "@/stores/video-store";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FORM_ELEMENT_ID = "download-form";

const DownloadCard = () => {
  const video = useVideoStore((state) => state.video);
  const isFetching = useVideoStore((state) => state.isFetching);
  const { form, onSubmit, isPending } = useDownloadForm();

  // biome-ignore lint/correctness/useExhaustiveDependencies: this useEffect has to run when video has changed
  useEffect(() => {
    form.reset();
  }, [video, form]);

  if (!video || isFetching) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{en.downloadCard.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id={FORM_ELEMENT_ID}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="itag"
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldLabel>{en.downloadCard.qualityLabel}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value.toString()}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue
                      placeholder={en.downloadCard.qualityPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{en.downloadCard.qualityLabel}</SelectLabel>
                      {video.formats.map((format) => (
                        <SelectItem
                          value={format.itag.toString()}
                          key={format.itag}
                        >
                          {format.qualityLabel}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {en.downloadCard.qualityDescription}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="acceptTerms"
            render={({ field, fieldState }) => (
              <FieldGroup>
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor={field.name}>
                    {en.downloadCard.acceptTermsBeforeLink}{" "}
                    <Link href="/terms" className="underline">
                      {en.downloadCard.acceptTermsLink}
                    </Link>
                  </FieldLabel>
                </Field>
              </FieldGroup>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-end px-8">
        <Button form={FORM_ELEMENT_ID} type="submit" loading={isPending}>
          {en.downloadCard.submit}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DownloadCard;
