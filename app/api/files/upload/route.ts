import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formuserId = formData.get("userId") as string;
    const formparentId = (formData.get("parentId") as string) || null;

    if (formuserId !== userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 401 });
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only images and PDF are supported" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    if (formparentId) {
      try {
        const [parentFolder] = await db
          .select()
          .from(files)
          .where(and(eq(files.id, formparentId), eq(files.userId, userId)));

        if (!parentFolder) {
          return NextResponse.json(
            { error: "Parent folder not found" },
            { status: 404 }
          );
        }

        if (!parentFolder.isFolder) {
          return NextResponse.json(
            { error: "Cannot upload to a file. Please select a folder." },
            { status: 400 }
          );
        }
      } catch (error) {
        console.log("Error in Uploading File",error)
        return NextResponse.json(
          { error: "Error validating parent folder" },
          { status: 500 }
        );
      }
    }

    try {
      let fileBuffer: Buffer;

      if (typeof file.arrayBuffer === "function") {
        const buffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(buffer);
      } else {
        return NextResponse.json(
          { error: "Invalid file upload. Try a different file or browser." },
          { status: 400 }
        );
      }

      const originalfilename = file.name;
      const fileExtension = originalfilename.split(".").pop() || "";
      const uniquefilename = `${uuidv4()}.${fileExtension}`;
      const folderPath = formparentId
        ? `/droply/${userId}/folder/${formparentId}`
        : `/droply/${userId}`;

      if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.startsWith('pk_') || 
          !process.env.IMAGEKIT_PRIVATE_KEY?.startsWith('private_') || 
          !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.startsWith('https://ik.imagekit.io/')) {
        return NextResponse.json(
          { error: "ImageKit configuration error", details: "Invalid ImageKit credentials format" },
          { status: 500 }
        );
      }

      const Uploadresponse = await imagekit.upload({
        file: fileBuffer,
        fileName: uniquefilename,
        folder: folderPath,
        useUniqueFileName: false,
      });

      const fileData = {
        name: originalfilename,
        path: Uploadresponse.filePath,
        size: file.size,
        type: file.type,
        fileUrl: Uploadresponse.url,
        thumbnailUrl: Uploadresponse.url || null,
        parentId: formparentId,
        userId,
        isFolder: false,
        isStarted: false,
        isTrash: false,
      };

      const [newFile] = await db.insert(files).values(fileData).returning();
      return NextResponse.json(newFile);
    } catch (err) {
      console.error("Error in file upload:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "File upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
