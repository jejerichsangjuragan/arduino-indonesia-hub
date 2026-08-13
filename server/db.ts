import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { CommunityProject, InsertCommunityProject, InsertStoredFile, InsertUser, communityProjects, storedFiles, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createStoredFile(file: InsertStoredFile) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(storedFiles).values(file);
  return { id: Number(result[0].insertId), ...file };
}

export async function listStoredFiles(ownerId?: number, projectId?: number) {
  const db = await getDb();
  if (!db) return [];
  const filters = [ownerId === undefined ? undefined : eq(storedFiles.ownerId, ownerId), projectId === undefined ? undefined : eq(storedFiles.projectId, projectId)].filter(Boolean) as NonNullable<ReturnType<typeof and>>[];
  if (filters.length > 0) return db.select().from(storedFiles).where(and(...filters));
  return db.select().from(storedFiles);
}

export async function createCommunityProject(project: InsertCommunityProject) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(communityProjects).values(project);
  return { id: Number(result[0].insertId), ...project };
}

export async function listCommunityProjects(status?: CommunityProject["status"]) {
  const db = await getDb();
  if (!db) return [];
  if (status) return db.select().from(communityProjects).where(eq(communityProjects.status, status));
  return db.select().from(communityProjects);
}

export function moderationUpdateValues(status: CommunityProject["status"], moderatorNote: string | null, moderatedBy: number, moderatedAt = new Date()) {
  return { status, moderatorNote, moderatedBy, moderatedAt };
}

export type ModerationRepository = {
  updateProject: (id: number, values: ReturnType<typeof moderationUpdateValues>) => Promise<CommunityProject | undefined>;
};

export async function moderateProjectWithRepository(repository: ModerationRepository, id: number, status: CommunityProject["status"], moderatorNote: string | null, moderatedBy: number) {
  return repository.updateProject(id, moderationUpdateValues(status, moderatorNote, moderatedBy));
}

function createDbModerationRepository(db: any): ModerationRepository {
  return {
    updateProject: async (id, values) => {
      await db.update(communityProjects).set(values).where(eq(communityProjects.id, id));
      const rows = await db.select().from(communityProjects).where(eq(communityProjects.id, id)).limit(1);
      return rows[0];
    },
  };
}

export async function updateCommunityProjectStatus(id: number, status: CommunityProject["status"], moderatorNote: string | null, moderatedBy: number, repository?: ModerationRepository) {
  const db = repository ? null : await getDb();
  if (!repository && !db) throw new Error("Database is not available");
  const activeRepository = repository ?? createDbModerationRepository(db);
  return moderateProjectWithRepository(activeRepository, id, status, moderatorNote, moderatedBy);
}

