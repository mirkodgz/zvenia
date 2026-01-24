# 📄 Explicación: Plantilla del Single Post

## 🎯 URL y Ruta

**URL:** `http://localhost:4321/post/electronic-detonators`  
**Archivo:** `src/pages/post/[slug].astro`

---

## 🔄 Flujo de Funcionamiento

### **PASO 1: Captura del Slug**
```typescript
const { slug } = Astro.params;
// slug = "electronic-detonators"
```

### **PASO 2: Detección Híbrida (Slug o UUID)**
El sistema es inteligente y puede buscar por:
- **Slug** (ej: `electronic-detonators`) ✅ Tu caso
- **UUID** (ej: `4e7642e5-0365-413d-82c4-236fda1d1e76`)

```typescript
const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
const columnName = isUuid ? 'id' : 'slug';
// En tu caso: columnName = 'slug'
```

### **PASO 3: Consulta a Supabase**
```typescript
const { data: post, error } = await supabase
    .from('posts')
    .select(`
        *, 
        author:profiles(full_name, avatar_url, profession, company),
        topic:topics(name, slug)
    `)
    .eq(columnName, slug)  // Busca por slug = "electronic-detonators"
    .single();
```

**Qué trae:**
- ✅ Todos los campos del post (`*`)
- ✅ Información del autor (nombre, avatar, profesión, empresa)
- ✅ Información del topic (nombre, slug)

### **PASO 4: Validación**
```typescript
if (error || !post) {
    return Astro.redirect('/404');  // Si no existe, redirige a 404
}
```

### **PASO 5: Renderizado**
```astro
<SocialLayout title={`${post.title} | Zvenia Social`}>
    <LeftSidebar slot="left-sidebar" />
    
    <div class="max-w-3xl mx-auto px-4 sm:px-0">
        <PostCard post={post} currentUser={currentUser} isDetail={true} />
    </div>

    <RightSidebar slot="right-sidebar" />
</SocialLayout>
```

---

## 🎨 Estructura del Layout

### **SocialLayout** (`src/layouts/SocialLayout.astro`)

```
┌─────────────────────────────────────────────────┐
│              Header (Fixed)                     │
├──────────┬──────────────────────┬───────────────┤
│          │                      │               │
│  LEFT    │    MAIN CONTENT      │    RIGHT      │
│ SIDEBAR  │   (Single Post)      │   SIDEBAR    │
│ (270px)  │   (max-w-3xl)        │   (300px)    │
│          │                      │               │
│          │   <PostCard>          │               │
│          │   isDetail={true}     │               │
│          │                      │               │
└──────────┴──────────────────────┴───────────────┘
```

---

## 🧩 Componente PostCard

**Archivo:** `src/components/social/PostCard.astro`

### **Prop `isDetail={true}`**

Cuando `isDetail={true}`, el componente muestra:

#### **1. Header (Autor y Fecha)**
- Avatar del autor (clickeable → `/in/{author_id}`)
- Nombre del autor con badge de verificación
- Botón "Follow" (si no es el propio usuario)
- Profesión y fecha de publicación
- Menú de opciones (Edit/Delete) si eres el autor

#### **2. Breadcrumb del Topic**
```astro
<a href={`/mining/${post.topic.slug}`}>
    # {post.topic.name}
</a>
```

#### **3. Título**
- **Si `isDetail={true}`:** `<h1>` grande (título de página)
- **Si `isDetail={false}`:** `<h4>` con link al post

#### **4. Contenido**
- Limpia HTML tags del contenido
- Muestra contenido completo (sin truncar)
- Si no es detail, muestra solo 3 líneas con "read more"

#### **5. Source (Fuente)**
- Si es URL → Link clickeable
- Si es texto → Muestra como texto

#### **6. Media (Multimedia)**
El componente detecta automáticamente qué tipo de media tiene:

**Prioridad:**
1. **YouTube Video** (`metadata.youtube_url`)
   - Extrae el ID del video
   - Muestra iframe embebido

2. **Video Nativo** (`metadata.video_url`)
   - Muestra `<video>` con controles

3. **PDF** (`document_url`)
   - Usa componente `PdfViewer` (React)
   - Proxy para evitar CORS

4. **Imagen/Galería**
   - Si hay 1 imagen → Muestra imagen simple
   - Si hay múltiples → Carousel con navegación

#### **7. Footer (Acciones Sociales)**
- Componente `SocialFooter` (React)
- Likes, Comments, Share
- Contador de interacciones

---

## 🔧 Funcionalidades JavaScript

### **1. Read More / Show Less**
```javascript
// Si NO es detail, permite expandir/colapsar contenido
button.addEventListener("click", () => {
    text.classList.toggle("line-clamp-3");
    button.textContent = text.classList.contains("line-clamp-3")
        ? "...read more"
        : "Show less";
});
```

### **2. Carousel de Imágenes**
```javascript
// Navegación entre imágenes de la galería
prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
});
```

---

## 📊 Datos que se Muestran

### **Del Post:**
- ✅ Título
- ✅ Contenido (limpio de HTML)
- ✅ Excerpt (si existe)
- ✅ Fecha de publicación/creación
- ✅ Source (fuente)
- ✅ Featured image
- ✅ Document PDF
- ✅ Gallery (múltiples imágenes)
- ✅ YouTube/Video URLs (en metadata)

### **Del Autor:**
- ✅ Nombre completo
- ✅ Avatar
- ✅ Profesión
- ✅ Empresa
- ✅ Link a perfil (`/in/{author_id}`)

### **Del Topic:**
- ✅ Nombre del topic
- ✅ Link al topic (`/mining/{topic.slug}`)

---

## 🎨 Estilos y Tema

- **Fondo:** `bg-[var(--bg-surface)]` (tema claro/oscuro según CSS variables)
- **Bordes:** `border-[var(--border-color)]`
- **Texto:** `text-[var(--text-main)]` y `text-[var(--text-secondary)]`
- **Hover:** Efectos de transición en links y botones

---

## 🔗 Relaciones de Base de Datos

```
posts
├── author_id → profiles.id (FK)
├── topic_id → topics.id (FK)
└── metadata (JSONB)
    ├── gallery: string[]
    ├── youtube_url: string
    └── video_url: string
```

---

## 🚀 Resumen del Flujo Completo

1. **Usuario visita:** `/post/electronic-detonators`
2. **Astro captura:** `slug = "electronic-detonators"`
3. **Supabase busca:** Post donde `slug = "electronic-detonators"`
4. **Trae relaciones:** Autor y Topic automáticamente
5. **Renderiza:** `PostCard` con `isDetail={true}`
6. **Muestra:** Contenido completo, media, acciones sociales
7. **Layout:** 3 columnas (Left Sidebar | Content | Right Sidebar)

---

## 💡 Puntos Clave

- ✅ **SSR (Server-Side Rendering):** Todo se carga en el servidor
- ✅ **Híbrido:** Funciona con slug o UUID
- ✅ **Responsive:** Se adapta a móviles (oculta sidebars)
- ✅ **Reutilizable:** `PostCard` se usa en listado Y en detalle
- ✅ **Media Inteligente:** Detecta automáticamente el tipo de media
- ✅ **SEO Friendly:** Título dinámico en `<title>`

---

¿Quieres que modifique algo específico de esta plantilla?

