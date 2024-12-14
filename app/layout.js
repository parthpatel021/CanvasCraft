import "./globals.css";

export const metadata = {
  title: "CanvasCraft",
  description: "A drawing application that enables users to create shapes and lines on a canvas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={``}>
        {children}
      </body>
    </html>
  );
}
