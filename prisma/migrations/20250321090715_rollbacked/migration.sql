/*
  Warnings:

  - You are about to drop the column `haveVoted` on the `Stream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "haveVoted",
ADD COLUMN     "haveUpVoted" BOOLEAN;

-- DropEnum
DROP TYPE "haveVoted";
