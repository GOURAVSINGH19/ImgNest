import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  console.log("first");
  try {
    console.log("second");

    console.log("Starting file upload process");
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formuserId = formData.get("userId") as string;
    const formparentId = (formData.get("parentId") as string) || null;

    console.log("Received data:", {
      fileType: file?.type,
      fileSize: file?.size,
      userId: formuserId,
      parentId: formparentId,
    });

    if (formuserId !== userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 401 });
    }

    if (formparentId) {
      try {
        const [parentFolder] = await db
          .select()
          .from(files)
          .where(and(eq(files.id, formparentId), eq(files.userId, userId)));

        if (!parentFolder) {
          console.log("Parent folder not found:", formparentId);
          return NextResponse.json(
            { error: "Parent folder not found" },
            { status: 404 }
          );
        }

        if (!parentFolder.isFolder) {
          console.log("Attempted to upload to non-folder:", formparentId);
          return NextResponse.json(
            { error: "Cannot upload to a file. Please select a folder." },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Database error checking parent folder:", error);
        return NextResponse.json(
          { error: "Error validating parent folder" },
          { status: 500 }
        );
      }
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only images and PDF are supported" },
        { status: 400 }
      );
    }

    console.log("third");

    try {
      let fileBuffer: Buffer;

      if (typeof file.arrayBuffer === "function") {
        const buffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(buffer);
      } else {
        console.error(
          "Uploaded file is not a valid Blob/File. Cannot read buffer."
        );
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

      console.log("Attempting ImageKit upload:", {
        fileName: uniquefilename,
        folderPath,
        fileSize: fileBuffer.length,
      });

      const Uploadresponse = await imagekit.upload({
        file: fileBuffer,
        fileName: uniquefilename,
        folder: folderPath,
        useUniqueFileName: false,
      });

      console.log("ImageKit upload successful:", Uploadresponse);

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

      console.log("Inserting into DB:", fileData);

      const [newFile] = await db.insert(files).values(fileData).returning();
      toast.success("File Uploaded Successfully")
      return NextResponse.json(newFile);
    } catch (error) {
      console.error("Error during file processing:", error);
      return NextResponse.json(
        { error: "Error processing file upload" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in file upload:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
