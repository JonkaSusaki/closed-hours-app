-- CreateTable
CREATE TABLE "ClosedHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" BIGINT,
    "initialHour" TEXT NOT NULL,
    "finalHour" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false
);
