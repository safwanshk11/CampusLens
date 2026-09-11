import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { currentUser } from "@/server/auth/session";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?next=%2Faccount");
  return (
    <Container className="pt-36 pb-24 sm:pt-40">
      <p className="eyebrow mb-4 text-azure-ink">CampusLens / Account</p>
      <h1 className="text-display-page">Welcome back, {user.name || "there"}.</h1>
      <p className="mt-5 text-body text-ink-secondary">{user.email}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/saved">View saved colleges</ButtonLink>
        <ButtonLink href="/discover" variant="secondary">Discover colleges</ButtonLink>
      </div>
    </Container>
  );
}
