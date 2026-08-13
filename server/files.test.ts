import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("files", () => {
  it("requires authentication to list private files", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.files.listMine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires authentication to upload a file", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.files.upload({
      fileName: "robot.ino",
      mimeType: "text/plain",
      sizeBytes: 4,
      context: "sketch",
      dataBase64: "dGVzdA==",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
