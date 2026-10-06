import type { Metadata } from "next";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { currentAdmin } from "@/lib/orochia";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orochia Admin — Control Plane",
  description: "Operator console for Orochia: 2257 creator verification, content reports, payouts and treasury.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-violet-600 selection:text-white">
        {admin ? (
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AdminHeader admin={admin} />
              <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
