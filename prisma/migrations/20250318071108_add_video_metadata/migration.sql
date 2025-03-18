-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "bigThumbnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallThumbnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
