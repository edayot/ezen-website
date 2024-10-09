import "@/app/globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <meta
        name="google-site-verification"
        content="jD6OnB_lklNZ7DZCON3p3WD8KhE0CxlpeXLvZ_f_pV0"
      />
      <body className={inter.className}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ToastContainer />
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
