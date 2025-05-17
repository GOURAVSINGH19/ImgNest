import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

// Recursive delete
export async function deleteFolderAndContents(
  folderId: string,
  userId: string
) {
  const children = await db
    .select()
    .from(files)
    .where(and(eq(files.parentId, folderId), eq(files.userId, userId)));

  for (const item of children) {
    if (item.isFolder) {
      await deleteFolderAndContents(item.id, userId); // ✅ recurse properly
    } else {
      if (item.fileUrl) {
        const fileName = item.fileUrl.split("?")[0].split("/").pop();
        try {
          const result = await imagekit.listFiles({ name: fileName, limit: 1 });
          if (result.length > 0) {
            await imagekit.deleteFile(result[0].createdAt); // Use fileId
          }
        } catch (err) {
          console.error("ImageKit deletion failed for", fileName, err);
        }
      }

      await db.delete(files).where(eq(files.id, item.id));
    }
  }

  // Delete the folder itself
  await db.delete(files).where(eq(files.id, folderId));
}

// Route handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId))); // ✅ fixed

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
    toast.success("File delete SuccessFully");


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
