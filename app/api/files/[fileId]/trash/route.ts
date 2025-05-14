import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const { fileId } = await props.params;
    if (!fileId) {
      return NextResponse.json({ error: "File is required" }, { status: 401 });
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not Found" }, { status: 401 });
    }

    const updatefile = await db
      .update(files)
      .set({ isTrash: !file.isTrash })
      .where(and(eq(files.userId, userId), eq(files.id, fileId)))
      .returning();

    const action = file.isTrash ? "move to trash" : "restored";
    return NextResponse.json({
      ...updatefile,
      message: `file ${action} successfully`,
    });
  } catch (Error) {
    return NextResponse.json(
      { error: "Error in updating trash" },
      { status: 500 }
    );
  }
}
