import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
});

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const { fileId } = await props.params;
    if (!fileId) {
      return NextResponse.json({ error: "File is required" }, { status: 401 });
    }

    // Fetch all files belonging to the user
    const userFiles = await db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.id, fileId)));
    let deletedFiles;
    if (name == files.name) {
      // Delete each file from ImageKit if not a folder
      for (const file of userFiles) {
        if (!file.isFolder) {
          try {
            let imagekitFileId = null;

            if (file.fileUrl) {
              const urlWithoutQuery = file.fileUrl.split("?")[0];
              imagekitFileId = urlWithoutQuery.split("/").pop();
            }

            if (!imagekitFileId && file.path) {
              imagekitFileId = file.path.split("/").pop();
            }

            if (imagekitFileId) {
              try {
                const searchResults = await imagekit.listFiles({
                  name: imagekitFileId,
                  limit: 1,
                });

                if (searchResults && searchResults.length > 0) {
                  await imagekit.deleteFile(searchResults[0].name);
                } else {
                  await imagekit.deleteFile(imagekitFileId);
                }
              } catch (searchError) {
                console.error(
                  "Error searching or deleting file in ImageKit",
                  searchError
                );
                await imagekit.deleteFile(imagekitFileId);
              }
            }
          } catch (imageKitError) {
            console.error("ImageKit Deletion Error:", imageKitError);
          }
        }
      }

      // Delete files from DB
      deletedFiles = await db
        .delete(files)
        .where(eq(files.userId, userId))
        .returning();
      return NextResponse.json({
        success: true,
        message: "All files deleted successfully",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "files are not deleted successfully",
        deletedFiles,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 }
    );
  }
}

const middleware = () => {};
