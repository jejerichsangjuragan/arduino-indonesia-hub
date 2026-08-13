import { describe, expect, it } from "vitest";
import { moderationUpdateValues, updateCommunityProjectStatus } from "./db";

describe("updateCommunityProjectStatus service", () => {
  it("persists rejected metadata through the production path", async () => {
    const projects = new Map([[3, { id: 3, ownerId: 21, title: "Line follower", description: "A community build", level: "Menengah" as const, status: "pending" as const, moderatorNote: null, submittedAt: new Date("2026-08-13T00:00:00.000Z"), moderatedAt: null, moderatedBy: null }]]);
    const repository = {
      updateProject: async (id: number, values: ReturnType<typeof moderationUpdateValues>) => {
        const current = projects.get(id);
        if (!current) return undefined;
        const updated = { ...current, ...values };
        projects.set(id, updated);
        return updated;
      },
    };
    const result = await updateCommunityProjectStatus(3, "rejected", "Needs wiring diagram", 7, repository);
    expect(result).toMatchObject({ id: 3, status: "rejected", moderatorNote: "Needs wiring diagram", moderatedBy: 7 });
    expect(result?.moderatedAt).toBeInstanceOf(Date);
    expect(projects.get(3)?.status).toBe("rejected");
  });
});
