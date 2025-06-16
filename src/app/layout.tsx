import "@/styles/globals.css";
import { inter } from "@/app/ui/fonts";
import NavMenu from "@/components/NavMenu/NavMenu";
import RightMenu from "@/components/RightMenu/RightMenu";
import HeaderMenu from "@/components/HeaderMenu/HeaderMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50 font-sans md:pl-48 lg:pl-64">
          <NavMenu />
          <div className="py-6 px-4 flex flex-wrap lg:flex-nowrap gap-4">
            <main className="w-full lg:min-w-2/3">
              <HeaderMenu />
              <div className="min-h-96 w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {children}
              </div>
            </main>
            <RightMenu />
          </div>
        </div>
      </body>
    </html>
  );
}
