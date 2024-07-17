/*
  Warnings:

  - The primary key for the `LiveChat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `LiveChat` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveChat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "liveStreamId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "LiveChat_liveStreamId_fkey" FOREIGN KEY ("liveStreamId") REFERENCES "LiveStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiveChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiveChat" ("created_at", "id", "liveStreamId", "payload", "updated_at", "userId") SELECT "created_at", "id", "liveStreamId", "payload", "updated_at", "userId" FROM "LiveChat";
DROP TABLE "LiveChat";
ALTER TABLE "new_LiveChat" RENAME TO "LiveChat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
