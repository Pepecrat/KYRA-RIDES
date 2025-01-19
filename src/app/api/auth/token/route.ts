import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Generar token JWT para el usuario autenticado
    const token = signJWT({
      userId,
      email: "user@example.com", // En producción, obtener del usuario real
      role: "USER",
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[TOKEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 