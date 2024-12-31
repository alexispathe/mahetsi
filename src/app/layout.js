import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";
import { AuthProvider } from "@/context/AuthContext"; // Importa el AuthProvider
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext'; // Importar FavoritesProvider
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Mahets'i & Boh'o",
  description: "La mejor tienda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Aquí envolvemos la app con el AuthProvider */}
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <ToastProvider /> 
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
