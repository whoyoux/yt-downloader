/**
 * All user-visible English copy for the app lives here.
 * Edit this file to change wording across the UI and API messages.
 */

export const en = {
  meta: {
    brandName: "YouTube Downloader",
    title: "YouTube Video Downloader - Paste URL, Pick Quality",
    description:
      "Paste a YouTube link, preview the video, and download in the quality you choose. For personal, lawful use only - you must comply with laws and platform terms.",
    keywords: [
      "youtube downloader",
      "download youtube video",
      "youtube mp4",
      "save youtube video",
    ],
  },

  termsPage: {
    metaTitle: "Terms of Use",
    metaDescription:
      "Terms of use for this YouTube downloader tool: lawful personal use, copyright compliance, and limitation of liability.",
    backLink: "Go back",
    heading: "Terms of Use",
    paragraphs: [
      {
        id: "scope",
        text: "This project is provided for personal and lawful use only. By using this tool, you agree that you are fully responsible for how you use it and for any content you choose to download.",
      },
      {
        id: "lawful-use",
        text: "You may download content only when you have the legal right to do so, including permission from the copyright owner when required by law. You must comply with all applicable laws, platform rules, and terms of service, including YouTube's terms.",
      },
      {
        id: "no-infringement",
        text: "The authors and contributors do not encourage or support copyright infringement, piracy, or any illegal activity. The tool is provided as is, without warranties of any kind.",
      },
      {
        id: "liability",
        text: "The authors and contributors are not liable for any misuse of this project, any downloaded content, or any legal claims, damages, or losses arising from your use of this tool. If you do not agree with these terms, do not use this project.",
      },
    ],
  },

  disclaimer: {
    beforeLink:
      "Disclaimer: This tool is for personal and lawful use only. You are solely responsible for the content you download, and you must have the legal right or permission to download and use it. Read the full ",
    linkText: "Terms of Use",
    afterLink: ".",
  },

  fetchCard: {
    title: "YouTube Downloader",
    urlLabel: "URL",
    urlPlaceholder: "Paste a YouTube video URL",
    urlDescription: "Enter a valid YouTube video URL.",
    submit: "Fetch video",
  },

  videoCard: {
    thumbnailAlt: "Video thumbnail",
    viewsLabel: "views",
  },

  pasteButton: {
    tooltip: "Paste from clipboard",
  },

  downloadCard: {
    title: "Download",
    qualityLabel: "Quality",
    qualityPlaceholder: "Select a quality",
    qualityDescription: "Choose the quality you want to download.",
    acceptTermsBeforeLink: "I agree to the",
    acceptTermsLink: "Terms of Use",
    submit: "Download",
  },

  validation: {
    invalidUrl: "Please enter a valid URL.",
    selectQuality: "Please select a quality.",
    acceptTerms: "You must accept the Terms of Use to download.",
  },

  toast: {
    genericError: "Something went wrong. Please try again later.",
  },

  fetchVideo: {
    couldNotFetch:
      "Could not retrieve video information. Please check the URL and try again.",
  },

  api: {
    rateLimited: (retryAfterSeconds: number) =>
      `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
    invalidRequest: "Invalid request.",
    downloadFailed: "Something went wrong. Please try again later.",
    unauthorized: "Unauthorized.",
  },

  download: {
    defaultFilename: "video.mp4",
  },
} as const;

export type AppCopy = typeof en;
