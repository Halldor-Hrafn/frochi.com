import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { CodeXml } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Frochi",
    description: "The fastest way to Frochi around",
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
                        <Navbar />
                        <div className="relative flex min-h-screen flex-col">
                            {children}
                        </div>

                        <footer
                            className="w-full flex items-center justify-around border-t mx-auto text-center text-xs gap-8 py-4">
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
                            <Button variant={'ghost'}>
                                <a href="https://github.com/Halldor-Hrafn/frochi.com">
                                    <CodeXml size={20} />
                                </a>
                            </Button>
                        </footer>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
