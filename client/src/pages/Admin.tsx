import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock3, Inbox, Loader2, LogIn, Phone, RefreshCw, Trash2, UserRound } from "lucide-react";
import { useLocation } from "wouter";

const statusLabels = {
  new: "جديد",
  contacted: "تم التواصل",
  closed: "مغلق",
} as const;

const statusClasses = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  closed: "bg-emerald-100 text-emerald-800",
} as const;

function AdminContent() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const messagesQuery = trpc.admin.messages.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchOnWindowFocus: false,
  });
  const statusMutation = trpc.admin.updateMessageStatus.useMutation({
    onSuccess: () => {
      utils.admin.messages.invalidate();
      toast.success("تم تحديث حالة الرسالة");
    },
    onError: () => toast.error("تعذر تحديث الرسالة"),
  });
  const deleteMutation = trpc.admin.deleteMessage.useMutation({
    onSuccess: () => {
      utils.admin.messages.invalidate();
      toast.success("تم حذف الرسالة");
    },
    onError: () => toast.error("تعذر حذف الرسالة"),
  });

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>;
  }

  if (!user) {
    return (
      <div dir="rtl" className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white"><LogIn size={24} /></div>
          <h1 className="text-2xl font-bold text-slate-950">دخول المشرف</h1>
          <p className="mt-3 leading-7 text-slate-500">سجّل الدخول بحساب مالك الموقع للوصول إلى رسائل الحجز وإدارتها.</p>
          <Button className="mt-6 w-full bg-slate-900 hover:bg-slate-800" onClick={() => startLogin()}>تسجيل الدخول</Button>
          <button className="mt-4 text-sm text-slate-500 underline" onClick={() => setLocation("/")}>العودة إلى الموقع</button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div dir="rtl" className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-950">ليس لديك صلاحية مشرف</h1>
          <p className="mt-3 leading-7 text-slate-500">استخدم حساب مالك المشروع المصرّح له بالدخول إلى لوحة الرسائل.</p>
          <Button className="mt-6 bg-slate-900 hover:bg-slate-800" onClick={() => setLocation("/")}>العودة إلى الموقع</Button>
        </div>
      </div>
    );
  }

  const messages = messagesQuery.data ?? [];
  const newCount = messages.filter((message) => message.status === "new").length;
  const contactedCount = messages.filter((message) => message.status === "contacted").length;
  const closedCount = messages.filter((message) => message.status === "closed").length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-slate-500">لوحة المشرف</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">رسائل الحجز</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 sm:inline-flex">{user.name || user.email}</span>
            <Button variant="outline" onClick={() => setLocation("/")}>عرض الموقع</Button>
            <Button variant="outline" size="icon" aria-label="تحديث الرسائل" onClick={() => messagesQuery.refetch()}><RefreshCw size={17} /></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Inbox size={19} />} label="رسائل جديدة" value={newCount} tone="amber" />
          <StatCard icon={<Phone size={19} />} label="تم التواصل" value={contactedCount} tone="blue" />
          <StatCard icon={<Clock3 size={19} />} label="مغلقة" value={closedCount} tone="emerald" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div><h2 className="text-lg font-bold">كل طلبات الحجز</h2><p className="mt-1 text-sm text-slate-500">تُحفظ الطلبات هنا حتى بعد إغلاق نافذة الموقع.</p></div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{messages.length} رسالة</span>
          </div>

          {messagesQuery.isLoading ? (
            <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-slate-400" /></div>
          ) : messagesQuery.isError ? (
            <div className="p-10 text-center text-rose-600">تعذر تحميل الرسائل. تحقق من صلاحية المشرف ثم أعد المحاولة.</div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center text-slate-500"><Inbox size={30} /><p>لا توجد طلبات حجز حتى الآن.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((message) => (
                <article key={message.id} className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center">
                    <div className="flex items-start gap-3"><span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><UserRound size={18} /></span><div><h3 className="font-semibold">{message.name}</h3><a className="mt-1 block text-sm text-blue-700 hover:underline" dir="ltr" href={`tel:${message.phone}`}>{message.phone}</a></div></div>
                    <div><p className="text-xs font-medium text-slate-400">الخدمة المطلوبة</p><p className="mt-1 font-medium text-slate-700">{message.service}</p></div>
                    <div><p className="text-xs font-medium text-slate-400">تاريخ الطلب</p><p className="mt-1 text-sm text-slate-700">{new Date(message.createdAt).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" })}</p></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <select aria-label={`حالة رسالة ${message.name}`} value={message.status} disabled={statusMutation.isPending} onChange={(event) => statusMutation.mutate({ id: message.id, status: event.target.value as keyof typeof statusLabels })} className={`rounded-full border-0 px-3 py-2 text-sm font-semibold outline-none ring-1 ring-inset ring-slate-200 ${statusClasses[message.status]}`}>
                      <option value="new">{statusLabels.new}</option><option value="contacted">{statusLabels.contacted}</option><option value="closed">{statusLabels.closed}</option>
                    </select>
                    <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`حذف رسالة ${message.name}`} disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ id: message.id })}><Trash2 size={17} /></Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "amber" | "blue" | "emerald" }) {
  const colors = { amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", emerald: "bg-emerald-50 text-emerald-700" };
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}>{icon}</span><strong className="text-3xl tracking-tight">{value}</strong></div><p className="mt-4 text-sm font-medium text-slate-500">{label}</p></div>;
}

export default function Admin() {
  return <DashboardLayout><AdminContent /></DashboardLayout>;
}
