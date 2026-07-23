import { randomUUID } from "node:crypto";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { PageContent } from "@/types/page";

//
// Types
//

export type PublishedPageRecord = {
  pageId: string;
  editToken: string;
  content: PageContent;
  createdAt: string;
  updatedAt: string;
};

//
// Paths
//

const DATA_DIR = path.join(process.cwd(), ".data", "pages");

async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await readdir(path.join(process.cwd(), ".data")).catch(() => undefined);
    const { mkdir } = await import("node:fs/promises");
    await mkdir(DATA_DIR, { recursive: true });
  }
}

function pagePath(pageId: string): string {
  return path.join(DATA_DIR, `${pageId}.json`);
}

//
// ID validation
//

export function isSafeId(input: string): boolean {
  return typeof input === "string" && input.length > 0 && input.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(input);
}

//
// Storage functions
//

export async function savePublishedPage(content: PageContent): Promise<{
  pageId: string;
  editToken: string;
  publicUrl: string;
  editUrl: string;
}> {
  await ensureDataDir();

  const pageId = randomUUID();
  const editToken = randomUUID();
  const now = new Date().toISOString();

  const record: PublishedPageRecord = {
    pageId,
    editToken,
    content,
    createdAt: now,
    updatedAt: now,
  };

  await writeFile(pagePath(pageId), JSON.stringify(record, null, 2), "utf-8");

  return {
    pageId,
    editToken,
    publicUrl: `/p/${pageId}`,
    editUrl: `/edit/${editToken}`,
  };
}

export async function getPublishedPage(pageId: string): Promise<PublishedPageRecord | null> {
  if (!isSafeId(pageId)) return null;

  await ensureDataDir();

  const filePath = pagePath(pageId);

  try {
    const raw = await readFile(filePath, "utf-8");
    const record = JSON.parse(raw) as PublishedPageRecord;
    return record;
  } catch {
    return null;
  }
}

export async function getPublishedPageByEditToken(editToken: string): Promise<PublishedPageRecord | null> {
  if (!isSafeId(editToken)) return null;

  await ensureDataDir();

  try {
    const files = await readdir(DATA_DIR);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
      const record = JSON.parse(raw) as PublishedPageRecord;

      if (record.editToken === editToken) {
        return record;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function updatePublishedPageByEditToken(
  editToken: string,
  content: PageContent,
): Promise<PublishedPageRecord | null> {
  const record = await getPublishedPageByEditToken(editToken);

  if (!record) return null;

  const updated: PublishedPageRecord = {
    ...record,
    content,
    updatedAt: new Date().toISOString(),
  };

  await writeFile(pagePath(record.pageId), JSON.stringify(updated, null, 2), "utf-8");

  return updated;
}
