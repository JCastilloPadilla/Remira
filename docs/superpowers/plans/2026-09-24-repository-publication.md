# Publicación inicial del repositorio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar la documentación del análisis, conservar `main` como base estable y centralizar el prototipo en `dev`.

**Architecture:** `main` contiene la estructura de carpetas, documentación y reglas de exclusión. `dev` nace de `main` y recibe el código de `feature/foundation-prototype`, manteniendo el trabajo experimental separado de la rama estable.

**Tech Stack:** Git, GitHub, Markdown, Python/pytest existente.

**Spec:** `docs/analisis-inicial.md`

## Global Constraints

- No versionar `data/raw/CEAS_08.csv`, modelos, bases de datos ni archivos temporales.
- Preservar las exclusiones existentes de documentos personales y cachés.
- Mantener `main` sin el código de demostración del prototipo.
- Ejecutar las pruebas del prototipo después de integrarlo en `dev`.

## Review Focus

- El CSV bruto debe continuar ignorado después de fusionar ramas.
- Los archivos `.gitkeep` deben permanecer disponibles para representar las carpetas vacías.
- `main` no debe contener `src/email_data.py`, `src/preprocessing.py` ni `src/predict.py`.
- `dev` debe contener el código del prototipo y sus pruebas.
- La documentación debe describir etiquetas y estadísticas coherentes con CEAS_08.

---

### Task 1: Publicar análisis y reglas de exclusión

**Files:**
- Modify: `.gitignore`
- Create: `docs/analisis-inicial.md`
- Create: `docs/Analisis_Inicial.pdf`

- [ ] Restaurar las exclusiones existentes y añadir reglas para datos y temporales.
- [ ] Convertir los hallazgos del PDF a Markdown navegable en GitHub.
- [ ] Conservar una copia del PDF como respaldo del análisis inicial.
- [ ] Verificar que `data/raw/CEAS_08.csv` está ignorado y que el Markdown existe.
- [ ] Crear un commit de documentación.

### Task 2: Estabilizar la rama main

**Files:**
- Add: estructura de carpetas de `feature/project-structure`

- [ ] Fusionar `feature/project-structure` en `main`.
- [ ] Resolver `.gitignore` conservando las reglas más completas.
- [ ] Verificar que las carpetas base y sus `.gitkeep` existen.
- [ ] Verificar que el código del prototipo no aparece en `main`.
- [ ] Publicar `main` en el remoto.

### Task 3: Crear dev e integrar el prototipo

**Files:**
- Add in `dev`: `src/email_data.py`, `src/preprocessing.py`, `src/predict.py`
- Add in `dev`: `tests/test_email_data.py`, `tests/test_preprocessing.py`, `tests/test_predict.py`

- [ ] Crear `dev` a partir de `main`.
- [ ] Fusionar `feature/foundation-prototype` en `dev`.
- [ ] Resolver `.gitignore` conservando las reglas de `main`.
- [ ] Ejecutar `pytest` y revisar el resultado completo.
- [ ] Publicar `dev` en el remoto.
