import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

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

    /// file is not a foler then delete file from imagekit
    if (!file.isFolder) {
      try {
        let imagekitFileId = null;

        if (file.fileUrl) {
          const urlWithoutquery = file.fileUrl.split("?")[0];
          imagekitFileId = urlWithoutquery.split("/").pop();
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
          } catch (searcherror) {
            console.log("Error in searching file", searcherror);
            await imagekit.deleteFile(imagekitFileId);
          }
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Error in Folder Deleting" },
          { status: 500 }
        );
      }
    }

    // delete file from db
    const [deletedFile] = await db
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    toast.success("File delete SuccessFully");

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedFile,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error in Deleting file form db and imagekit",
    });
  }
}
