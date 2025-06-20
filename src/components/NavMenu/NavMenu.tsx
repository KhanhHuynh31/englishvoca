// components/NavMenu.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";
import NavMenuClient from "./NavMenuClient";

export default async function NavMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return <NavMenuClient isLoggedIn={isLoggedIn} />;
}
