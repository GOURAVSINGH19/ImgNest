import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  });
  

export async function DELETE() {
    try {
        // Get all files from database
        const allFiles = await db.select().from(files);
        
        // Delete files from ImageKit
        const deletePromises = allFiles.map(async (file) => {
            if (file.path) {
                try {
                    // Extract file ID from path
                    const fileId = file.path.split('/').pop()?.split('.')[0];
                    if (fileId) {
                        await imagekit.deleteFile(fileId);
                    }
                } catch (error) {
                    console.error(`Error deleting file from ImageKit: ${file.path}`, error);
                }
            }
        });

        // Wait for all ImageKit deletions to complete
        await Promise.all(deletePromises);

        // Delete all records from database
        await db.delete(files);

        return NextResponse.json({ 
            success: true, 
            message: "All files deleted successfully" 
        });
    } catch (error) {
        console.error("Error in delete-all route:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to delete files" 
            },
            { status: 500 }
        );
    }
} 