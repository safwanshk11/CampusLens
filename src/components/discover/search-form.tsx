"use client";

import { useRouter } from "next/navigation";
import { useTransition, type FormEvent, type ReactNode } from "react";

/** One client island owns navigation. Results and cards stay server-rendered. */
export function SearchForm({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim())
        params.set(key, value.trim());
    }
    startTransition(() =>
      router.push(`/discover?${params.toString()}`, { scroll: false }),
    );
  }
  return (
    <form
      action="/discover"
      onSubmit={submit}
      aria-busy={pending}
      className="group/search"
    >
      {children}
      <p role="status" className="sr-only">
        {pending ? "Updating college results…" : "College results updated."}
      </p>
    </form>
  );
}
