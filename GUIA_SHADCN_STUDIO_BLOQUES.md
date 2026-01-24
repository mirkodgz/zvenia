# 🎨 Guía: Qué Buscar en shadcnstudio.com

## 📦 Bloques/Componentes Recomendados para `/admin/posts/create`

### 1. **Form Blocks** (Prioridad Alta)
**Buscar:** "Form Blocks" o "Form Components"
- Necesitamos: Formulario base con validación
- Ubicación: Dashboard & Application UI → Form Blocks
- Qué copiar: El bloque de formulario completo

### 2. **File Upload Component** (Prioridad Alta)
**Buscar:** "File Upload" o "Image Upload" o "File Input"
- Necesitamos: Componente para subir imágenes y PDFs
- Ubicación: Dashboard & Application UI → File Upload
- Qué copiar: El componente de upload con preview

### 3. **Input Variants** (Prioridad Media)
**Buscar:** "Input" o "Text Input" o "Form Input"
- Necesitamos: Campos de texto mejorados
- Ubicación: Components → Input
- Qué copiar: Variantes de Input (con iconos, validación, etc.)

### 4. **Select/Dropdown** (Prioridad Media)
**Buscar:** "Select" o "Dropdown" o "Combobox"
- Necesitamos: Para seleccionar Topic
- Ubicación: Components → Select
- Qué copiar: Select con búsqueda (si tienen)

### 5. **Rich Text Editor** (Prioridad Baja - Opcional)
**Buscar:** "Rich Text Editor" o "Text Editor" o "WYSIWYG"
- Necesitamos: Editor de contenido
- Ubicación: Dashboard & Application UI → Editor
- Nota: Si no tienen, usaremos textarea por ahora

### 6. **Card/Container** (Prioridad Baja)
**Buscar:** "Card" o "Container"
- Necesitamos: Contenedor para el formulario
- Ubicación: Components → Card
- Qué copiar: Card con header y body

---

## 🔍 Cómo Buscar en shadcnstudio.com

1. **Ir a:** https://shadcnstudio.com/
2. **Navegar a:** "Blocks" → "Dashboard & Application UI"
3. **Buscar:**
   - "Form Blocks"
   - "File Upload"
   - "Input Components"
   - "Select Components"

---

## 📋 Checklist de Componentes a Copiar

- [ ] Form Block (base del formulario)
- [ ] File Upload Component (imágenes/PDFs)
- [ ] Input Component (título, slug, excerpt)
- [ ] Select Component (topic selector)
- [ ] Textarea Component (contenido)
- [ ] Button Variants (submit, cancel)
- [ ] Card/Container (wrapper del formulario)

---

## 💡 Tips

1. **Copia el código completo** del bloque, no solo partes
2. **Revisa las dependencias** que necesitas instalar
3. **Adapta los estilos** a tu tema (ya tienes tema claro)
4. **Mantén la estructura** pero cambia los campos según necesites

---

## 🚀 Siguiente Paso

Una vez que tengas los bloques copiados, los integraremos en:
- `/admin/posts/create` - Página de creación
- Reutilizando la lógica de `PostForm.tsx` existente

