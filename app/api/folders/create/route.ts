import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(request: NextResponse) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unautherized user" }, { status: 401 });
    }
    const body = await request.json();
    const { name, userId: bodyUserId, parentId = null } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "Unautherized user" }, { status: 401 });
    }

    if (!name || name.trim() === "" || typeof name !== "string") {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const [existingItem] = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.name, name.trim()),
        )
      );

    if (existingItem) {
      return NextResponse.json(
        {
          error:
            "A file or folder with this name already exists in this location",
        },
        { status: 400 }
      );
    }

    // validation using sql (and,eq) for creating folder

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent Folder not found" },
          { status: 401 }
        );
      }
    }

    const folderData = {
      id: uuidv4(),
      name: name.trim(),
      path: `/folders/${userId}/${uuidv4()}`,
      size: 0,
      type: "Folder",
      fileUrl: "",
      thumbnailUrl: null,
      userId,
      parentId,
      isFolder: true,
      isStarted: false,
      isTrash: false,
    };
    const [newFile] = await db.insert(files).values(folderData).returning();
    return NextResponse.json(
      {
        success: true,
        message: "Folder created successfully",
        folder: newFile,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Folder not create" }, { status: 404 });
  }
}
