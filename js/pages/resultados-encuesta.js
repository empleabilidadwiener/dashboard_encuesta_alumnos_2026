// js/pages/resultados-encuesta.js — Resultados Generales de la Encuesta (Todas las columnas pertinentes)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Cruces interactivos con 3 botones de desglose: Por Ciclo, Por Carrera y Por Sede (+ Vista General)

const QUESTIONS = [
  // === I. SITUACIÓN LABORAL Y CONDICIÓN DE ACTIVIDAD ===
  {
    id: 'empleabilidad_final',
    titulo: '1. ¿Trabaja o realiza actividad formativa actualmente? (Empleabilidad PEA)',
    icono: 'fas fa-briefcase',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'empleabilidad_final',
    badge: 'Indicador Central',
    chartType: 'doughnut'
  },
  {
    id: 'condicion_pea',
    titulo: '2. Condición de Actividad Económica (PEA vs. No PEA)',
    icono: 'fas fa-users',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'condicion_pea',
    badge: 'Condición OIT',
    chartType: 'doughnut'
  },
  {
    id: 'actividad_remunerada',
    titulo: '3. ¿Percibe remuneración por su ocupación actual? (Actividad Remunerada)',
    icono: 'fas fa-hand-holding-usd',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'actividad_remunerada',
    badge: 'Remuneración',
    chartType: 'bar',
    filterOccupied: true
  },
  {
    id: 'actividad_principal',
    titulo: '4. Actividad Principal que Realiza Actualmente',
    icono: 'fas fa-user-tie',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'actividad_principal',
    badge: 'Ocupación',
    chartType: 'horizontal_bar'
  },
  {
    id: 'modalidad_vinculacion',
    titulo: '5. Régimen y Modalidad de Vinculación (Trabajo Dependiente)',
    icono: 'fas fa-file-signature',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'modalidad_vinculacion',
    badge: 'Dependientes',
    chartType: 'horizontal_bar'
  },
  {
    id: 'trabajo_independiente',
    titulo: '6. Modalidad de Trabajo Independiente o Freelance',
    icono: 'fas fa-laptop-code',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'trabajo_independiente',
    badge: 'Independientes',
    chartType: 'horizontal_bar'
  },
  {
    id: 'formalizacion_negocio',
    titulo: '7. Nivel de Formalización del Negocio Propio o Familiar',
    icono: 'fas fa-store',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'formalizacion_negocio',
    badge: 'Emprendimiento',
    chartType: 'bar'
  },
  {
    id: 'empresa',
    titulo: '8. Principales Centros Laborales e Instituciones Receptoras (Top 15)',
    icono: 'fas fa-hospital-alt',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'empresa',
    badge: 'Top 15 Empresas',
    chartType: 'horizontal_bar',
    topLimit: 15
  },

  // === II. CONDICIONES LABORALES, INGRESOS Y PERTINENCIA ===
  {
    id: 'sector_economico',
    titulo: '9. Sector Económico de la Empresa o Institución',
    icono: 'fas fa-industry',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'sector_economico',
    badge: 'Sector',
    chartType: 'horizontal_bar'
  },
  {
    id: 'modalidad_trabajo',
    titulo: '10. Modalidad de Ejecución del Trabajo (Presencial, Remota, Híbrida)',
    icono: 'fas fa-building',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'modalidad_trabajo',
    badge: 'Modalidad',
    chartType: 'doughnut'
  },
  {
    id: 'ajuste_horario',
    titulo: '11. Facilidad de Ajuste de Horario Laboral por Estudios',
    icono: 'fas fa-clock',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'ajuste_horario',
    badge: 'Flexibilidad',
    chartType: 'bar'
  },
  {
    id: 'ingreso_mensual',
    titulo: '12. Ingreso Mensual Bruto Aproximado (Escala Salarial)',
    icono: 'fas fa-money-bill-wave',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'ingreso_mensual',
    badge: 'Escala Salarial',
    chartType: 'bar'
  },
  {
    id: 'primera_experiencia',
    titulo: '13. ¿Su Ocupación Actual es su Primera Experiencia Laboral / Formativa?',
    icono: 'fas fa-seedling',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'primera_experiencia',
    badge: 'Trayectoria',
    chartType: 'doughnut'
  },
  {
    id: 'pertinencia_carrera',
    titulo: '14. Nivel de Pertinencia de la Ocupación con su Carrera Profesional',
    icono: 'fas fa-check-double',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'pertinencia_carrera',
    badge: 'Escala Ordinal',
    chartType: 'bar'
  },
  {
    id: 'satisfaccion_actividad',
    titulo: '15. Nivel de Satisfacción con su Actividad Laboral / Formativa Actual',
    icono: 'fas fa-smile',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'satisfaccion_actividad',
    badge: 'Escala Likert',
    chartType: 'bar'
  },
  {
    id: 'plan_12_meses_trabaja',
    titulo: '16. Planes Laborales para los Próximos 12 Meses (Estudiantes que Trabajan)',
    icono: 'fas fa-compass',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'plan_12_meses_trabaja',
    badge: 'Proyección 12M',
    chartType: 'horizontal_bar'
  },

  // === III. BÚSQUEDA DE EMPLEO Y BARRERAS (NO TRABAJAN) ===
  {
    id: 'intencion_busqueda',
    titulo: '17. Intención de Búsqueda de Trabajo o Prácticas (Estudiantes que No Trabajan)',
    icono: 'fas fa-search',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'intencion_busqueda',
    badge: 'Escala Temporal',
    chartType: 'horizontal_bar'
  },
  {
    id: 'tiempo_busqueda',
    titulo: '18. Tiempo Llevado en Búsqueda Activa de Empleo',
    icono: 'fas fa-hourglass-half',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'tiempo_busqueda',
    badge: 'Duración',
    chartType: 'bar'
  },
  {
    id: 'participado_entrevista',
    titulo: '19. ¿Ha Participado en Procesos de Selección o Entrevistas Recientes?',
    icono: 'fas fa-comments',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'participado_entrevista',
    badge: 'Selección',
    chartType: 'doughnut'
  },
  {
    id: 'factores_dificultan',
    titulo: '20. Principales Factores que Dificultan Encontrar Empleo',
    icono: 'fas fa-exclamation-circle',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'factores_dificultan',
    badge: 'Opción Múltiple',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'experiencia_previa',
    titulo: '21. ¿Cuenta con Experiencia Laboral o de Prácticas Previa?',
    icono: 'fas fa-history',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'experiencia_previa',
    badge: 'Antecedentes',
    chartType: 'doughnut'
  },

  // === IV. HERRAMIENTAS, COMPETENCIAS Y AUTOEFICACIA ===
  {
    id: 'elementos_empleabilidad',
    titulo: '22. Herramientas de Empleabilidad con las que Cuenta el Estudiante',
    icono: 'fas fa-toolbox',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'elementos_empleabilidad',
    badge: 'Opción Múltiple',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'competencias_fortalecer',
    titulo: '23. Competencias Prioritarias por Fortalecer',
    icono: 'fas fa-graduation-cap',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'competencias_fortalecer',
    badge: 'Opción Múltiple',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'tipo_oportunidad_interes',
    titulo: '24. Tipo de Oportunidad Laboral de Mayor Interés',
    icono: 'fas fa-bullseye',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'tipo_oportunidad_interes',
    badge: 'Interés Laboral',
    chartType: 'horizontal_bar'
  },
  {
    id: 'capaz_identificar_trabajo',
    titulo: '25. Autoeficacia: Identificar el Tipo de Trabajo o Área Profesional Deseada',
    icono: 'fas fa-lightbulb',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_identificar_trabajo',
    badge: 'Escala Likert',
    chartType: 'bar'
  },
  {
    id: 'capaz_postular_empleo',
    titulo: '26. Autoeficacia: Buscar y Postular a una Práctica o Empleo',
    icono: 'fas fa-paper-plane',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_postular_empleo',
    badge: 'Escala Likert',
    chartType: 'bar'
  },
  {
    id: 'capaz_explicar_habilidades',
    titulo: '27. Autoeficacia: Explicar Habilidades y Fortalezas en una Entrevista',
    icono: 'fas fa-user-check',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_explicar_habilidades',
    badge: 'Escala Likert',
    chartType: 'bar'
  },

  // === V. SERVICIOS DE EMPLEABILIDAD WIENER ===
  {
    id: 'servicio_bolsa_laboral',
    titulo: '28. Conocimiento y Uso: Bolsa Laboral Wiener',
    icono: 'fas fa-briefcase',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_bolsa_laboral',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicio_ferias_laborales',
    titulo: '29. Conocimiento y Uso: Ferias Laborales',
    icono: 'fas fa-calendar-check',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_ferias_laborales',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicio_jornadas_charlas',
    titulo: '30. Conocimiento y Uso: Jornadas y Charlas con Empresas',
    icono: 'fas fa-chalkboard-teacher',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_jornadas_charlas',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicio_talleres_programas',
    titulo: '31. Conocimiento y Uso: Talleres y Programas de Empleabilidad',
    icono: 'fas fa-laptop',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_talleres_programas',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicio_asesorias',
    titulo: '32. Conocimiento y Uso: Asesorías Personalizadas de Empleabilidad',
    icono: 'fas fa-user-friends',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_asesorias',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicio_cursos_actualizacion',
    titulo: '33. Conocimiento y Uso: Cursos de Actualización Profesional',
    icono: 'fas fa-certificate',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_cursos_actualizacion',
    badge: 'Servicio Wiener',
    chartType: 'bar'
  },
  {
    id: 'servicios_interes_12m',
    titulo: '34. Servicios de Empleabilidad de Mayor Interés en los Próximos 12 Meses',
    icono: 'fas fa-star',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicios_interes_12m',
    badge: 'Opción Múltiple',
    chartType: 'horizontal_bar',
    multiSelect: true
  },

  // === VI. PERFIL DEMOGRÁFICO Y ACADÉMICO ===
  {
    id: 'sexo',
    titulo: '35. Distribución de la Muestra por Sexo',
    icono: 'fas fa-venus-mars',
    family: 'Perfil Demográfico y Académico',
    col: 'sexo',
    badge: 'Demográfico',
    chartType: 'doughnut'
  },
  {
    id: 'edad',
    titulo: '36. Distribución de la Muestra por Rango de Edad',
    icono: 'fas fa-user-clock',
    family: 'Perfil Demográfico y Académico',
    col: 'edad',
    badge: 'Escala Etaria',
    chartType: 'bar'
  },
  {
    id: 'ciclo',
    titulo: '37. Distribución de la Muestra por Ciclo Académico',
    icono: 'fas fa-layer-group',
    family: 'Perfil Demográfico y Académico',
    col: 'ciclo',
    badge: 'Escala Académica',
    chartType: 'bar'
  },
  {
    id: 'sede',
    titulo: '38. Distribución de la Muestra por Sede Institucional',
    icono: 'fas fa-map-marker-alt',
    family: 'Perfil Demográfico y Académico',
    col: 'sede',
    badge: 'Sede',
    chartType: 'doughnut'
  },
  {
    id: 'carrera',
    titulo: '39. Distribución de la Muestra por Carrera Profesional',
    icono: 'fas fa-graduation-cap',
    family: 'Perfil Demográfico y Académico',
    col: 'carrera',
    badge: '26 Programas',
    chartType: 'horizontal_bar'
  }
];

// Orden natural de variables escalares, ordinales y cronológicas (Buenas prácticas BI)
const ORDINAL_ORDERS = {
  empleabilidad_final: ['Sí', 'No'],
  condicion_pea: ['PEA', 'NO PEA'],
  actividad_remunerada: ['Sí', 'No', 'Sin especificar / Formativa'],
  formalizacion_negocio: [
    'Formalizado: cuenta con RUC activo y actividad declarada',
    'En proceso de formalización',
    'No formalizado'
  ],
  modalidad_trabajo: ['Presencial', 'Híbrida', 'Remota'],
  ajuste_horario: ['Sí', 'Parcialmente', 'No', 'No lo he solicitado o no lo necesito'],
  ingreso_mensual: [
    'Menos de S/ 500',
    'De S/ 500 a S/ 999',
    'De S/ 1,000 a S/ 1,499',
    'De S/ 1,500 a S/ 1,999',
    'De S/ 2,000 a S/ 2,999',
    'De S/ 3,000 a S/ 3,999',
    'De S/ 4,000 a S/ 5,999',
    'S/ 6,000 o más'
  ],
  primera_experiencia: ['Sí', 'No'],
  pertinencia_carrera: [
    'Totalmente relacionada',
    'Parcialmente relacionada',
    'No está relacionada'
  ],
  satisfaccion_actividad: [
    'Muy satisfecho',
    'Satisfecho',
    'Ni satisfecho ni insatisfecho',
    'Insatisfecho',
    'Muy insatisfecho'
  ],
  intencion_busqueda: [
    'Estoy buscando activamente',
    'Quiero empezar a buscar en los próximos tres meses',
    'Quiero buscar más adelante',
    'Actualmente no tengo previsto buscar trabajo o prácticas'
  ],
  tiempo_busqueda: [
    'Menos de 1 mes',
    '1 a 3 meses',
    '4 a 6 meses',
    '7 a 12 meses',
    'Más de 12 meses'
  ],
  participado_entrevista: ['Sí', 'No'],
  experiencia_previa: ['Sí', 'No'],
  capaz_identificar_trabajo: ['Muy capaz', 'Bastante capaz', 'Medianamente capaz', 'Poco capaz', 'Nada capaz'],
  capaz_postular_empleo: ['Muy capaz', 'Bastante capaz', 'Medianamente capaz', 'Poco capaz', 'Nada capaz'],
  capaz_explicar_habilidades: ['Muy capaz', 'Bastante capaz', 'Medianamente capaz', 'Poco capaz', 'Nada capaz'],
  servicio_bolsa_laboral: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_ferias_laborales: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_jornadas_charlas: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_talleres_programas: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_asesorias: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_cursos_actualizacion: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  edad: ['16 a 20 años', '21 a 25 años', '26 a 30 años', '31 a 35 años', '36 años a más'],
  ciclo: ['Ciclo 1', 'Ciclo 2', 'Ciclo 3', 'Ciclo 4', 'Ciclo 5', 'Ciclo 6', 'Ciclo 7', 'Ciclo 8', 'Ciclo 9', 'Ciclo 10', 'Ciclo 11', 'Ciclo 12', 'Ciclo 13', 'Ciclo 14'],
  sede: ['Lima Centro', 'Lima Norte', 'Virtual']
};

const PALETTE_WIENER = [
  '#07C8CC',
  '#156082',
  '#0a1b44',
  '#0E9F9F',
  '#38BDF8',
  '#6366F1',
  '#F59E0B',
  '#10B981',
  '#8B5CF6',
  '#EC4899',
  '#94A3B8',
  '#CBD5E1',
  '#64748B'
];

let activeRGCharts = {};
let globalActiveBreakdown = 'general';

function destroyChart(canvasId) {
  if (activeRGCharts[canvasId]) {
    try { activeRGCharts[canvasId].destroy(); } catch (e) {}
    delete activeRGCharts[canvasId];
  }
  const canvas = document.getElementById(canvasId);
  if (canvas && typeof Chart !== 'undefined') {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }
}

function cleanValue(q, rawVal) {
  let v = String(rawVal || '').trim();
  if (!v || v === '#N/A') return null;
  const low = v.toLowerCase();

  if (q.id === 'actividad_remunerada') {
    if (low === 'no especifica') return 'Sin especificar / Formativa';
    return v;
  }

  if (low === 'no especifica' || low === 'sin especificar') return null;

  if (q.id === 'ingreso_mensual') {
    v = v.replace('Aproximadamente, ', '').replace(' mensual', '').trim();
    const lowIng = v.toLowerCase();
    if (lowIng.includes('prefiero no responder') || lowIng.includes('no recibo ingresos') || lowIng.includes('no especifica')) {
      return null;
    }
    return v;
  }

  if (q.id === 'sexo') {
    if (v === 'F') return 'Femenino';
    if (v === 'M') return 'Masculino';
  }

  if (q.id === 'edad') {
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 15) return null;
    if (n <= 20) return '16 a 20 años';
    if (n <= 25) return '21 a 25 años';
    if (n <= 30) return '26 a 30 años';
    if (n <= 35) return '31 a 35 años';
    return '36 años a más';
  }

  if (q.id === 'ciclo') {
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 1) return null;
    return `Ciclo ${n}`;
  }

  if (q.id === 'carrera') {
    return window.toTitleCase ? window.toTitleCase(v) : v;
  }

  if (q.id === 'empresa') {
    if (v.length <= 2 || low === 'ninguna' || low === 'ninguno' || low === 'no aplica' || low === 'independiente' || low === 'no' || low === 'sin nombre') {
      return null;
    }
    return v.toUpperCase();
  }

  return v;
}

function getQuestionDataset(q, data) {
  if (q.filterOccupied) {
    return data.filter(d => (d.empleabilidad_final || '').trim() === 'Sí');
  }
  return data;
}

function getOrderedDistribution(q, data) {
  const subset = getQuestionDataset(q, data);

  if (q.multiSelect) {
    const dist = Calculations.countMultiSelect(subset, q.col);
    const valid = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
    const total = dist.totalEncuestados || subset.length || 1;
    return {
      labels: valid.map(e => e.label),
      counts: valid.map(e => e.count),
      percents: valid.map(e => Math.round((e.count / total) * 1000) / 10),
      total
    };
  }

  const order = ORDINAL_ORDERS[q.id];
  const countMap = {};
  if (order) {
    order.forEach(k => { countMap[k] = 0; });
  }

  let totalValidos = 0;
  subset.forEach(row => {
    const val = cleanValue(q, row[q.col]);
    if (!val) return;
    countMap[val] = (countMap[val] || 0) + 1;
    totalValidos++;
  });

  let entries;
  if (order) {
    const inOrder = order.map(k => ({ label: k, count: countMap[k] || 0 }));
    const extras = Object.entries(countMap)
      .filter(([k]) => !order.includes(k))
      .map(([label, count]) => ({ label, count }));
    entries = [...inOrder, ...extras];
  } else {
    entries = Object.entries(countMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => {
        const aOther = a.label.toLowerCase().startsWith('otr');
        const bOther = b.label.toLowerCase().startsWith('otr');
        if (aOther !== bOther) return aOther ? 1 : -1;
        return b.count - a.count;
      });
    if (q.topLimit) {
      entries = entries.slice(0, q.topLimit);
    }
  }

  const denom = totalValidos || 1;
  return {
    labels: entries.map(e => e.label),
    counts: entries.map(e => e.count),
    percents: entries.map(e => Math.round((e.count / denom) * 1000) / 10),
    total: totalValidos
  };
}

function formatPctText(val, count) {
  if (!count || val <= 0) return '0%';
  const rounded = Math.round(val);
  if (rounded === 0) return `${val.toFixed(1)}%`;
  return `${rounded}%`;
}

function updateCardChartHeading(q, mode) {
  const titleEl = document.getElementById(`rg-enc-chart-title-${q.id}`);
  if (titleEl) {
    const tId = titleEl.getAttribute('data-text-id');
    const customTitle = tId && window.Editor?.config?.texts?.[tId];
    if (!customTitle) {
      if (mode === 'general') {
        titleEl.innerHTML = `<i class="${q.icono}" style="color: #07C8CC;"></i> ${q.titulo}`;
      } else if (mode === 'ciclo') {
        titleEl.innerHTML = `<i class="fas fa-layer-group" style="color: #07C8CC;"></i> ${q.titulo} — Por Ciclo`;
      } else if (mode === 'carrera') {
        titleEl.innerHTML = `<i class="fas fa-graduation-cap" style="color: #07C8CC;"></i> ${q.titulo} — Por Carrera`;
      } else if (mode === 'sede') {
        titleEl.innerHTML = `<i class="fas fa-map-marker-alt" style="color: #07C8CC;"></i> ${q.titulo} — Por Sede`;
      }
    }
  }

  const subEl = document.getElementById(`rg-enc-chart-sub-${q.id}`);
  if (subEl) {
    const sId = subEl.getAttribute('data-text-id');
    const customSub = sId && window.Editor?.config?.texts?.[sId];
    if (!customSub) {
      if (mode === 'general') {
        subEl.textContent = q.subtitulo || 'Distribución general de respuestas válidas declaradas por los estudiantes';
      } else if (mode === 'ciclo') {
        subEl.textContent = 'Cruce porcentual relativo dentro de cada ciclo académico (Ciclo 1 al Ciclo 14)';
      } else if (mode === 'carrera') {
        subEl.textContent = 'Cruce porcentual relativo dentro de cada carrera profesional';
      } else if (mode === 'sede') {
        subEl.textContent = 'Cruce porcentual relativo dentro de cada sede institucional';
      }
    }
  }
}

// Renderiza la pestaña "General" de una pregunta
function renderGeneralChart(canvasId, q, data) {
  destroyChart(canvasId);
  updateCardChartHeading(q, 'general');

  const dist = getOrderedDistribution(q, data);
  const noteEl = document.getElementById(`rg-enc-note-${q.id}`);
  if (noteEl) {
    noteEl.innerHTML = `<i class="fas fa-check-circle" style="color: #07C8CC; margin-right: 4px;"></i> Base analizada: <strong>${dist.total.toLocaleString()}</strong> respuestas válidas`;
  }

  const stageEl = document.getElementById(`rg-enc-stage-${q.id}`);
  if (stageEl) {
    if (q.chartType === 'doughnut') {
      stageEl.innerHTML = `
        <div class="exec-donut-fullwidth-container" style="padding: 8px 12px; justify-content: center; gap: 36px;">
          <div class="exec-donut-canvas-wrap" style="position: relative; width: 205px; height: 205px; flex-shrink: 0;">
            <canvas id="${canvasId}"></canvas>
          </div>
          <div class="exec-donut-grid-legend" id="rg-enc-donut-legend-${q.id}" style="max-width: 560px;"></div>
        </div>
      `;
    } else {
      stageEl.innerHTML = `
        <div class="exec-chart-canvas-wrap" style="height: 290px; position: relative;">
          <canvas id="${canvasId}"></canvas>
        </div>
      `;
    }
  }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const wrap = ctx.parentElement;

  if (q.chartType === 'doughnut') {
    const colors = dist.labels.map((_, i) => PALETTE_WIENER[i % PALETTE_WIENER.length]);
    const legendEl = document.getElementById(`rg-enc-donut-legend-${q.id}`);
    if (legendEl) {
      legendEl.style.gridTemplateColumns = dist.labels.length <= 3 ? '1fr' : 'repeat(2, 1fr)';
      legendEl.innerHTML = dist.labels.map((lbl, i) => `
        <div class="exec-legend-card-item" title="${lbl}">
          <div class="exec-legend-card-left">
            <span class="exec-legend-card-dot" style="background-color: ${colors[i]};"></span>
            <span class="exec-legend-card-name">${lbl}</span>
          </div>
          <div class="exec-legend-card-right">
            <span class="exec-legend-card-pct">${formatPctText(dist.percents[i], dist.counts[i])}</span>
            <span class="exec-legend-card-count">(${dist.counts[i].toLocaleString()})</span>
          </div>
        </div>
      `).join('');
    }

    activeRGCharts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dist.labels,
        datasets: [{
          data: dist.counts,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${formatPctText(dist.percents[item.dataIndex], dist.counts[item.dataIndex])} (${dist.counts[item.dataIndex].toLocaleString()} estudiantes)`
            }
          }
        }
      },
      plugins: [{
        id: 'rgDonutCenter',
        beforeDraw(chart) {
          const { width, height, ctx } = chart;
          ctx.save();
          ctx.font = '800 21px Inter, sans-serif';
          ctx.fillStyle = '#0a1b44';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(dist.total.toLocaleString(), width / 2, height / 2 - 8);
          ctx.font = '600 11px Inter, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText('Respuestas', width / 2, height / 2 + 11);
          ctx.restore();
        }
      }]
    });
    return;
  }

  if (q.chartType === 'horizontal_bar') {
    const maxChars = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 64;
    const wrappedLabels = dist.labels.map(l => Calculations.wrapLabel(l, maxChars));
    const hasMultiline = wrappedLabels.some(l => Array.isArray(l) && l.length > 1);
    const rowHeight = hasMultiline ? 52 : 42;
    if (wrap) {
      wrap.style.height = `${Math.max(300, dist.labels.length * rowHeight + 44)}px`;
    }
    const maxVal = Math.max(...dist.percents, 10);
    const xMax = Math.min(100, Math.ceil((maxVal + 8) / 5) * 5);

    activeRGCharts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: wrappedLabels,
        datasets: [{
          data: dist.percents,
          rawCounts: dist.counts,
          backgroundColor: '#07C8CC',
          borderRadius: 3,
          barPercentage: 0.72,
          categoryPercentage: 0.85
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 85, left: 8, top: 8, bottom: 8 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => dist.labels[items[0].dataIndex] || '',
              label: (item) => ` ${formatPctText(dist.percents[item.dataIndex], dist.counts[item.dataIndex])} (${dist.counts[item.dataIndex].toLocaleString()} estudiantes)`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: xMax,
            ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          y: {
            ticks: {
              autoSkip: false,
              font: { size: 11, family: 'Inter', weight: '500' },
              color: '#1e293b'
            },
            grid: { display: false }
          }
        }
      },
      plugins: [{
        id: 'rgHorizLabels',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = dist.percents[i];
            const c = dist.counts[i] || 0;
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${formatPctText(val, c)} (${c.toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        }
      }]
    });
    return;
  }

  // Vertical Bar Chart (Escalas ordinales: ingresos, satisfacción, pertinencia, tiempo, autoeficacia, servicios, edad)
  if (wrap) wrap.style.height = '290px';
  const formatTwoLines = (lbl) => {
    if (lbl.startsWith('De ') && lbl.includes(' a ')) {
      const parts = lbl.split(' a ');
      return [parts[0], `a ${parts[1]}`];
    }
    if (lbl.length > 22) return Calculations.wrapLabel(lbl, 18);
    return lbl;
  };
  const xLabels = dist.labels.map(formatTwoLines);
  const maxVal = Math.max(...dist.percents, 20);
  const yMax = Math.min(100, Math.ceil((maxVal + 10) / 10) * 10);

  activeRGCharts[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xLabels,
      datasets: [{
        data: dist.percents,
        rawCounts: dist.counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.62,
        categoryPercentage: 0.82
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24, right: 10, left: 4, bottom: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => dist.labels[items[0].dataIndex] || '',
            label: (item) => ` ${formatPctText(dist.percents[item.dataIndex], dist.counts[item.dataIndex])} (${dist.counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: yMax,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            font: { size: 10, family: 'Inter', weight: '600' },
            color: '#334155'
          },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'rgVertLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        if (meta.hidden) return;
        meta.data.forEach((bar, i) => {
          const val = dist.percents[i];
          const c = dist.counts[i] || 0;
          if (val == null) return;
          ctx.save();
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillStyle = '#0a1b44';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`${formatPctText(val, c)}`, bar.x, bar.y - 4);
          ctx.restore();
        });
      }
    }]
  });
}

// Renderiza el cruce por Ciclo ('ciclo'), Carrera ('carrera') o Sede ('sede')
function renderCrossChart(canvasId, q, data, dimension) {
  if (q.id === dimension) {
    renderGeneralChart(canvasId, q, data);
    return;
  }
  destroyChart(canvasId);
  updateCardChartHeading(q, dimension);

  const stageEl = document.getElementById(`rg-enc-stage-${q.id}`);
  if (stageEl) {
    stageEl.innerHTML = `
      <div class="exec-chart-canvas-wrap" style="height: 350px; position: relative;">
        <canvas id="${canvasId}"></canvas>
      </div>
    `;
  }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const subset = getQuestionDataset(q, data);
  const baseDist = getOrderedDistribution(q, data);
  // Categorías de respuesta completas (o top 10 únicamente en preguntas abiertas de empresas)
  const categories = q.topLimit ? baseDist.labels.slice(0, 10) : baseDist.labels;

  // Obtener grupos de la dimensión (Ciclo, Carrera o Sede)
  let groups = [];
  if (dimension === 'ciclo') {
    const nums = [...new Set(subset.map(r => parseInt(r.ciclo, 10)).filter(n => !isNaN(n)))].sort((a, b) => a - b);
    groups = nums.map(n => ({ key: String(n), label: `Ciclo ${n}` }));
  } else if (dimension === 'sede') {
    const sedes = ['Lima Centro', 'Lima Norte', 'Virtual'].filter(s => subset.some(r => (r.sede || '').trim() === s));
    groups = sedes.map(s => ({ key: s, label: s }));
  } else if (dimension === 'carrera') {
    const MIN_MUESTRA = 15;
    const carreraCounts = {};
    subset.forEach(r => {
      const c = (r.carrera || '').trim();
      if (c) carreraCounts[c] = (carreraCounts[c] || 0) + 1;
    });
    const validCarreras = Object.keys(carreraCounts).filter(c => carreraCounts[c] >= 1);
    groups = validCarreras.map(c => {
      const baseName = window.toTitleCase ? window.toTitleCase(c) : c;
      return {
        key: c,
        label: carreraCounts[c] < MIN_MUESTRA ? `${baseName} *` : baseName
      };
    });
  }

  if (groups.length === 0 || categories.length === 0) return;

  // Calcular matriz de porcentajes y conteos por grupo
  const matrixPct = {};
  const matrixCount = {};
  const groupTotals = {};

  categories.forEach(cat => {
    matrixPct[cat] = {};
    matrixCount[cat] = {};
  });

  groups.forEach(g => {
    const rowsInGroup = subset.filter(r => String(r[dimension] || '').trim() === g.key);
    if (q.multiSelect) {
      const totalG = rowsInGroup.length || 1;
      groupTotals[g.key] = rowsInGroup.length;
      categories.forEach(cat => {
        let c = 0;
        rowsInGroup.forEach(r => {
          const parts = String(r[q.col] || '').split('|').map(s => s.trim());
          if (parts.includes(cat)) c++;
        });
        matrixCount[cat][g.key] = c;
        matrixPct[cat][g.key] = rowsInGroup.length > 0 ? Math.round((c / totalG) * 1000) / 10 : 0;
      });
    } else {
      let validRows = 0;
      categories.forEach(cat => { matrixCount[cat][g.key] = 0; });
      rowsInGroup.forEach(r => {
        const v = cleanValue(q, r[q.col]);
        if (!v) return;
        validRows++;
        if (matrixCount[v] !== undefined) {
          matrixCount[v][g.key] = (matrixCount[v][g.key] || 0) + 1;
        }
      });
      groupTotals[g.key] = validRows;
      const denom = validRows || 1;
      categories.forEach(cat => {
        matrixPct[cat][g.key] = validRows > 0 ? Math.round((matrixCount[cat][g.key] / denom) * 1000) / 10 : 0;
      });
    }
  });

  // Si es por carrera, ordenar de mayor a menor según la primera categoría principal
  if (dimension === 'carrera' && categories.length > 0) {
    const primaryCat = categories[0];
    groups.sort((a, b) => (matrixPct[primaryCat][b.key] || 0) - (matrixPct[primaryCat][a.key] || 0));
  }

  const isHorizontal = dimension === 'carrera';
  const isStacked = !q.multiSelect;
  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = isHorizontal ? `${Math.max(420, groups.length * 36)}px` : '360px';
  }

  const datasets = categories.map((cat, idx) => ({
    label: cat,
    data: groups.map(g => Math.round(matrixPct[cat][g.key] || 0)),
    rawCounts: groups.map(g => matrixCount[cat][g.key] || 0),
    backgroundColor: PALETTE_WIENER[idx % PALETTE_WIENER.length],
    borderRadius: isStacked ? 1 : 2,
    barPercentage: isHorizontal ? 0.78 : 0.68,
    categoryPercentage: 0.84
  }));

  const noteEl = document.getElementById(`rg-enc-note-${q.id}`);
  if (noteEl) {
    const dimLabel = dimension === 'ciclo' ? 'Ciclo Académico (1 al 14)' : dimension === 'carrera' ? 'Carrera Profesional (programas con muestra ≥ 15)' : 'Sede Institucional';
    noteEl.innerHTML = `<i class="fas fa-layer-group" style="color: #07C8CC; margin-right: 4px;"></i> Desglose por <strong>${dimLabel}</strong>`;
  }

  activeRGCharts[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: groups.map(g => g.label),
      datasets
    },
    options: {
      indexAxis: isHorizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: isHorizontal ? 8 : 20, right: isHorizontal ? 30 : 12, left: 6, bottom: 6 } },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: { family: "'Inter', sans-serif", size: 11.5, weight: '600' },
            color: '#1e293b',
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              const g = groups[item.dataIndex];
              const c = item.dataset.rawCounts?.[item.dataIndex] || 0;
              const tot = groupTotals[g.key] || 0;
              return ` ${item.dataset.label}: ${item.raw}% (${c.toLocaleString()} de ${tot.toLocaleString()})`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: isStacked,
          min: 0,
          max: isStacked ? 100 : undefined,
          ticks: {
            autoSkip: false,
            maxRotation: isHorizontal ? 0 : 35,
            minRotation: 0,
            callback: v => isHorizontal ? `${v}%` : groups[v]?.label || v,
            font: { size: 10, family: 'Inter', weight: '500' },
            color: '#475569'
          },
          grid: { color: isHorizontal ? '#f1f5f9' : 'transparent' }
        },
        y: {
          stacked: isStacked,
          min: 0,
          max: !isHorizontal && isStacked ? 100 : undefined,
          ticks: {
            autoSkip: false,
            callback: v => !isHorizontal ? `${v}%` : groups[v]?.label || v,
            font: { size: 10.5, family: 'Inter', weight: '500' },
            color: '#1e293b'
          },
          grid: { color: !isHorizontal ? '#f1f5f9' : 'transparent' }
        }
      }
    },
    plugins: [{
      id: 'rgCrossLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (!val || val < 5) return;
            const segSize = isHorizontal ? Math.abs(bar.x - bar.base) : Math.abs(bar.y - bar.base);
            if (isStacked && segSize < 18) return;

            ctx.save();
            ctx.font = 'bold 10px Inter, sans-serif';
            const bg = String(ds.backgroundColor || '').toUpperCase();
            const isDark = bg === '#156082' || bg === '#0A1B44' || bg === '#6366F1';
            ctx.fillStyle = isStacked ? (isDark ? '#ffffff' : '#0a1b44') : '#0a1b44';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (isStacked) {
              const mx = isHorizontal ? (bar.x + bar.base) / 2 : bar.x;
              const my = isHorizontal ? bar.y : (bar.y + bar.base) / 2;
              ctx.fillText(`${val}%`, mx, my);
            } else {
              if (isHorizontal) {
                ctx.textAlign = 'left';
                ctx.fillText(`${val}%`, bar.x + 4, bar.y);
              } else {
                ctx.textBaseline = 'bottom';
                ctx.fillText(`${val}%`, bar.x, bar.y - 3);
              }
            }
            ctx.restore();
          });
        });
      }
    }]
  });
}

export async function loadResultadosEncuestaPage(container, data = [], filters = {}) {
  if (!container) return;

  Object.keys(activeRGCharts).forEach(k => destroyChart(k));
  activeRGCharts = {};

  const currentFilters = window.App?.filters || filters || { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
  const stats = Calculations.getStats(data);
  const totalCarreras = new Set(data.map(d => d.carrera).filter(Boolean)).size;

  const facultades = DataLoader.getFacultades ? DataLoader.getFacultades() : [];
  const todasCarreras = DataLoader.getCarreras ? DataLoader.getCarreras() : [];
  const carrerasFiltradas = currentFilters.facultad && currentFilters.facultad !== 'Todas' && DataLoader.getFacultadForCarrera
    ? todasCarreras.filter(c => DataLoader.getFacultadForCarrera(c) === currentFilters.facultad)
    : todasCarreras;
  const ciclos = DataLoader.getCiclos ? DataLoader.getCiclos() : [];
  const sedes = DataLoader.getSedes ? DataLoader.getSedes() : [];

  // Agrupar preguntas por familia temática
  const families = [...new Set(QUESTIONS.map(q => q.family))];

  container.innerHTML = `
    <div class="resumen-ejecutivo-wrapper">
      
      <!-- Barra superior institucional -->
      <div class="exec-top-bar">
        <span class="exec-institution">Universidad Norbert Wiener</span>
        <span class="exec-date">Resultados Generales &nbsp;&nbsp;&nbsp;&nbsp; Edición 2026</span>
      </div>

      <h1 class="exec-header-title">Resultados Generales de la Encuesta</h1>
      <div class="exec-header-subtitle">Explorador integral de las ${QUESTIONS.length} variables pertinentes del instrumento con desglose interactivo por Ciclo, Carrera y Sede</div>

      <!-- Barra de Filtros Institucional (Mismo diseño ejecutivo del dashboard) -->
      <div class="exec-filters-bar">
        <div class="exec-filters-left">
          <div class="exec-filter-field">
            <label for="rg-sel-facultad">Facultad</label>
            <select id="rg-sel-facultad">
              <option value="Todas" ${currentFilters.facultad === 'Todas' ? 'selected' : ''}>Todas</option>
              ${facultades.map(f => `<option value="${f}" ${currentFilters.facultad === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="rg-sel-carrera">Carrera</label>
            <select id="rg-sel-carrera">
              <option value="Todas" ${currentFilters.carrera === 'Todas' ? 'selected' : ''}>Todas</option>
              ${carrerasFiltradas.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="rg-sel-ciclo">Ciclo</label>
            <select id="rg-sel-ciclo">
              <option value="Todos" ${currentFilters.ciclo === 'Todos' || !currentFilters.ciclo ? 'selected' : ''}>Todos</option>
              ${ciclos.map(c => `<option value="${c}" ${String(currentFilters.ciclo) === String(c) ? 'selected' : ''}>Ciclo ${c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="rg-sel-sede">Sede</label>
            <select id="rg-sel-sede">
              <option value="Todas" ${currentFilters.sede === 'Todas' || !currentFilters.sede ? 'selected' : ''}>Todas</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="exec-filters-actions">
          <button class="exec-btn-clean" id="rg-btn-limpiar">Limpiar filtros</button>
          <button class="exec-btn-refresh" id="rg-btn-actualizar">Actualizar datos</button>
          <button type="button" class="btn-toggle-editor" id="rg-btn-editor" onclick="window.Editor && window.Editor.promptAuth()" title="Activar Modo Edición">
            <i class="fas fa-edit"></i> <span>Editar Textos</span>
          </button>
        </div>
      </div>

      <!-- 5 KPIs Resumen -->
      <div class="exec-kpis-container">
        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Muestra Evaluada</div>
          <div class="exec-kpi-number">${data.length.toLocaleString()}</div>
          <div class="exec-kpi-desc">Estudiantes encuestados</div>
        </div>
        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Empleabilidad PEA</div>
          <div class="exec-kpi-number">${(stats.tasaEmpleabilidad || 0).toFixed(1)}%</div>
          <div class="exec-kpi-desc">${(stats.totalTrabajadores || 0).toLocaleString()} ocupados de ${(stats.totalPEA || 0).toLocaleString()} en PEA</div>
        </div>
        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Actividad Remunerada</div>
          <div class="exec-kpi-number">${(stats.tasaActividadRemunerada || 0).toFixed(1)}%</div>
          <div class="exec-kpi-desc">${(stats.totalRemunerados || 0).toLocaleString()} de ${(stats.totalTrabajadores || 0).toLocaleString()} ocupados perciben remuneración</div>
        </div>
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Variables Analizadas</div>
          <div class="exec-kpi-number">${QUESTIONS.length}</div>
          <div class="exec-kpi-desc">Columnas pertinentes del cuestionario</div>
        </div>
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Cobertura Académica</div>
          <div class="exec-kpi-number">${totalCarreras}</div>
          <div class="exec-kpi-desc">Carreras profesionales activas</div>
        </div>
      </div>

      <!-- Barra Ejecutiva de Desglose Global (3 Botones: Por Ciclo, Por Carrera, Por Sede + General) y Acciones de Acordeón -->
      <div class="exec-subcontrol-bar" style="margin: 0 0 20px 0; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 12px 18px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; background: rgba(7, 200, 204, 0.14); color: #002D72; font-size: 13px;">
              <i class="fas fa-sliders-h"></i>
            </span>
            <strong style="color: #0a1b44; font-size: 12.5px;">Desglose de Gráficos:</strong>
          </div>

          <div class="exec-subcontrol-pills" id="rg-global-mode-group">
            <button type="button" class="exec-pill-btn ${globalActiveBreakdown === 'general' ? 'active' : ''}" data-mode="general">
              <i class="fas fa-chart-pie" style="margin-right: 5px;"></i> General
            </button>
            <button type="button" class="exec-pill-btn ${globalActiveBreakdown === 'ciclo' ? 'active' : ''}" data-mode="ciclo">
              <i class="fas fa-layer-group" style="margin-right: 5px;"></i> Por Ciclo
            </button>
            <button type="button" class="exec-pill-btn ${globalActiveBreakdown === 'carrera' ? 'active' : ''}" data-mode="carrera">
              <i class="fas fa-graduation-cap" style="margin-right: 5px;"></i> Por Carrera
            </button>
            <button type="button" class="exec-pill-btn ${globalActiveBreakdown === 'sede' ? 'active' : ''}" data-mode="sede">
              <i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i> Por Sede
            </button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div style="position: relative; min-width: 220px;">
            <i class="fas fa-search" style="position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 12px;"></i>
            <input type="text" id="rg-search-input" placeholder="Buscar variable o pregunta..." style="width: 100%; height: 34px; padding: 0 12px 0 32px; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 12.5px; color: #1e293b; outline: none; background: #f8fafc;" />
          </div>
          <div class="exec-subcontrol-pills">
            <button type="button" class="exec-pill-btn" id="rg-btn-expand-all" title="Abrir todas las preguntas">
              <i class="fas fa-angle-double-down" style="margin-right: 4px;"></i> Expandir todo
            </button>
            <button type="button" class="exec-pill-btn" id="rg-btn-collapse-all" title="Cerrar todas las preguntas">
              <i class="fas fa-angle-double-up" style="margin-right: 4px;"></i> Contraer todo
            </button>
          </div>
        </div>

      </div>

      <!-- Listado de Variables agrupadas por bloque temático (TODAS cerradas por defecto hasta hacer clic) -->
      <div id="rg-encuesta-list" style="display: flex; flex-direction: column; gap: 18px;">
        ${families.map((fam) => {
          const famQuestions = QUESTIONS.filter(q => q.family === fam);
          return `
            <div class="rg-family-block" style="margin-top: 4px;">
              <div style="font-size: 12.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #156082; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; padding-left: 2px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #07C8CC; display: inline-block;"></span>
                <span class="rg-family-title">${fam}</span>
                <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: none; letter-spacing: 0;">(${famQuestions.length} variables — clic en cada fila para desplegar)</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${famQuestions.map((q) => {
                  return `
                    <div class="exec-panel rg-enc-card" id="rg-card-${q.id}" data-title="${q.titulo.toLowerCase()}" data-visual-id="rg-enc-${q.id}" style="padding: 0; margin-bottom: 0; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 10px; transition: box-shadow 0.2s ease, border-color 0.2s ease;">
                      
                      <div class="rg-enc-header" onclick="window.RGEncToggle('${q.id}', event)" style="cursor: pointer; padding: 16px 22px; display: flex; align-items: center; gap: 14px; background: #ffffff; border-bottom: none; transition: background 0.15s ease;">
                        <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(7, 200, 204, 0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                          <i class="${q.icono}" style="color: #07C8CC; font-size: 15px;"></i>
                        </div>
                        <span class="rg-question-title" style="flex: 1; font-weight: 700; color: #0a1b44; font-size: 14.5px; line-height: 1.35;">${q.titulo}</span>
                        <span style="font-size: 11px; padding: 4px 11px; border-radius: 9999px; background: rgba(7, 200, 204, 0.12); color: #05A8AB; font-weight: 700; white-space: nowrap; flex-shrink: 0;">
                          ${q.badge || 'Distribución'}
                        </span>
                        <i class="fas fa-chevron-down rg-enc-chevron" style="transition: transform 0.2s ease; color: #64748b; font-size: 13px; transform: none; flex-shrink: 0;"></i>
                      </div>

                      <div class="rg-enc-body" id="rg-enc-body-${q.id}" style="display: none; padding: 18px 22px; background: #f8fafc;">
                        
                        <!-- Barra de botones por pregunta: General + 3 botones (Por Ciclo, Por Carrera, Por Sede) -->
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
                          <div class="exec-subcontrol-pills rg-enc-tabs" data-qid="${q.id}" style="background: #ffffff; padding: 4px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <button type="button" class="exec-pill-btn rg-enc-tab ${globalActiveBreakdown === 'general' ? 'active' : ''}" data-mode="general" onclick="window.RGEncSwitchTab('${q.id}', 'general', this)">
                              <i class="fas fa-chart-pie" style="margin-right: 4px;"></i> General
                            </button>
                            <button type="button" class="exec-pill-btn rg-enc-tab ${globalActiveBreakdown === 'ciclo' ? 'active' : ''}" data-mode="ciclo" onclick="window.RGEncSwitchTab('${q.id}', 'ciclo', this)">
                              <i class="fas fa-layer-group" style="margin-right: 4px;"></i> Por Ciclo
                            </button>
                            <button type="button" class="exec-pill-btn rg-enc-tab ${globalActiveBreakdown === 'carrera' ? 'active' : ''}" data-mode="carrera" onclick="window.RGEncSwitchTab('${q.id}', 'carrera', this)">
                              <i class="fas fa-graduation-cap" style="margin-right: 4px;"></i> Por Carrera
                            </button>
                            <button type="button" class="exec-pill-btn rg-enc-tab ${globalActiveBreakdown === 'sede' ? 'active' : ''}" data-mode="sede" onclick="window.RGEncSwitchTab('${q.id}', 'sede', this)">
                              <i class="fas fa-map-marker-alt" style="margin-right: 4px;"></i> Por Sede
                            </button>
                          </div>
                          <span id="rg-enc-note-${q.id}" style="font-size: 12px; color: #475569; background: #ffffff; padding: 5px 12px; border-radius: 6px; border: 1px solid #e2e8f0;"></span>
                        </div>

                        <div style="background: #ffffff; border-radius: 10px; padding: 18px 20px; border: 1px solid #e2e8f0;">
                          <h4 id="rg-enc-chart-title-${q.id}" class="exec-panel-title rg-chart-title" style="font-size: 13.5px; font-weight: 700; color: #0a1b44; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="${q.icono}" style="color: #07C8CC;"></i> ${q.titulo}
                          </h4>
                          <p id="rg-enc-chart-sub-${q.id}" class="exec-section-desc rg-chart-subtitle" style="margin: 0 0 14px 0;">
                            ${q.subtitulo || 'Distribución general de respuestas válidas declaradas por los estudiantes'}
                          </p>
                          <div id="rg-enc-stage-${q.id}">
                            <div class="exec-chart-canvas-wrap" style="height: 290px; position: relative;">
                              <canvas id="rg-enc-canvas-${q.id}"></canvas>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Notas metodológicas -->
      <div class="exec-footer-notes" style="margin-top: 24px;">
        <p>Nota metodológica: Todas las escalas ordinales (ingresos mensuales, pertinencia, satisfacción, autoeficacia, tiempo de búsqueda, servicios y rangos de edad) se presentan en su orden secuencial de escala.</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Muestra evaluada: ${data.length.toLocaleString()} registros.</p>
      </div>

    </div>
  `;

  const renderCardChart = (qId, mode) => {
    const q = QUESTIONS.find(x => x.id === qId);
    if (!q) return;
    const canvasId = `rg-enc-canvas-${qId}`;
    if (mode === 'general') {
      renderGeneralChart(canvasId, q, data);
    } else {
      renderCrossChart(canvasId, q, data, mode);
    }
    if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
      setTimeout(() => window.Charts.attachFullscreenButtons(), 40);
    }
  };

  window.RGEncToggle = (qId, evt) => {
    // Si el modo editor está activo y el usuario hizo clic directamente en el texto editable, abrir sin colapsar si ya está abierto
    const body = document.getElementById(`rg-enc-body-${qId}`);
    const card = document.getElementById(`rg-card-${qId}`);
    if (!body || !card) return;
    const isOpen = body.style.display !== 'none';
    if (document.body.classList.contains('editor-mode-active') && evt && evt.target && evt.target.hasAttribute('data-text-id') && isOpen) {
      return;
    }
    const header = card.querySelector('.rg-enc-header');
    const chevron = card.querySelector('.rg-enc-chevron');
    body.style.display = isOpen ? 'none' : 'block';
    if (header) header.style.borderBottom = isOpen ? 'none' : '1px solid #e2e8f0';
    if (chevron) chevron.style.transform = isOpen ? 'none' : 'rotate(180deg)';

    if (!isOpen) {
      const activeTab = body.querySelector('.rg-enc-tab.active');
      const mode = activeTab ? activeTab.dataset.mode : globalActiveBreakdown;
      renderCardChart(qId, mode);
    }
  };

  window.RGEncSwitchTab = (qId, mode, btn) => {
    const body = document.getElementById(`rg-enc-body-${qId}`);
    if (!body) return;
    body.querySelectorAll('.rg-enc-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCardChart(qId, mode);
  };

  // Eventos de los 3 botones globales (General / Por Ciclo / Por Carrera / Por Sede)
  document.querySelectorAll('#rg-global-mode-group .exec-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode) return;
      globalActiveBreakdown = mode;
      document.querySelectorAll('#rg-global-mode-group .exec-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Actualizar todas las tarjetas al modo seleccionado (y re-renderizar las que estén abiertas)
      QUESTIONS.forEach(q => {
        const body = document.getElementById(`rg-enc-body-${q.id}`);
        if (!body) return;
        body.querySelectorAll('.rg-enc-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.mode === mode);
        });
        if (body.style.display !== 'none') {
          renderCardChart(q.id, mode);
        }
      });
    });
  });

  // Expandir todo / Contraer todo
  const btnExpandAll = document.getElementById('rg-btn-expand-all');
  const btnCollapseAll = document.getElementById('rg-btn-collapse-all');

  btnExpandAll?.addEventListener('click', () => {
    QUESTIONS.forEach(q => {
      const card = document.getElementById(`rg-card-${q.id}`);
      if (card && card.style.display === 'none') return;
      const body = document.getElementById(`rg-enc-body-${q.id}`);
      if (body && body.style.display === 'none') {
        window.RGEncToggle(q.id);
      }
    });
  });

  btnCollapseAll?.addEventListener('click', () => {
    QUESTIONS.forEach(q => {
      const body = document.getElementById(`rg-enc-body-${q.id}`);
      if (body && body.style.display !== 'none') {
        window.RGEncToggle(q.id);
      }
    });
  });

  // Buscador rápido de preguntas
  const searchInput = document.getElementById('rg-search-input');
  searchInput?.addEventListener('input', (e) => {
    const term = (e.target.value || '').trim().toLowerCase();
    document.querySelectorAll('.rg-family-block').forEach(famBlock => {
      let visibleInFamily = 0;
      famBlock.querySelectorAll('.rg-enc-card').forEach(card => {
        const title = card.dataset.title || '';
        const match = !term || title.includes(term);
        card.style.display = match ? 'block' : 'none';
        if (match) visibleInFamily++;
      });
      famBlock.style.display = visibleInFamily > 0 ? 'block' : 'none';
    });
  });

  // Eventos de los selectores de filtro (Facultad, Carrera, Ciclo, Sede)
  const selFacultad = document.getElementById('rg-sel-facultad');
  const selCiclo = document.getElementById('rg-sel-ciclo');
  const selCarrera = document.getElementById('rg-sel-carrera');
  const selSede = document.getElementById('rg-sel-sede');
  const btnLimpiar = document.getElementById('rg-btn-limpiar');
  const btnActualizar = document.getElementById('rg-btn-actualizar');

  selFacultad?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.facultad = e.target.value;
      window.App.updateCarreras();
      window.App.applyFilters();
    }
  });

  selCiclo?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.ciclo = e.target.value;
      window.App.applyFilters();
    }
  });

  selCarrera?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.carrera = e.target.value;
      window.App.applyFilters();
    }
  });

  selSede?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.sede = e.target.value;
      window.App.applyFilters();
    }
  });

  btnLimpiar?.addEventListener('click', () => {
    if (window.App) {
      window.App.filters = { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
      window.App.updateCarreras();
      window.App.applyFilters();
    }
  });

  btnActualizar?.addEventListener('click', () => {
    window.App?.applyFilters();
  });
}
