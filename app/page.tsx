import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  // ✅ Logged in → overview
  if (accessToken || refreshToken) {
    redirect("/overview");
  }

  // ❌ Not logged in → login
  redirect("/login");
}
