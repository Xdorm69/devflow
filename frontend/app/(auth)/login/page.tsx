import Link from "next/link";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-foreground">Sign in to Devflow</h1>
      <form className="flex flex-col gap-4">
        <InputField label="Email" type="email" name="email" placeholder="you@company.com" required />
        <InputField label="Password" type="password" name="password" placeholder="••••••••" required />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground hover:text-accent">
          Create one
        </Link>
      </p>
    </div>
  );
}