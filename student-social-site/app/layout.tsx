// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Ascendre",
//   description: "Student Social Site",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dataTheme = "dark";
//   return (
//     <html lang="en" data-theme={dataTheme}>
//       <body className={inter.className + " p-0  overflow-hidden "}>
//         {children}
//       </body>
//     </html>
//   );
// }
"use client";
import "./globals.css";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import { BsMoonStarsFill } from "react-icons/bs";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });
const themes = [
  "mytheme",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataTheme, setDataTheme] = useState("light");

  const handleThemeChange = (theme: string) => {
    setDataTheme(theme);
  };

  return (
    <html lang="en" data-theme={dataTheme}>
      <body className={inter.className + " p-0  overflow-x-hidden"}>
        <Providers>
          <div className="theme-buttons fixed z-50 top-1 right-1 p-0 ">
            <details className="dropdown dropdown-end">
              <summary className="m-1 btn btn-neutral hover:btn-accent opacity-20 hover:opacity-100 hover:bg-opacity-40 border-0">
                <BsMoonStarsFill className="text-lg text-white" />
              </summary>
              <ul className="p-2 shadow menu dropdown-content bg-neutral text-accent  text-md rounded-box w-40 h-fit">
                {themes.map((theme) => (
                  <li className="selection::text-white" key={theme}>
                    <button
                      className="capitalize"
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                    >
                      {theme}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
