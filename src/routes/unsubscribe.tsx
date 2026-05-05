import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({ meta: [{ title: "Cancelar suscripción · TAABAL" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="max-w-md p-10 text-center">
        <Logo className="h-12 mx-auto mb-6" />
        <h1 className="font-display text-3xl mb-3">Suscripción cancelada</h1>
        <p className="text-muted-foreground text-sm">No volverás a recibir comunicaciones de TAABAL. ¡Gracias por considerarnos!</p>
      </Card>
    </div>
  ),
});
