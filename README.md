# Dashboard de Encuesta Laboral a Estudiantes 2026
**Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni**

Dashboard interactivo y ejecutivo para el análisis de los resultados de la Encuesta Laboral a Estudiantes 2026.

---

## 📊 Contenido del Dashboard

1. **Resumen Ejecutivo**: KPIs macro (Muestra, Universo, Tasa de Ocupación, Pertinencia, Satisfacción), gráficos de distribución laboral, empleabilidad por facultad y demanda de competencias.
2. **Estudiantes que Trabajan**: Régimen de vinculación (planilla, temporal, sin contrato), modalidad (presencial, remota, híbrida), flexibilidad horaria académica, niveles de ingreso, pertinencia y top centros laborales.
3. **Estudiantes que No Trabajan**: Intención y tiempos de búsqueda activa, entrevistas laborales realizadas, barreras de inserción y experiencia laboral previa.
4. **Competencias y Servicios**: Herramientas profesionales (CV, LinkedIn), competencias prioritarias a fortalecer, autoeficacia laboral y diagnóstico de conocimiento vs. uso de los servicios de Empleabilidad Wiener (Bolsa, Ferias, Jornadas, Talleres, Asesorías, Cursos).
5. **Ficha Técnica y Representatividad**: Validación metodológica de Universo (23,639) vs. Muestra (7,233) = 30.6% de representatividad global (Margen de error ±0.96% a 95% de confianza) desglosado por Sede, Carrera Profesional y Ciclo.
6. **Visor de Microdatos**: Explorador de respuestas individuales con buscador rápido, filtros y exportación a CSV.

---

## 🚀 Cómo Iniciar el Dashboard

### En Linux / Mac:
```bash
./iniciar_dashboard.sh
```
O simplemente:
```bash
python3 server.py
```

### En Windows:
Doble clic en:
```
iniciar_dashboard.bat
```

Luego abre tu navegador en:
👉 **`http://localhost:8080`**

---

## 📁 Archivos de Datos (`data/`)

- `data/encuesta_alumnos.csv`: 7,233 respuestas depuradas con las 39 columnas clave seleccionadas (delimitador `;`, codificación UTF-8 con BOM).
- `data/universo_alumnos.csv`: Universo oficial de matrícula 2026-2 vs. muestra encuestada desglosada por Sede, Carrera y Ciclo.
