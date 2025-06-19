// app/api/units/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Unit } from "@/app/types/unit";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("unit").select("*");
    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as Unit[], { status: 200 });
  } catch (err) {
    console.error("Unhandled error:", err);
    return NextResponse.json(
      { error: "Lỗi máy chủ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
