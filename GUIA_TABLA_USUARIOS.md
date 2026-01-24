# 👥 Guía de la Tabla de Usuarios - Admin ZVENIA

## 📍 Acceso

### URL
```
http://localhost:4321/admin/users
```

### Requisitos
- ✅ Debes estar autenticado
- ✅ Tu rol debe ser **Administrator** (no CountryManager)

---

## 🎯 Funcionalidades

### ✅ Búsqueda Global
- Busca en múltiples campos simultáneamente:
  - Email
  - Nombre completo
  - Nombre y apellido
  - Empresa
  - Posición
  - Profesión
  - País de trabajo
  - Nacionalidad
  - Rol
  - Username

### ✅ Ordenamiento
- Haz clic en cualquier encabezado de columna para ordenar
- Soporta orden ascendente (↑) y descendente (↓)
- Columnas ordenables:
  - Usuario
  - Email
  - Rol
  - Empresa
  - Posición
  - País
  - Profesión
  - Fecha de creación

### ✅ Paginación
- 20 usuarios por página
- Navegación con botones "Anterior" y "Siguiente"
- Muestra el rango actual (ej: "Mostrando 1 a 20 de 150 usuarios")

### ✅ Edición Inline
- Haz clic en "Editar" en cualquier fila
- Puedes editar:
  - **Rol**: Selecciona de la lista desplegable
  - **País**: Campo de texto
- Guarda con "Guardar" o cancela con "Cancelar"

### ✅ Acciones
- **Ver**: Abre el perfil público del usuario (si tiene `profile_slug`)
- **Editar**: Activa el modo de edición inline
- **Eliminar**: Elimina el usuario (con confirmación)

---

## 📊 Columnas Mostradas

| Columna | Descripción | Ordenable |
|---------|-------------|-----------|
| **Usuario** | Avatar + Nombre completo + Username | ✅ |
| **Email** | Dirección de correo electrónico | ✅ |
| **Rol** | Rol del usuario (con badge de color) | ✅ |
| **Empresa** | Nombre de la empresa | ✅ |
| **Posición** | Cargo/Posición en la empresa | ✅ |
| **País** | País de trabajo o nacionalidad | ✅ |
| **Profesión** | Profesión del usuario | ✅ |
| **Creado** | Fecha de creación (dd/MM/yyyy) | ✅ |
| **Acciones** | Ver, Editar, Eliminar | ❌ |

---

## 🎨 Badges de Rol

Los roles se muestran con colores distintivos:

- 🔴 **Administrator** - Rojo
- 🔵 **CountryManager** - Azul
- 🟣 **Expert** - Morado
- 🟡 **Ads** - Amarillo
- 🟢 **Events** - Verde
- ⚪ **Basic** - Gris

---

## 🔍 Ejemplos de Búsqueda

### Buscar por email:
```
admin@zvenia.com
```

### Buscar por nombre:
```
Juan Pérez
```

### Buscar por empresa:
```
Mining Corp
```

### Buscar por país:
```
Chile
```

### Buscar por rol:
```
Administrator
```

---

## ⚙️ Funcionalidades Técnicas

### Actualización Manual
- Botón de actualizar (↻) en la barra superior
- Recarga todos los usuarios desde la base de datos

### Filtrado en Tiempo Real
- La búsqueda se aplica mientras escribes
- No necesitas presionar Enter

### Responsive
- La tabla tiene scroll horizontal en pantallas pequeñas
- Todas las columnas son visibles

---

## ⚠️ Notas Importantes

### Eliminación de Usuarios
- ⚠️ **La eliminación es permanente**
- Se elimina el registro de la tabla `profiles`
- El usuario en `auth.users` NO se elimina automáticamente
- Considera eliminar también de `auth.users` si es necesario

### Edición de Roles
- Solo puedes editar el rol y el país de trabajo
- Para editar otros campos, usa el perfil del usuario o edita directamente en Supabase

### Perfil Público
- El botón "Ver" solo aparece si el usuario tiene `profile_slug`
- Si no tiene slug, no se mostrará el botón

---

## 🚀 Próximas Mejoras (Plan)

- [ ] Filtros avanzados (por rol, país, fecha)
- [ ] Exportar usuarios a CSV
- [ ] Bulk actions (editar múltiples usuarios)
- [ ] Vista detallada del usuario (modal o página)
- [ ] Historial de cambios
- [ ] Estadísticas de usuarios (gráficos)

---

**Última actualización:** 22/01/2026

