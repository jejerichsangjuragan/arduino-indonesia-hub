import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createCommunityProject, createStoredFile, listCommunityProjects, listStoredFiles, updateCommunityProjectStatus } from "./db";
import { storagePut } from "./storage";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf", "text/plain", "text/x-c++src", "application/octet-stream"]);
function safeName(name: string) { return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload"; }
const projectStatus = z.enum(["pending", "approved", "rejected"]);
const projectLevel = z.enum(["Pemula", "Menengah", "Mahir"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  projects: router({
    listApproved: publicProcedure.query(() => listCommunityProjects("approved")),
    submit: protectedProcedure.input(z.object({ title: z.string().min(3).max(180), description: z.string().min(20).max(5000), level: projectLevel })).mutation(({ ctx, input }) => createCommunityProject({ ownerId: ctx.user.id, ...input, status: "pending" })),
    listMine: protectedProcedure.query(({ ctx }) => listCommunityProjects().then((rows) => rows.filter((row) => row.ownerId === ctx.user.id))),
    moderationQueue: adminProcedure.input(z.object({ status: projectStatus.optional() }).optional()).query(({ input }) => listCommunityProjects(input?.status)),
    fileEvidence: adminProcedure.input(z.object({ projectId: z.number().int().positive() })).query(({ input }) => listStoredFiles(undefined, input.projectId)),
    moderate: adminProcedure.input(z.object({ id: z.number().int().positive(), status: projectStatus, moderatorNote: z.string().max(2000).nullable().optional() })).mutation(({ ctx, input }) => updateCommunityProjectStatus(input.id, input.status, input.moderatorNote ?? null, ctx.user.id)),
  }),
  files: router({
    listMine: protectedProcedure.query(({ ctx }) => listStoredFiles(ctx.user.id)),
    upload: protectedProcedure.input(z.object({ fileName: z.string().min(1).max(255), mimeType: z.string().min(1).max(128), sizeBytes: z.number().int().positive().max(MAX_FILE_BYTES), context: z.enum(["tutorial", "project", "schematic", "sketch", "build-log"]), projectId: z.number().int().positive().optional(), dataBase64: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      if (!allowedMimeTypes.has(input.mimeType)) throw new Error("Tipe file tidak didukung. Gunakan gambar, PDF, teks, atau sketch Arduino.");
      const data = Buffer.from(input.dataBase64, "base64");
      if (data.byteLength !== input.sizeBytes || data.byteLength > MAX_FILE_BYTES) throw new Error("Ukuran file tidak valid atau melebihi batas 10 MB.");
      const { key, url } = await storagePut(`${ctx.user.id}-files/${input.context}/${safeName(input.fileName)}`, data, input.mimeType);
      return createStoredFile({ ownerId: ctx.user.id, projectId: input.projectId, originalName: input.fileName, storageKey: key, url, mimeType: input.mimeType, sizeBytes: data.byteLength, context: input.context });
    }),
  }),
});

export type AppRouter = typeof appRouter;
