import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-context";
import Footer from "@/components/footer";
import Preloader from "@/components/preloader";

const font = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage-grotesque",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "XVote",
  description: "Open-source end-to-end encrypted anonymous polling app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
        <Toaster position="top-center" duration={2000} />
        <Preloader />
      </body>
    </html>
  );
}
