-- DropForeignKey
ALTER TABLE "upVote" DROP CONSTRAINT "upVote_streamId_fkey";

-- AddForeignKey
ALTER TABLE "upVote" ADD CONSTRAINT "upVote_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
