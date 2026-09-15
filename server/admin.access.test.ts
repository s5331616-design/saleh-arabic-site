import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access", () => {
  it("rejects a regular authenticated user from reading messages", async () => {
    const caller = appRouter.createCaller(
      createContext({
        id: 2,
        openId: "regular-user",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      })
    );

    await expect(caller.admin.messages()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects malformed public booking input before any side effects", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.submit({ name: "A", phone: "123", service: "" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
