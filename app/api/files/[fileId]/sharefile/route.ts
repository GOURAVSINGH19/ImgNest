import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function generateUrl(file: typeof files.$inferSelect) {
  if (file.type.startsWith("image/")) {
    return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
  }
  return file.fileUrl;
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ fileId: string; isPublic: boolean }> }
) {
  try {
    const { userId } = await auth();
    const { fileId, isPublic = false } = await props.params;    

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // If not public, require authentication
    if (!isPublic && !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const File = await db.query.files.findFirst({
      where: isPublic
        ? eq(files.id, fileId)
        : and(eq(files.id, fileId), eq(files.userId, userId || "")),
    });

    if (!File) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { name, type, size } = File;

    const generatedUrl = await generateUrl(File);

    return NextResponse.json({
      name,
      type,
      size,
      url: generatedUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a new GET endpoint for public access
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const File = await db.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    if (!File) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { name, type, size } = File;
    const generatedUrl = await generateUrl(File);

    return NextResponse.json({
      name,
      type,
      size,
      url: generatedUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
