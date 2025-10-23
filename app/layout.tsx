import "./ui/globals.css";
import { inter } from "./ui/fonts";
import { Metadata } from "next";
import Navbar from "./ui/navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | E-Cart",
    default: "E-Cart Products",
  },
  description: "An e-commerce website with all require features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );

}
