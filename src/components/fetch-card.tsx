"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { en } from "@/locales/en";
import { useFetchVideoForm } from "../hooks/use-fetch-form";
import PasteButton from "./paste-button";

const FORM_ELEMENT_ID = "fetch-form";

const FetchCard = () => {
  const { form, isPending, onSubmit, copyFromClipboardToURLInput } =
    useFetchVideoForm();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">{en.fetchCard.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-8">
        <form id={FORM_ELEMENT_ID} onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="url"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {en.fetchCard.urlLabel}
                </FieldLabel>

                <div className="w-full flex gap-2 items-center">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder={en.fetchCard.urlPlaceholder}
                  />
                  <PasteButton onClick={copyFromClipboardToURLInput} />
                </div>
                <FieldDescription>
                  {en.fetchCard.urlDescription}
                </FieldDescription>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-end px-8">
        <Button type="submit" form={FORM_ELEMENT_ID} loading={isPending}>
          {en.fetchCard.submit}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FetchCard;
