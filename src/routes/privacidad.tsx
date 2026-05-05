import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Aviso de Privacidad — TAABAL Barras Libres" },
      { name: "description", content: "Aviso de privacidad de TAABAL Barras Libres conforme a la LFPDPPP." },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: PrivacyPage,
});

const DEFAULT = `En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), TAABAL Barras Libres informa que los datos personales recabados a través de este sitio serán utilizados exclusivamente para responder a su solicitud de cotización y dar seguimiento comercial. No serán transferidos a terceros sin su consentimiento. Usted puede ejercer sus derechos ARCO escribiendo a hola@taabal.mx.`;

function PrivacyPage() {
  const [text, setText] = useState(DEFAULT);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "privacy").maybeSingle().then(({ data }) => {
      if (typeof data?.value === "string") setText(data.value);
      else if (data?.value && (data.value as any).text) setText((data.value as any).text);
    });
  }, []);
  return (
    <main className="min-h-screen bg-background text-foreground py-24 px-6">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Aviso de Privacidad</h1>
        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">{text}</div>
      </article>
    </main>
  );
}