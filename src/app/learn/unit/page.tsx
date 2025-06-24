import BookUnitsClient from "./BookUnitsClient";
import { fallbackUnits } from "@/lib/data/fallback-unit";

export default async function BookUnits() {
  return <BookUnitsClient units={fallbackUnits} />;
}
