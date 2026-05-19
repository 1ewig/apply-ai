import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <div className="w-full max-w-md flex justify-center">
        <SignIn />
      </div>
    </main>
  );
}
