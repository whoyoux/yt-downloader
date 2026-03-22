import "server-only";

import { Innertube, Log, UniversalCache } from "youtubei.js";

export function getYoutube() {
  Log.setLevel(Log.Level.ERROR);
  return Innertube.create({ cache: new UniversalCache(true) });
}
