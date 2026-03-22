"use client";

import { ClipboardPaste } from "lucide-react";
import type { ComponentProps } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { en } from "@/locales/en";
import { Button } from "./ui/button";

type PasteButtonProps = {
  onClick: ComponentProps<typeof Button>["onClick"];
};

const PasteButton = ({ onClick }: PasteButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={onClick}
        type="button"
        variant="secondary"
        size="icon"
        className="aspect-square border-border"
      >
        <ClipboardPaste />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{en.pasteButton.tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export default PasteButton;
