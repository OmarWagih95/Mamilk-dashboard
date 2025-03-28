"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/style.css";
import localFont from 'next/font/local';

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const NeueMontreal = localFont({
  src: "./fonts/PPNeueMontreal-Bold.woff",
});
const LibreFranklin = localFont({
  src: "./fonts/LibreFranklin-Regular.ttf",
});
const testFont = localFont({
  src: "./fonts/Exposure-[+40]Italic-205TF.otf",
});
const ExposureRegular = localFont({
  src: "./fonts/Exposure-[+40]-205TF.otf",
});


 const Gluten = localFont({
  src: "/fonts/Gluten.ttf",
});
 const Genos = localFont({
  src: "/fonts/Genos.ttf",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <title>MAMILK</title>
      <DndProvider backend={HTML5Backend}>
      <body suppressHydrationWarning={true} className={`${Genos.className} antialiased`}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {/* {loading ? <Loader /> : children} */}
          {children}
        </div>
      </body>
      </DndProvider>
    </html>
  );
}
