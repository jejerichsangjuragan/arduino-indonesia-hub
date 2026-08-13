import { beforeEach, describe, expect, it, vi } from "vitest";
import { moderationUpdateValues, updateCommunityProjectStatus } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    createCommunityProject: vi.fn(),
    createStoredFile: vi.fn(),
    listCommunityProjects: vi.fn().mockResolvedValue([]),
    listStoredFiles: vi.fn().mockResolvedValue([]),
    updateCommunityProjectStatus: vi.fn().mockResolvedValue({ id: 1, status: "approved", moderatorNote: "Looks good", moderatedBy: 7, moderatedAt: new Date() }),
  };
});

function contextWithRole(role: "user" | "admin"): TrpcContext {
  const now = new Date();
  return {
    user: { id: 7, openId: `moderation-${role}`, name: "Moderator Test", email: "moderator@example.com", loginMethod: "test", role, createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("project moderation access", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks regular users from the moderation queue", async () => {
    const caller = appRouter.createCaller(contextWithRole("user"));
    await expect(caller.projects.moderationQueue()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks regular users from changing moderation status", async () => {
    const caller = appRouter.createCaller(contextWithRole("user"));
    await expect(caller.projects.moderate({ id: 1, status: "approved", moderatorNote: null })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("builds exact approval metadata for a moderator decision", () => {
    const moderatedAt = new Date("2026-08-14T00:00:00.000Z");
    expect(moderationUpdateValues("approved", "Looks good", 7, moderatedAt)).toEqual({ status: "approved", moderatorNote: "Looks good", moderatedBy: 7, moderatedAt });
    expect(moderationUpdateValues("rejected", "Needs wiring diagram", 7, moderatedAt)).toEqual({ status: "rejected", moderatorNote: "Needs wiring diagram", moderatedBy: 7, moderatedAt });
  });

  it("records approval status, note, moderator, and moderation timestamp", async () => {
    const caller = appRouter.createCaller(contextWithRole("admin"));
    const result = await caller.projects.moderate({ id: 1, status: "approved", moderatorNote: "Looks good" });
    expect(updateCommunityProjectStatus).toHaveBeenCalledWith(1, "approved", "Looks good", 7);
    expect(result).toMatchObject({ id: 1, status: "approved", moderatorNote: "Looks good", moderatedBy: 7 });
    expect(result?.moderatedAt).toBeInstanceOf(Date);
  });

  it("records rejected status through the admin mutation", async () => {
    const caller = appRouter.createCaller(contextWithRole("admin"));
    await caller.projects.moderate({ id: 2, status: "rejected", moderatorNote: "Needs wiring diagram" });
    expect(updateCommunityProjectStatus).toHaveBeenCalledWith(2, "rejected", "Needs wiring diagram", 7);
  });

});
