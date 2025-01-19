import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase-test";

export async function GET() {
  try {
    const isConnected = await testSupabaseConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: "Error al conectar con la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Conexión exitosa con la base de datos" });
  } catch (error) {
    console.error("[DATABASE_TEST_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 