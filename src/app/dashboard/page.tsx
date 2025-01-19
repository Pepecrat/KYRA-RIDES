import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contenido del Dashboard */}
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bienvenido a Kyra Rides</h2>
            <p className="text-muted-foreground mb-4">
              Tu plataforma de transporte seguro y confiable.
            </p>
            <Button>Comenzar</Button>
          </div>
        </div>
      </div>
    </main>
  );
} 