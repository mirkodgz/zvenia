# 📝 Paso a Paso: Crear Formulario de Posts en Admin

## 🎯 Objetivo
Crear `/admin/posts/create` usando bloques de shadcnstudio.com

---

## 📋 PASO 1: Buscar Bloques en shadcnstudio.com

### 🔍 Qué Buscar (en orden de prioridad):

#### 1. **Form Block** ⭐⭐⭐
- **Ir a:** https://shadcnstudio.com/
- **Navegar:** Blocks → Dashboard & Application UI → Form Blocks
- **Buscar:** "Form" o "Multi Step Form" o "Form Component"
- **Qué copiar:** El bloque completo del formulario
- **Ejemplo de lo que buscas:** Un formulario con campos, validación, botones

#### 2. **File Upload Component** ⭐⭐⭐
- **Navegar:** Blocks → Dashboard & Application UI → File Upload
- **Buscar:** "File Upload" o "Image Upload" o "File Input"
- **Qué copiar:** Componente con preview de imagen
- **Ejemplo:** Drag & drop o botón de upload con preview

#### 3. **Input Components** ⭐⭐
- **Navegar:** Components → Input
- **Buscar:** "Input" o "Text Input"
- **Qué copiar:** Variantes de Input (con label, error, iconos)
- **Ejemplo:** Input con validación visual

#### 4. **Select/Dropdown** ⭐⭐
- **Navegar:** Components → Select
- **Buscar:** "Select" o "Combobox" o "Dropdown"
- **Qué copiar:** Select con búsqueda (para Topic)
- **Ejemplo:** Select que permite buscar opciones

#### 5. **Textarea** ⭐
- **Navegar:** Components → Textarea
- **Buscar:** "Textarea" o "Text Area"
- **Qué copiar:** Textarea con contador de caracteres (opcional)
- **Ejemplo:** Textarea grande para contenido

#### 6. **Card/Container** ⭐
- **Navegar:** Components → Card
- **Buscar:** "Card" o "Container"
- **Qué copiar:** Card con header y body
- **Ejemplo:** Contenedor con título y contenido

---

## 📋 PASO 2: Mientras Buscas, Yo Creo la Estructura Base

Voy a crear:
1. `/admin/posts/create` - Página de creación
2. `/admin/posts/edit/[id]` - Página de edición
3. Adaptar `PostForm.tsx` para admin

---

## 📋 PASO 3: Integrar los Bloques

Una vez que tengas los bloques copiados:
1. Te diré dónde pegarlos
2. Adaptaremos los campos a nuestros datos
3. Conectaremos con la API existente

---

## 🎨 Campos que Necesitamos en el Formulario:

1. **Title** (Input) - Título del post
2. **Slug** (Input) - URL slug (auto-generado desde título)
3. **Topic** (Select) - Seleccionar topic
4. **Excerpt** (Textarea) - Resumen corto
5. **Content** (Textarea o Rich Text Editor) - Contenido completo
6. **Featured Image** (File Upload) - Imagen principal
7. **PDF Document** (File Upload) - Documento PDF (opcional)
8. **Source** (Input) - Fuente del contenido
9. **Gallery** (File Upload múltiple) - Galería de imágenes

---

## ⏱️ Tiempo Estimado:

- **Buscar bloques:** 10-15 minutos
- **Integrar:** 30-45 minutos
- **Total:** ~1 hora

---

## 🚀 Siguiente Acción:

1. **TÚ:** Busca los bloques en shadcnstudio.com
2. **YO:** Creo la estructura base ahora mismo
3. **JUNTOS:** Integramos los bloques cuando los tengas

¿Listo? Empieza buscando el **Form Block** primero! 🎯

