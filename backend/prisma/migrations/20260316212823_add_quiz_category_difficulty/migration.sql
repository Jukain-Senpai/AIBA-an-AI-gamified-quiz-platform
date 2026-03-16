-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'Easy';
