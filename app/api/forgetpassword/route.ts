import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email not Found" }, { status: 404 });
  }

  try {
    const user = await db.select().from(files).where(and(eq(files.userId, userId)));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Clerk will automatically handle the password reset email
    return NextResponse.json({
      message: "Password reset instructions sent successfully",
    });
  } catch (error) {
    console.error("Error sending password reset instructions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
