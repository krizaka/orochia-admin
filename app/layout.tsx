import type { Metadata } from "next";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orochia Admin — Platform Governance, 2257 Vault & Treasury",
  description: "Executive control plane for Orochia platform operator. 18 U.S.C. § 2257 compliance custodian, DMCA triage, and protocol monetization engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-violet-600 selection:text-white">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
