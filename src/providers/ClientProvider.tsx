'use client';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
}