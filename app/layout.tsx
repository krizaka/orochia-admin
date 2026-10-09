import "./globals.css";

import { ThemeProvider, ThemeScript } from "@krizaka/ui/theme";
import type { Metadata } from "next";

import { AdminHeader } from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { currentAdmin } from "@/lib/account";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orochia Admin — Control Plane",
  description: "Operator console for Orochia: 2257 creator verification, content reports, payouts and treasury.",
  robots: { index: false, follow: false },
};

/** Both themes: ThemeScript applies the persisted mode before the first paint (html.light), the header toggles it. */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-surface-0 text-fg antialiased">
        <ThemeProvider>
          {admin ? (
            <div className="flex min-h-screen">
              <AdminSidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader admin={admin} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
              </div>
            </div>
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
