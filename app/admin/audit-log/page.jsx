import NavAdmin from "@/components/NavAdmin";
import { ambilRiwayatAuditLog } from "@/lib/audit-log";
import { formatTanggal } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Audit Log Aktivitas - Admin Petskarta",
};

export default async function HalamanAdminAuditLog() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const logs = await ambilRiwayatAuditLog();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Audit Log Aktivitas Admin (50 Terakhir)
        </h1>
        <p className="text-sm text-teks-lembut">
          Catatan riwayat perubahan data kelinci, tarif layanan, ulasan, atau pengaturan toko untuk akuntabilitas operasional.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-permukaan border-b border-garis text-xs uppercase tracking-wider text-teks-lembut">
            <tr>
              <th className="p-3.5">Waktu</th>
              <th className="p-3.5">Admin</th>
              <th className="p-3.5">Aksi</th>
              <th className="p-3.5">Rincian Perubahan</th>
              <th className="p-3.5">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {logs.map((item) => (
              <tr key={item.id} className="hover:bg-permukaan/30">
                <td className="p-3.5 text-xs text-teks-lembut whitespace-nowrap">
                  {formatTanggal(item.created_at)}
                </td>
                <td className="p-3.5 font-bold text-xs text-teks">
                  {item.admin_email}
                </td>
                <td className="p-3.5 text-xs">
                  <span className="rounded-md bg-utama/15 px-2 py-0.5 font-bold text-utama">
                    {item.aksi}
                  </span>
                </td>
                <td className="p-3.5 text-xs text-teks leading-relaxed">
                  {item.rincian}
                </td>
                <td className="p-3.5 text-xs font-mono text-teks-lembut">
                  {item.target_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

