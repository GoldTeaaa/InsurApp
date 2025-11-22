import ClientProviders from "@/providers/ClientProvider";
import "../style/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
