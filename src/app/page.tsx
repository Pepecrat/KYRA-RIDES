import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl mx-auto">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Kyra Rides</h1>
          <p className="text-base sm:text-lg mb-6 text-muted-foreground">
            Sistema de transporte seguro y confiable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" asChild>
              <Link href="/sign-up">
                <UserPlus className="mr-2 h-4 w-4" />
                Registrarse
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
} 