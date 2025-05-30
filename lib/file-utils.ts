import { db } from "@/drizzle/db";
import { files } from "@/drizzle/db/schema";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

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
      await deleteFolderAndContents(item.id, userId); 
    } else {
      if (item.fileUrl) {
        const fileName = item.fileUrl.split("?")[0].split("/").pop();
        try {
          const result = await imagekit.listFiles({ name: fileName, limit: 1 });
          if (result.length > 0) {
            await imagekit.deleteFile(result[0].createdAt); 
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