import "../style/globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = { 
  title: "InsureCo", description: "Internal CRM" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
