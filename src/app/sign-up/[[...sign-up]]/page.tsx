import SignUpForm from "../../../components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <SignUpForm />
    </main>
  );
}
