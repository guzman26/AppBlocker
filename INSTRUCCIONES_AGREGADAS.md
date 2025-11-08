# Instrucciones Agregadas a la App

## Resumen

Se agregaron instrucciones completas en español en todas las pantallas de la app para que los usuarios sepan exactamente cómo usar cada funcionalidad.

## Cambios por Pantalla

### 🏠 HomeScreen (Pantalla de Inicio)

**1. Header traducido:**
- Título: "AppBlocker"
- Subtítulo: "Bloqueo consciente de aplicaciones"

**2. Guía de uso paso a paso (cuando está autorizado pero no hay apps seleccionadas):**
```
📖 Cómo usar AppBlocker

1️⃣ Toca "Seleccionar Apps" para elegir las apps que quieres bloquear
2️⃣ Activa el interruptor de bloqueo cuando quieras concentrarte
3️⃣ Configura intervenciones en la pestaña "Interventions"
```

**3. Card de autorización mejorada:**
- Título: "Autorización Requerida"
- Explicación clara de por qué se necesitan permisos
- Botón: "Otorgar Permiso"
- Mensaje de seguridad: "💡 Esto es seguro y solo permite a la app gestionar el bloqueo de apps en tu dispositivo."

**4. Textos traducidos:**
- Control principal: "Bloqueo"
- Estados: "Las apps están bloqueadas" / "Las apps no están bloqueadas"
- Banner cuando no hay selección: "Primero selecciona apps para bloquear"
- Botón principal: "Seleccionar Apps a Bloquear" / "Cambiar Apps"
- Lista de apps: "Apps Seleccionadas (X)"
- Descripción: "Estas apps se bloquearán cuando actives el bloqueo"

**5. Card informativa:**
```
💡 Cómo funciona

Cuando el bloqueo está activo, iOS mostrará un escudo al intentar
abrir apps bloqueadas. Ve a la pestaña "Interventions" para configurar
ejercicios de respiración y reflexión antes de desbloquear.
```

---

### 🫁 InterventionSettingsScreen (Pantalla de Intervenciones)

**1. Header traducido:**
- Título: "Intervenciones"
- Subtítulo: "Configura pausas conscientes al acceder a apps bloqueadas"

**2. Card informativa inicial:**
```
ℹ️ Cómo funcionan las intervenciones

Las intervenciones crean un espacio de reflexión entre el impulso de
abrir una app y la acción de hacerlo. Esto te ayuda a tomar decisiones
más conscientes sobre tu uso del teléfono.
```

**3. Secciones traducidas:**

**Toggle principal:**
- "Activar Intervenciones"
- "Agrega pausas conscientes antes de desbloquear apps"

**Ejercicio de Respiración:**
- Título: "Ejercicio de Respiración"
- Control: "Duración: Xs"
- Descripción: "Un ejercicio de respiración guiada para crear una pausa consciente. Ajusta entre 5 y 30 segundos según tu preferencia."

**Pregunta de Intención:**
- Título: "Pregunta de Intención"
- Control: "Preguntar Intención"
- Descripción: "Te pregunta por qué quieres abrir la app"
- Explicación: "Fomenta la toma de decisiones conscientes. Te ayuda a reflexionar si realmente necesitas abrir la app."

**Sugerencias de Alternativas:**
- Título: "Sugerencias de Alternativas"
- Control: "Mostrar Alternativas"
- Descripción: "Sugiere actividades más saludables"
- Explicación: "Ofrece alternativas productivas en lugar de distracciones. Te da ideas de otras cosas que podrías hacer."

**4. Card de consejos:**
```
💡 Consejos de Uso

• Empieza con el ejercicio de respiración de 8-10 segundos
• La pregunta de intención es muy efectiva para redes sociales
• Puedes desactivar las intervenciones y solo usar el bloqueo básico
```

---

### ⚙️ SettingsScreen (Pantalla de Configuración)

**1. Header traducido:**
- Título: "Configuración"
- Subtítulo: "Información y ayuda sobre la app"

**2. Sección Acerca de:**
- Título: "Acerca de"
- Nombre: "AppBlocker"
- Tagline: "Bloqueo consciente de apps"
- Versión: "Versión 0.1.0"

**3. Guía de uso completa paso a paso:**

```
📖 Guía de Uso Completa

1️⃣ Otorga Permisos
Primero, otorga acceso a Screen Time. Esto permite a la app bloquear
aplicaciones usando el sistema de iOS.

2️⃣ Selecciona Apps
Toca "Seleccionar Apps" en la pestaña Home. Se abrirá el selector
nativo de iOS donde puedes elegir qué apps quieres bloquear.

3️⃣ Activa el Bloqueo
Usa el interruptor de bloqueo para activar/desactivar. Cuando está
activo, iOS mostrará un escudo al intentar abrir apps bloqueadas.

4️⃣ Configura Intervenciones
Ve a la pestaña "Interventions" para configurar ejercicios de
respiración y preguntas de intención. Esto agrega pausas conscientes
antes de desbloquear.
```

**4. Sección "Cómo Funciona":**
```
AppBlocker usa la Screen Time API de Apple para bloquear apps.
Es el mismo sistema que usa iOS para el control parental, por lo
que es totalmente seguro y nativo.

La filosofía está inspirada en OneSec: en lugar de restricciones
rígidas, agrega "fricción consciente" mediante pausas de
respiración y reflexión.

Esto te ayuda a tomar decisiones más conscientes sobre tu uso del
teléfono sin sentirte frustrado por bloqueos permanentes.
```

**5. Requisitos traducidos:**
- "iOS 16 o superior" - "Necesario para usar la Screen Time API"
- "Permisos de Screen Time" - "Otorga el permiso en la pestaña Home"

**6. Sección de soporte:**
- "Ver en GitHub"
- "Contactar Soporte"

**7. Footer:**
- "Hecho con enfoque e intención"

---

### 📱 Tab Bar

**Labels traducidos:**
- Home → "Inicio"
- Interventions → "Intervenciones"
- Settings → "Ajustes"

---

## Características de las Instrucciones

### ✅ Claras y Progresivas
- Instrucciones paso a paso numeradas
- Comienzan con lo básico (permisos) y avanzan a lo avanzado (intervenciones)
- Uso de emojis para hacer la información más visual

### ✅ Contextuales
- Aparecen cuando son relevantes (ej: guía de uso solo cuando no hay apps seleccionadas)
- Explican el "por qué" además del "cómo"
- Dan contexto sobre la filosofía de OneSec

### ✅ En Español
- Todo el texto está en español
- Lenguaje claro y directo
- Traducciones naturales (no literales)

### ✅ Visuales
- Cards destacadas con colores e iconos
- Números de pasos con círculos de colores
- Bullets para listas
- Separación clara entre secciones

## Flujo de Usuario con las Nuevas Instrucciones

1. **Primera apertura:**
   - Usuario ve card de autorización con explicación clara
   - Sabe exactamente por qué necesita otorgar permisos

2. **Después de autorizar:**
   - Ve guía de 3 pasos sobre cómo usar la app
   - Sabe que primero debe seleccionar apps

3. **Configurando intervenciones:**
   - Entiende qué son las intervenciones antes de configurarlas
   - Tiene consejos prácticos sobre duraciones y uso

4. **Necesita ayuda:**
   - Va a Settings y encuentra guía completa paso a paso
   - Entiende cómo funciona técnicamente la app
   - Conoce la filosofía detrás del diseño

## Resultado

Los usuarios ahora tienen **instrucciones completas en español** en cada pantalla que explican:
- ✅ Qué hace cada función
- ✅ Cómo usar cada función
- ✅ Por qué usar cada función
- ✅ Consejos prácticos de uso
- ✅ Contexto técnico y filosófico

