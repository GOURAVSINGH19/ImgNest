//take the user id , data and image form frontend
// and save in database

import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });

    // parse req body
    const body = await request.json();
    const { imagekit, userId: bodyUserId } = body;
    
    if (bodyUserId != userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json({ error: "Invalid data" }, { status: 401 });
    }

    //Extract data from imagekit
    const fileData = {
      name: imagekit.name || "untitled",
      userId: userId,
      path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      parentId: null,
      isFolder: false,
      isStarted: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (Error) {
    return NextResponse.json(
      { error: "Failed to save file information" },
      { status: 500 }
    );
  }
}
