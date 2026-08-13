import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createStoredFile, listStoredFiles } from "./db";
import { storagePut } from "./storage";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/x-c++src",
  "application/octet-stream",
]);

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  files: router({
    listMine: protectedProcedure.query(({ ctx }) => listStoredFiles(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.string().min(1).max(128),
        sizeBytes: z.number().int().positive().max(MAX_FILE_BYTES),
        context: z.enum(["tutorial", "project", "schematic", "sketch", "build-log"]),
        dataBase64: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!allowedMimeTypes.has(input.mimeType)) {
          throw new Error("Tipe file tidak didukung. Gunakan gambar, PDF, teks, atau sketch Arduino.");
        }
        const data = Buffer.from(input.dataBase64, "base64");
        if (data.byteLength !== input.sizeBytes || data.byteLength > MAX_FILE_BYTES) {
          throw new Error("Ukuran file tidak valid atau melebihi batas 10 MB.");
        }
        const originalName = safeName(input.fileName);
        const { key, url } = await storagePut(`${ctx.user.id}-files/${input.context}/${originalName}`, data, input.mimeType);
        return createStoredFile({
          ownerId: ctx.user.id,
          originalName: input.fileName,
          storageKey: key,
          url,
          mimeType: input.mimeType,
          sizeBytes: data.byteLength,
          context: input.context,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
