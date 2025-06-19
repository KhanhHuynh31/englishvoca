// app/api/vocabulary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Vocabulary } from "@/app/types/vocabulary"; // ✅ import type

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const unitId = searchParams.get("unit_id");

  let query = supabase.from("vocabulary").select("*");

  if (unitId) {
    query = query.eq("unit_id", unitId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Lỗi Supabase:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as Vocabulary[]); 
}
