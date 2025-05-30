import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { deleteFolderAndContents } from "@/lib/file-utils";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

// Route handler
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    console.log(file);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (!file.isTrash) {
      return NextResponse.json(
        { error: "Item must be in trash to delete" },
        { status: 400 }
      );
    }

    if (file.isFolder) {
      await deleteFolderAndContents(fileId, userId);
    } else {
      if (file.fileUrl) {
        const fileName = file.fileUrl.split("?")[0].split("/").pop();
        try {
          const result = await imagekit.listFiles({ name: fileName, limit: 1 });
          if (result.length > 0) {
            await imagekit.deleteFile(result[0].createdAt);
          }
        } catch (err) {
          console.error("ImageKit deletion failed for", fileName, err);
        }
      }

      await db.delete(files).where(eq(files.id, fileId));
    }

    return NextResponse.json({
      success: true,
      message: "Item deleted permanently",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
