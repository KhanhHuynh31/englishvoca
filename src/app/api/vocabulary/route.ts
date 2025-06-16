// app/api/vocabulary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const unitId = searchParams.get("unit_id");
  let query = supabase.from("vocabulary").select("*");
  if (unitId) {
    query = query.eq("unit_id", unitId);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
