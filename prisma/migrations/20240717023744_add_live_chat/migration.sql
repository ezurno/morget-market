-- CreateTable
CREATE TABLE "LiveChat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payload" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "LiveChat_id_fkey" FOREIGN KEY ("id") REFERENCES "LiveStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiveChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
