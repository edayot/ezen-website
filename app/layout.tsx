import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body className={inter.className}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ToastContainer />
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
