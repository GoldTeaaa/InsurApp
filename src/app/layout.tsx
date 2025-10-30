import ClientProviders from "@/providers/ClientProvider";
import "../style/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = { 
  title: "InsureCo", description: "Internal CRM" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className="h-full">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
