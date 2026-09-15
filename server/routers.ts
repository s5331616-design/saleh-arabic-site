import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createBookingMessage,
  deleteBookingMessage,
  listBookingMessages,
  updateBookingMessageStatus,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  booking: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(120),
          phone: z.string().trim().min(7).max(40),
          service: z.string().trim().min(2).max(80),
        })
      )
      .mutation(async ({ input }) => {
        const message = await createBookingMessage({
          name: input.name,
          phone: input.phone,
          service: input.service,
        });

        let delivered = false;
        try {
          delivered = await notifyOwner({
            title: `طلب حجز جديد من ${input.name}`,
            content: [
              "وصل طلب حجز جديد من موقع Saleh.",
              `الاسم: ${input.name}`,
              `رقم الجوال: ${input.phone}`,
              `الخدمة المطلوبة: ${input.service}`,
              "يرجى التواصل مع العميل لتأكيد الموعد.",
            ].join("\n"),
          });
        } catch (error) {
          console.warn("[Booking] Saved message but notification delivery failed:", error);
        }

        return { success: Boolean(message), notified: delivered } as const;
      }),
  }),

  admin: router({
    messages: adminProcedure.query(async () => listBookingMessages()),
    updateMessageStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "contacted", "closed"]),
        })
      )
      .mutation(({ input }) => updateBookingMessageStatus(input.id, input.status)),
    deleteMessage: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => ({ success: await deleteBookingMessage(input.id) })),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
