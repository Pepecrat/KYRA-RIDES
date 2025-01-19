import { UserProfile } from "@clerk/nextjs";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-[800px] w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Completa tu Perfil</h1>
        <UserProfile
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
              formButtonPrimary: 
                "bg-primary text-primary-foreground hover:bg-primary/90",
              formFieldInput: 
                "bg-background text-foreground border border-input",
            },
          }}
        />
      </div>
    </main>
  );
} 