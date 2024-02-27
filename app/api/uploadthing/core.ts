import { auth } from '@clerk/nextjs'
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing();
 
const handleAuth = () => {
  const { userId } = auth()
  if (!userId) throw new Error("unauthorized")
  return { userId }
};
 
export const ourFileRouter = {
  serverImage: f({image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["pdf", "image"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;