import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/90"
          }
        }}
      />
    </main>
  );
} 