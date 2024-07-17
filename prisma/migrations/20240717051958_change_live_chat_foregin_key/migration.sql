/*
  Warnings:

  - Added the required column `liveStreamId` to the `LiveChat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveChat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payload" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "liveStreamId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "LiveChat_liveStreamId_fkey" FOREIGN KEY ("liveStreamId") REFERENCES "LiveStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiveChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiveChat" ("created_at", "id", "payload", "updated_at", "userId") SELECT "created_at", "id", "payload", "updated_at", "userId" FROM "LiveChat";
DROP TABLE "LiveChat";
ALTER TABLE "new_LiveChat" RENAME TO "LiveChat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
