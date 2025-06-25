import "@/styles/globals.css";
import NavMenu from "@/components/NavMenu/NavMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen overflow-y-auto">
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans md:pl-48 lg:pl-64">
          <NavMenu />
          <div className="flex-1 py-4 px-4 flex flex-wrap lg:flex-nowrap gap-4">
            <main className="w-full lg:min-w-2/3">
              <div className="w-full h-full min-h-[calc(100vh-4rem)] rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-start">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
