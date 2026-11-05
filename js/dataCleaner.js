// js/dataCleaner.js — Utilidades de normalización para Encuesta a Estudiantes 2026

const DataCleaner = {
  clean(data) {
    return Array.isArray(data) ? data : [];
  }
};

window.DataCleaner = DataCleaner;
