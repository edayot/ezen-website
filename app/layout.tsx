import { ToastContainer } from "react-toastify"
import { Inter } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({children}: {children: React.ReactNode}) {
    return  (
    <html>
        <head>
        </head>
        <body className={inter.className}>
            <NextThemesProvider attribute="class" defaultTheme="dark">
            <ToastContainer/>
            {children}
            </NextThemesProvider>
        </body>
    </html>)
    

}