import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "./components/toastProvider/ToastProvider";
import { AuthProvider } from "@/context/AuthContext"; // Importa el AuthProvider
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext'; // Importar FavoritesProvider
import { FaWhatsapp } from 'react-icons/fa';
import Header from "./components/header/Header";

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
  const whatsappNumber = '+524461199704'; // Aquí pon el número de WhatsApp al que quieres redirigir
  const message = 'Hola';
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Aquí envolvemos la app con el AuthProvider */}
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header/>
              {children}
              <ToastProvider />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        {/* Icono de WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-12 z-50 right-5 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <FaWhatsapp size={30} color="white" />
        </a>
      </body>
    </html>
  );
}
