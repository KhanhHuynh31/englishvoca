// app/api/units/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createSupabaseServerClient(); // ✅ Bây giờ đây là async
  const { data, error } = await supabase.from("unit").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
