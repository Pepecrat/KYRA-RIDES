import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized"
        }),
        { status: 401 }
      );
    }

    // Generate JWT
    const payload = {
      sub: user.id,
      email: user.emailAddresses[0].emailAddress,
      role: "user"
    };

    const token = await signJWT(payload);

    return NextResponse.json({
      token
    });

  } catch (error) {
    console.log('[TOKEN_ERROR]', error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Error"
      }),
      { status: 500 }
    );
  }
} 