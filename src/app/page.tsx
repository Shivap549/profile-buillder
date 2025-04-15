import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { defaultLocale } from "@/i18n";

export default async function Home() {
  const session = await getServerSession(authOptions);
  redirect(`/${defaultLocale}/profile`);
}
