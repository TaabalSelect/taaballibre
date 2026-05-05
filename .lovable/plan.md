
# TAABAL Barras Libres — Landing de lujo + Admin

Landing premium para servicio de barras libres de mixología en bodas de la Riviera Maya, con mascota conejo interactiva, animación scroll de margarita y panel de administración con backend real.

## Sistema visual

- **Paleta**: ónix (#0A0A0A), grises profundos, crema (#F5EDE0), acentos dorado apagado / púrpura / naranja inspirados en el degradado del logo.
- **Tipografías**: Google Fonts — *Cinzel* o *IM Fell DW Pica* (distressed/rústico-elegante) para títulos; *Inter* para cuerpo.
- **Procesamiento de imágenes**: las 9 imágenes subidas se procesan con eliminación de fondo (script con rembg/PIL) → PNGs transparentes guardados en `src/assets/rabbit/` y el logo en `src/assets/logo.png`.
- **Mascota conejo**: componente reutilizable `<RabbitPeek variant="..." />` con animaciones Framer Motion para "peek-a-boo" según scroll (IntersectionObserver + transform).

## Arquitectura de rutas (TanStack)

```
/                  Landing (single-page con secciones largas)
/admin-taabal      Login admin (email + password vía Lovable Cloud)
/admin-taabal/dashboard   Panel CMS protegido
/unsubscribe       Página requerida por sistema de emails
```

## Secciones de la landing

1. **Hero**: fondo nocturno de barra (imagen Unsplash con blur sutil), logo TAABAL + conejo `CONEJO_1` (sentado), título, subtítulo, CTA dorado "Solicita tu Cotización Personalizada" que hace scroll al formulario.
2. **Por qué TAABAL**: 4 pilares en grid (Mixología de Autor, Servicio Excepcional, Presentación Impecable, Servicio Fluido sin tokens). Conejo `CONEJO_5` asomándose por borde izquierdo al entrar en viewport.
3. **Margarita Scroll Experience** (pieza central):
   - Secuencia de ~40 frames PNG fotorrealistas pre-generados de copa vacía → escarchado → hielos → tequila → naranja → twist limón.
   - Sticky section de 400vh; canvas dibuja el frame correspondiente al `scrollYProgress`.
   - Texto a la izquierda fade-in por etapa ("Sal del Mar", "Hielo cristalino", "Tequila premium", etc.).
   - Conejo `CONEJO_2` (patas levantadas) absolute detrás de la copa, con sutil bobbing.
4. **Paquetes** (Signature / Premium / Personalizado): 3 tarjetas con borde dorado, hover lift + glow. Precios y descripciones editables desde admin. Conejo `CONEJO_7` o `CONEJO_8` asomándose entre tarjetas.
5. **Galería de Bodas Reales**: grid masonry, imágenes gestionadas desde admin (Supabase Storage). Conejo `CONEJO_3` peek-a-boo lateral al scrollear.
6. **Contacto**: formulario sofisticado (Nombre, Email, Teléfono, Fecha boda, Ubicación dropdown, Invitados, Mensaje). Validación con Zod. Al enviar:
   - Guarda en tabla `leads`
   - Envía email de confirmación al cliente + email de notificación al equipo TAABAL (Lovable Emails)
   - Botón secundario "WhatsApp directo" abre wa.me con mensaje prellenado
   - Conejo `CONEJO_1` acompañando lateral.
7. **Footer**: logo, conejo pequeño, redes sociales (editables), copyright, links a secciones.

## Micro-interacciones del conejo

- `RabbitPeek` con `variant`, `position` (left/right), `offset`, animación `whileInView` (Framer Motion) que desliza el conejo desde fuera del viewport al entrar.
- Hover en CTA: conejo "sprint" (`CONEJO_4`) que cruza brevemente.

## Panel de administración (`/admin-taabal`)

**Stack**: Lovable Cloud (auth email+password con rol `admin`, tablas con RLS, storage bucket público `gallery`).

**Tablas**:
- `site_content` (key/value JSON: textos hero, pilares, paquetes, contacto, redes, WhatsApp)
- `gallery_images` (id, url, position, alt)
- `leads` (id, nombre, email, teléfono, fecha_boda, ubicación, invitados, mensaje, created_at)
- `user_roles` (user_id, role) con función `has_role()` security-definer

**Pantallas del dashboard** (sidebar):
- **Contenido**: forms para WhatsApp, emails, redes, descripciones de paquetes, textos pilares.
- **Galería**: grid drag & drop (dnd-kit) para reordenar; subir/eliminar imágenes; preview en vivo.
- **Leads**: tabla de solicitudes recibidas con filtros y export CSV.

UI: shadcn (Card, Input, Button, Table) con tema oscuro consistente.

## Detalles técnicos

- **Frames margarita**: generados con script Python/Pillow desde un PNG base de copa + capas (sal, hielos, líquidos) compuestos por etapas. Guardados en `public/margarita/frame-001.png` … `frame-040.png`. Precarga progresiva.
- **Eliminación de fondo conejos**: script Python con `rembg` antes del primer build; output a `src/assets/rabbit/*.png`.
- **Emails**: Lovable Emails (requiere setup de dominio). Templates React Email: `lead-confirmation.tsx` (al cliente) y `lead-notification.tsx` (al equipo). Si el usuario no quiere setup de dominio aún, los emails quedan enqueued y se entregan cuando se verifique.
- **WhatsApp**: número configurable desde admin; link `https://wa.me/<num>?text=<encodeURIComponent(msg)>`.
- **SEO**: meta tags en `head()` del index, og:image con foto de barra premium.
- **Performance**: lazy load de frames margarita, imágenes Galería con loading=lazy, fonts con `display: swap`.
- **Despliegue**: TanStack Start ya configurado para edge; rutas relativas; assets en `public/` y `src/assets/`.

## Lo que necesitaré preguntarte después de aprobar

- Número de WhatsApp real (placeholder por ahora)
- Email del equipo para notificaciones de leads
- Si quieres que configure ya el dominio de email (o lo dejamos pendiente)
- Credenciales iniciales del admin (puedo crear un usuario seed)
