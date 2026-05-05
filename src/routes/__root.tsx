import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TAABAL Barras Libres — Mixología de Lujo para Bodas en la Riviera Maya" },
      { name: "description", content: "Servicio exclusivo de barras libres y mixología premium para bodas en Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres." },
      { name: "author", content: "TAABAL" },
      { property: "og:title", content: "TAABAL Barras Libres — Mixología de Lujo para Bodas en la Riviera Maya" },
      { property: "og:description", content: "Servicio exclusivo de barras libres y mixología premium para bodas en Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "TAABAL Barras Libres — Mixología de Lujo para Bodas en la Riviera Maya" },
      { name: "twitter:description", content: "Servicio exclusivo de barras libres y mixología premium para bodas en Cancún, Tulum, Playa del Carmen, Puerto Morelos e Isla Mujeres." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/714ed114-d5c1-41e5-9866-292ba4b69525/id-preview-99766be7--4542f19a-64d8-40ab-baf2-ae2f9c90aecb.lovable.app-1777962241031.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/714ed114-d5c1-41e5-9866-292ba4b69525/id-preview-99766be7--4542f19a-64d8-40ab-baf2-ae2f9c90aecb.lovable.app-1777962241031.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </>
  );
}
