import { NextResponse } from "next/server";

interface SupabaseUser {
  id: string;
  email: string;
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`, {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
    });

    const result = await res.json();
    const users = result.users as SupabaseUser[];

    const matchedUser = users.find((u) => u.email === email);

    return NextResponse.json({ exists: !!matchedUser });
  } catch (err: unknown) {
    console.error("Lỗi khi kiểm tra email:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
