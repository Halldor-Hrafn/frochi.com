import DeployButton from "@/components/deploy-button";
import {EnvVarWarning} from "@/components/env-var-warning";
import HeaderAuth from "@/components/navbar";
import {ThemeSwitcher} from "@/components/theme-switcher";
import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import Link from "next/link";
import "./globals.css";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Next.js and Supabase Starter Kit",
    description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <main className="min-h-screen flex flex-col items-center">
                <Navbar/>
                <div className="relative flex min-h-screen flex-col ">
                    {children}
                </div>

                <footer
                    className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
                    <p>
                        Copyright {new Date().getFullYear()}&copy;
                    </p>
                    <p>
                        Powered by {" "}
                        <a
                            href="https://fb.is"
                            target="_blank"
                            className="font-bold hover:underline"
                            rel="noreferrer"
                        >háa@fb
                        </a>
                    </p>
                    <ThemeSwitcher/>
                </footer>
            </main>
        </ThemeProvider>
        </body>
        </html>
    );
}
