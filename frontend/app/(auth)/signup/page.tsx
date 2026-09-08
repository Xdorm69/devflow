import Link from "next/link";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-foreground">Create your account</h1>
      <form className="flex flex-col gap-4">
        <InputField label="Username" type="text" name="username" placeholder="janedoe" required />
        <InputField label="Email" type="email" name="email" placeholder="you@company.com" required />
        <InputField label="Password" type="password" name="password" placeholder="••••••••" required />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground hover:text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}