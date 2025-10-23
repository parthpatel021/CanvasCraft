import { Metadata } from "next";
import ToolBar from "./ui/toolbar/toolbar";

export const metadata: Metadata = {
  title: "Draw | CanvasCraft",
  description:"An interactive React-based drawing app that lets users freely create shapes and lines on a canvas using intuitive mouse controls and a simple toolbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`bg-zinc-900 text-white h-screen w-full`}>
      <ToolBar />
      {children}
    </div>
  );

}
