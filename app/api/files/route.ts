import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
//fetching data from database

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");
    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // how we can access data form database
    // fetch files from database

    let userFiles;
    if (parentId) {
      //fetching from a specific folder
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.parentId, parentId), eq(files.userId, userId)));
    } else {
      userFiles = await db
        .select()
        .from(files)
        .where(and(isNull(files.parentId), eq(files.userId, userId)));
    }

    return NextResponse.json(userFiles);
  } catch (err) {
    console.error("Error in files route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
