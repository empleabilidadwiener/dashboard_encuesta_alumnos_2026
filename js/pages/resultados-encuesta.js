// js/pages/resultados-encuesta.js — Resultados Generales de la Encuesta (Todas las columnas pertinentes)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Cruces interactivos con 3 botones de desglose: Por Ciclo, Por Carrera y Por Sede (+ Vista General)

const QUESTIONS = [
  // === I. SITUACIÓN LABORAL Y CONDICIÓN DE ACTIVIDAD ===
  {
    id: 'empleabilidad_final',
    titulo: '1. ¿Trabaja o realiza actividad formativa actualmente? (Empleabilidad Final)',
    icono: 'fas fa-briefcase',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'empleabilidad_final',
    chartType: 'doughnut'
  },
  {
    id: 'condicion_pea',
    titulo: '2. Condición de Actividad Económica (PEA vs. No PEA)',
    icono: 'fas fa-users',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'condicion_pea',
    chartType: 'doughnut'
  },
  {
    id: 'actividad_remunerada',
    titulo: '3. ¿Percibe remuneración por su ocupación actual? (Actividad Remunerada)',
    icono: 'fas fa-hand-holding-usd',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'actividad_remunerada',
    chartType: 'bar',
    filterOccupied: true
  },
  {
    id: 'actividad_principal',
    titulo: '4. Actividad Principal que Realiza Actualmente',
    icono: 'fas fa-user-tie',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'actividad_principal',
    chartType: 'horizontal_bar'
  },
  {
    id: 'modalidad_vinculacion',
    titulo: '5. Régimen y Modalidad de Vinculación (Trabajo Dependiente)',
    icono: 'fas fa-file-signature',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'modalidad_vinculacion',
    chartType: 'horizontal_bar'
  },
  {
    id: 'trabajo_independiente',
    titulo: '6. Modalidad de Trabajo Independiente o Freelance',
    icono: 'fas fa-laptop-code',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'trabajo_independiente',
    chartType: 'horizontal_bar'
  },
  {
    id: 'formalizacion_negocio',
    titulo: '7. Nivel de Formalización del Negocio Propio o Familiar',
    icono: 'fas fa-store',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'formalizacion_negocio',
    chartType: 'bar'
  },
  {
    id: 'empresa',
    titulo: '8. Principales Centros Laborales e Instituciones Receptoras (Top 15)',
    icono: 'fas fa-hospital-alt',
    family: 'Situación Laboral y Condición de Actividad',
    col: 'empresa',
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
    chartType: 'horizontal_bar'
  },
  {
    id: 'modalidad_trabajo',
    titulo: '10. Modalidad de Ejecución del Trabajo (Presencial, Remota, Híbrida)',
    icono: 'fas fa-building',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'modalidad_trabajo',
    chartType: 'doughnut'
  },
  {
    id: 'ajuste_horario',
    titulo: '11. Facilidad de Ajuste de Horario Laboral por Estudios',
    icono: 'fas fa-clock',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'ajuste_horario',
    chartType: 'bar'
  },
  {
    id: 'ingreso_mensual',
    titulo: '12. Ingreso Mensual Bruto Aproximado (Escala Salarial)',
    icono: 'fas fa-money-bill-wave',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'ingreso_mensual',
    chartType: 'bar'
  },
  {
    id: 'primera_experiencia',
    titulo: '13. ¿Su Ocupación Actual es su Primera Experiencia Laboral / Formativa?',
    icono: 'fas fa-seedling',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'primera_experiencia',
    chartType: 'doughnut'
  },
  {
    id: 'pertinencia_carrera',
    titulo: '14. Nivel de Pertinencia de la Ocupación con su Carrera Profesional',
    icono: 'fas fa-check-double',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'pertinencia_carrera',
    chartType: 'bar'
  },
  {
    id: 'satisfaccion_actividad',
    titulo: '15. Nivel de Satisfacción con su Actividad Laboral / Formativa Actual',
    icono: 'fas fa-smile',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'satisfaccion_actividad',
    chartType: 'bar'
  },
  {
    id: 'plan_12_meses_trabaja',
    titulo: '16. Planes Laborales para los Próximos 12 Meses (Estudiantes que Trabajan)',
    icono: 'fas fa-compass',
    family: 'Condiciones Laborales, Ingresos y Pertinencia',
    col: 'plan_12_meses_trabaja',
    chartType: 'horizontal_bar'
  },

  // === III. BÚSQUEDA DE EMPLEO Y BARRERAS (NO TRABAJAN) ===
  {
    id: 'intencion_busqueda',
    titulo: '17. Intención de Búsqueda de Trabajo o Prácticas (Estudiantes que No Trabajan)',
    icono: 'fas fa-search',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'intencion_busqueda',
    chartType: 'horizontal_bar'
  },
  {
    id: 'tiempo_busqueda',
    titulo: '18. Tiempo Llevado en Búsqueda Activa de Empleo',
    icono: 'fas fa-hourglass-half',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'tiempo_busqueda',
    chartType: 'bar'
  },
  {
    id: 'participado_entrevista',
    titulo: '19. ¿Ha Participado en Procesos de Selección o Entrevistas Recientes?',
    icono: 'fas fa-comments',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'participado_entrevista',
    chartType: 'doughnut'
  },
  {
    id: 'factores_dificultan',
    titulo: '20. Principales Factores que Dificultan Encontrar Empleo (Opción Múltiple)',
    icono: 'fas fa-exclamation-circle',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'factores_dificultan',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'experiencia_previa',
    titulo: '21. ¿Cuenta con Experiencia Laboral o de Prácticas Previa?',
    icono: 'fas fa-history',
    family: 'Búsqueda de Empleo y Barreras',
    col: 'experiencia_previa',
    chartType: 'doughnut'
  },

  // === IV. HERRAMIENTAS, COMPETENCIAS Y AUTOEFICACIA ===
  {
    id: 'elementos_empleabilidad',
    titulo: '22. Herramientas de Empleabilidad con las que Cuenta el Estudiante (Múltiple)',
    icono: 'fas fa-toolbox',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'elementos_empleabilidad',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'competencias_fortalecer',
    titulo: '23. Competencias Prioritarias por Fortalecer (Opción Múltiple)',
    icono: 'fas fa-graduation-cap',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'competencias_fortalecer',
    chartType: 'horizontal_bar',
    multiSelect: true
  },
  {
    id: 'tipo_oportunidad_interes',
    titulo: '24. Tipo de Oportunidad Laboral de Mayor Interés',
    icono: 'fas fa-bullseye',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'tipo_oportunidad_interes',
    chartType: 'horizontal_bar'
  },
  {
    id: 'capaz_identificar_trabajo',
    titulo: '25. Autoeficacia: Identificar el Tipo de Trabajo o Área Profesional Deseada',
    icono: 'fas fa-lightbulb',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_identificar_trabajo',
    chartType: 'bar'
  },
  {
    id: 'capaz_postular_empleo',
    titulo: '26. Autoeficacia: Buscar y Postular a una Práctica o Empleo',
    icono: 'fas fa-paper-plane',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_postular_empleo',
    chartType: 'bar'
  },
  {
    id: 'capaz_explicar_habilidades',
    titulo: '27. Autoeficacia: Explicar Habilidades y Fortalezas en una Entrevista',
    icono: 'fas fa-user-check',
    family: 'Herramientas, Competencias y Autoeficacia',
    col: 'capaz_explicar_habilidades',
    chartType: 'bar'
  },

  // === V. SERVICIOS DE EMPLEABILIDAD WIENER ===
  {
    id: 'servicio_bolsa_laboral',
    titulo: '28. Conocimiento y Uso: Bolsa Laboral Wiener',
    icono: 'fas fa-briefcase',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_bolsa_laboral',
    chartType: 'bar'
  },
  {
    id: 'servicio_ferias_laborales',
    titulo: '29. Conocimiento y Uso: Ferias Laborales',
    icono: 'fas fa-calendar-check',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_ferias_laborales',
    chartType: 'bar'
  },
  {
    id: 'servicio_jornadas_charlas',
    titulo: '30. Conocimiento y Uso: Jornadas y Charlas con Empresas',
    icono: 'fas fa-chalkboard-teacher',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_jornadas_charlas',
    chartType: 'bar'
  },
  {
    id: 'servicio_talleres_programas',
    titulo: '31. Conocimiento y Uso: Talleres y Programas de Empleabilidad',
    icono: 'fas fa-laptop',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_talleres_programas',
    chartType: 'bar'
  },
  {
    id: 'servicio_asesorias',
    titulo: '32. Conocimiento y Uso: Asesorías Personalizadas de Empleabilidad',
    icono: 'fas fa-user-friends',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_asesorias',
    chartType: 'bar'
  },
  {
    id: 'servicio_cursos_actualizacion',
    titulo: '33. Conocimiento y Uso: Cursos de Actualización Profesional',
    icono: 'fas fa-certificate',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicio_cursos_actualizacion',
    chartType: 'bar'
  },
  {
    id: 'servicios_interes_12m',
    titulo: '34. Servicios de Empleabilidad de Mayor Interés en los Próximos 12 Meses (Múltiple)',
    icono: 'fas fa-star',
    family: 'Servicios de Empleabilidad Wiener',
    col: 'servicios_interes_12m',
    chartType: 'horizontal_bar',
    multiSelect: true
  },

  // === VI. PERFIL DEMOGRÁFICO ===
  {
    id: 'sexo',
    titulo: '35. Distribución de la Muestra por Sexo',
    icono: 'fas fa-venus-mars',
    family: 'Perfil Demográfico',
    col: 'sexo',
    chartType: 'doughnut'
  },
  {
    id: 'edad',
    titulo: '36. Distribución de la Muestra por Rango de Edad',
    icono: 'fas fa-user-clock',
    family: 'Perfil Demográfico',
    col: 'edad',
    chartType: 'bar'
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
  servicio_Talleres: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_talleres_programas: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_asesorias: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  servicio_cursos_actualizacion: ['Lo he usado', 'Lo conozco, no lo he usado', 'No lo conozco'],
  edad: ['16 a 20 años', '21 a 25 años', '26 a 30 años', '31 a 35 años', '36 años a más']
};

const PALETTE_WIENER = [
  '#07C8CC',
  '#156082',
  '#0a1b44',
  '#0E9F9F',
  '#38BDF8',
  '#6366F1',
  '#F59E0B',
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

// Renderiza la pestaña "General" de una pregunta
function renderGeneralChart(canvasId, q, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const dist = getOrderedDistribution(q, data);
  const noteEl = document.getElementById(`rg-enc-note-${q.id}`);
  if (noteEl) {
    noteEl.innerHTML = `Respuestas válidas analizadas: <strong>${dist.total.toLocaleString()}</strong> estudiantes.`;
  }

  const wrap = ctx.parentElement;

  if (q.chartType === 'doughnut') {
    if (wrap) wrap.style.height = '290px';
    const colors = dist.labels.map((_, i) => PALETTE_WIENER[i % PALETTE_WIENER.length]);
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
        cutout: '66%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
              color: '#1e293b',
              usePointStyle: true,
              boxWidth: 10,
              generateLabels: (chart) => {
                const ds = chart.data.datasets[0];
                return chart.data.labels.map((lbl, i) => ({
                  text: `${lbl}: ${formatPctText(dist.percents[i], dist.counts[i])} (${dist.counts[i].toLocaleString()})`,
                  fillStyle: ds.backgroundColor[i],
                  strokeStyle: '#fff',
                  index: i
                }));
              }
            }
          },
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
          const { chartArea, ctx } = chart;
          if (!chartArea) return;
          const cx = (chartArea.left + chartArea.right) / 2;
          const cy = (chartArea.top + chartArea.bottom) / 2;
          ctx.save();
          ctx.font = '800 20px Inter, sans-serif';
          ctx.fillStyle = '#0a1b44';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(dist.total.toLocaleString(), cx, cy - 8);
          ctx.font = '600 11px Inter, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText('Respuestas', cx, cy + 10);
          ctx.restore();
        }
      }]
    });
    return;
  }

  if (q.chartType === 'horizontal_bar') {
    if (wrap) {
      wrap.style.height = `${Math.max(260, dist.labels.length * 36)}px`;
    }
    const maxChars = typeof window !== 'undefined' && window.innerWidth < 768 ? 28 : 48;
    const wrappedLabels = dist.labels.map(l => Calculations.wrapLabel(l, maxChars));
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
        layout: { padding: { right: 80, left: 8, top: 6, bottom: 6 } },
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
            ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#1e293b' },
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

  // Vertical Bar Chart (Escalas ordinales: ingresos, satisfacción, pertinencia, tiempo, autoeficacia, servicios)
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
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const subset = getQuestionDataset(q, data);
  const baseDist = getOrderedDistribution(q, data);
  // Categorías de respuesta (en su orden natural / ordinal, o top 6 para múltiples/listas largas)
  const categories = (q.multiSelect || q.topLimit) ? baseDist.labels.slice(0, 6) : baseDist.labels;

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
    const validCarreras = Object.keys(carreraCounts).filter(c => carreraCounts[c] >= MIN_MUESTRA);
    groups = validCarreras.map(c => ({
      key: c,
      label: window.toTitleCase ? window.toTitleCase(c) : c
    }));
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
    wrap.style.height = isHorizontal ? `${Math.max(360, groups.length * 32)}px` : '350px';
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
    noteEl.innerHTML = `Desglose transversal por <strong>${dimLabel}</strong> (% calculado al interior de cada grupo).`;
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

  const carreras = DataLoader.getCarreras(currentFilters.facultad);
  const ciclos = DataLoader.getCiclos();
  const sedes = DataLoader.getSedes();

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
      <div class="exec-header-subtitle">Explorador integral de las ${QUESTIONS.length} variables pertinentes del instrumento con desglose directo por Ciclo, Carrera y Sede</div>

      <!-- Barra de Filtros por Ciclo, Carrera y Sede + Botones Globales de Desglose -->
      <div class="exec-filters-panel" style="flex-wrap: wrap; gap: 14px;">
        <div class="exec-filters-group">
          <div class="exec-filter-item">
            <label for="rg-sel-ciclo">Ciclo</label>
            <select id="rg-sel-ciclo">
              <option value="Todos">Todos los ciclos</option>
              ${ciclos.map(c => `<option value="${c}" ${String(currentFilters.ciclo) === String(c) ? 'selected' : ''}>Ciclo ${c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-item">
            <label for="rg-sel-carrera">Carrera</label>
            <select id="rg-sel-carrera">
              <option value="Todas">Todas las carreras</option>
              ${carreras.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-item">
            <label for="rg-sel-sede">Sede</label>
            <select id="rg-sel-sede">
              <option value="Todas">Todas las sedes</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 3 Botones Maestros de Desglose: Ciclo, Carrera y Sede (+ General) -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 12px; font-weight: 700; color: #0a1b44;">Vista Global:</span>
          <div class="exec-segmented-control" id="rg-global-mode-group">
            <button type="button" class="exec-seg-btn ${globalActiveBreakdown === 'general' ? 'active' : ''}" data-mode="general">
              <i class="fas fa-chart-pie" style="margin-right: 4px;"></i> General
            </button>
            <button type="button" class="exec-seg-btn ${globalActiveBreakdown === 'ciclo' ? 'active' : ''}" data-mode="ciclo">
              <i class="fas fa-layer-group" style="margin-right: 4px;"></i> Por Ciclo
            </button>
            <button type="button" class="exec-seg-btn ${globalActiveBreakdown === 'carrera' ? 'active' : ''}" data-mode="carrera">
              <i class="fas fa-graduation-cap" style="margin-right: 4px;"></i> Por Carrera
            </button>
            <button type="button" class="exec-seg-btn ${globalActiveBreakdown === 'sede' ? 'active' : ''}" data-mode="sede">
              <i class="fas fa-map-marker-alt" style="margin-right: 4px;"></i> Por Sede
            </button>
          </div>
          <button class="exec-btn-clean" id="rg-btn-limpiar">Limpiar filtros</button>
        </div>
      </div>

      <!-- 4 KPIs Resumen -->
      <div class="exec-kpis-container" style="grid-template-columns: repeat(4, 1fr);">
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

      <!-- Listado de Variables agrupadas por bloque temático -->
      <div id="rg-encuesta-list" style="display: flex; flex-direction: column; gap: 16px;">
        ${families.map((fam, famIdx) => {
          const famQuestions = QUESTIONS.filter(q => q.family === fam);
          return `
            <div style="margin-top: ${famIdx === 0 ? '4px' : '14px'};">
              <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #156082; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #07C8CC; display: inline-block;"></span>
                ${fam} (${famQuestions.length} variables)
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${famQuestions.map((q) => {
                  const isOpen = q.id === 'empleabilidad_final' || q.id === 'actividad_remunerada' || q.id === 'ingreso_mensual';
                  return `
                    <div class="exec-panel rg-enc-card" id="rg-card-${q.id}" data-visual-id="rg-enc-${q.id}" style="padding: 0; margin-bottom: 0; overflow: hidden; border: 1px solid #e2e8f0;">
                      
                      <div class="rg-enc-header" onclick="window.RGEncToggle('${q.id}')" style="cursor: pointer; padding: 16px 22px; display: flex; align-items: center; gap: 14px; background: #ffffff; border-bottom: ${isOpen ? '1px solid #e2e8f0' : 'none'};">
                        <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(7, 200, 204, 0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                          <i class="${q.icono}" style="color: #07C8CC; font-size: 15px;"></i>
                        </div>
                        <span style="flex: 1; font-weight: 700; color: #0a1b44; font-size: 14.5px;">${q.titulo}</span>
                        <span style="font-size: 11px; padding: 4px 10px; border-radius: 9999px; background: #f1f5f9; color: #475569; font-weight: 600;">
                          <code>${q.col}</code>
                        </span>
                        <i class="fas fa-chevron-down rg-enc-chevron" style="transition: transform 0.2s; color: #64748b; font-size: 13px; transform: ${isOpen ? 'rotate(180deg)' : 'none'};"></i>
                      </div>

                      <div class="rg-enc-body" id="rg-enc-body-${q.id}" style="display: ${isOpen ? 'block' : 'none'}; padding: 18px 22px; background: #f8fafc;">
                        
                        <!-- Barra de botones por pregunta: General + 3 botones (Por Ciclo, Por Carrera, Por Sede) -->
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
                          <div class="rg-enc-tabs" data-qid="${q.id}" style="background: #ffffff; padding: 5px; border-radius: 9px; border: 1px solid #e2e8f0; display: inline-flex; flex-wrap: wrap; gap: 4px;">
                            <button type="button" class="rg-enc-tab ${globalActiveBreakdown === 'general' ? 'active' : ''}" data-mode="general" onclick="window.RGEncSwitchTab('${q.id}', 'general', this)" style="border-radius: 6px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; background: ${globalActiveBreakdown === 'general' ? '#07C8CC' : 'transparent'}; color: ${globalActiveBreakdown === 'general' ? '#ffffff' : '#64748b'};">
                              <i class="fas fa-chart-pie" style="margin-right: 4px;"></i> General
                            </button>
                            <button type="button" class="rg-enc-tab ${globalActiveBreakdown === 'ciclo' ? 'active' : ''}" data-mode="ciclo" onclick="window.RGEncSwitchTab('${q.id}', 'ciclo', this)" style="border-radius: 6px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; background: ${globalActiveBreakdown === 'ciclo' ? '#07C8CC' : 'transparent'}; color: ${globalActiveBreakdown === 'ciclo' ? '#ffffff' : '#64748b'};">
                              <i class="fas fa-layer-group" style="margin-right: 4px;"></i> Por Ciclo
                            </button>
                            <button type="button" class="rg-enc-tab ${globalActiveBreakdown === 'carrera' ? 'active' : ''}" data-mode="carrera" onclick="window.RGEncSwitchTab('${q.id}', 'carrera', this)" style="border-radius: 6px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; background: ${globalActiveBreakdown === 'carrera' ? '#07C8CC' : 'transparent'}; color: ${globalActiveBreakdown === 'carrera' ? '#ffffff' : '#64748b'};">
                              <i class="fas fa-graduation-cap" style="margin-right: 4px;"></i> Por Carrera
                            </button>
                            <button type="button" class="rg-enc-tab ${globalActiveBreakdown === 'sede' ? 'active' : ''}" data-mode="sede" onclick="window.RGEncSwitchTab('${q.id}', 'sede', this)" style="border-radius: 6px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; background: ${globalActiveBreakdown === 'sede' ? '#07C8CC' : 'transparent'}; color: ${globalActiveBreakdown === 'sede' ? '#ffffff' : '#64748b'};">
                              <i class="fas fa-map-marker-alt" style="margin-right: 4px;"></i> Por Sede
                            </button>
                          </div>
                          <span id="rg-enc-note-${q.id}" style="font-size: 12px; color: #64748b;"></span>
                        </div>

                        <div style="background: #ffffff; border-radius: 10px; padding: 18px; border: 1px solid #e2e8f0;">
                          <div class="exec-chart-canvas-wrap" style="height: 290px; position: relative;">
                            <canvas id="rg-enc-canvas-${q.id}"></canvas>
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
        <p>Nota metodológica: Todas las escalas ordinales (ingresos mensuales, pertinencia, satisfacción, autoeficacia, tiempo de búsqueda y servicios) se presentan en su orden secuencial de escala.</p>
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
  };

  // Renderizar tarjetas abiertas por defecto
  ['empleabilidad_final', 'actividad_remunerada', 'ingreso_mensual'].forEach(qId => {
    renderCardChart(qId, globalActiveBreakdown);
  });

  window.RGEncToggle = (qId) => {
    const body = document.getElementById(`rg-enc-body-${qId}`);
    const card = document.getElementById(`rg-card-${qId}`);
    if (!body || !card) return;
    const header = card.querySelector('.rg-enc-header');
    const chevron = card.querySelector('.rg-enc-chevron');
    const isOpen = body.style.display !== 'none';
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
    body.querySelectorAll('.rg-enc-tab').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = '#64748b';
    });
    btn.classList.add('active');
    btn.style.background = '#07C8CC';
    btn.style.color = '#ffffff';
    renderCardChart(qId, mode);
  };

  // Eventos de los 3 botones globales (General / Por Ciclo / Por Carrera / Por Sede)
  document.querySelectorAll('#rg-global-mode-group .exec-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode) return;
      globalActiveBreakdown = mode;
      document.querySelectorAll('#rg-global-mode-group .exec-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Actualizar todas las tarjetas abiertas al modo seleccionado
      QUESTIONS.forEach(q => {
        const body = document.getElementById(`rg-enc-body-${q.id}`);
        if (!body) return;
        body.querySelectorAll('.rg-enc-tab').forEach(t => {
          const isMatch = t.dataset.mode === mode;
          t.classList.toggle('active', isMatch);
          t.style.background = isMatch ? '#07C8CC' : 'transparent';
          t.style.color = isMatch ? '#ffffff' : '#64748b';
        });
        if (body.style.display !== 'none') {
          renderCardChart(q.id, mode);
        }
      });
    });
  });

  // Eventos de los selectores de filtro (Ciclo, Carrera, Sede)
  const selCiclo = document.getElementById('rg-sel-ciclo');
  const selCarrera = document.getElementById('rg-sel-carrera');
  const selSede = document.getElementById('rg-sel-sede');
  const btnLimpiar = document.getElementById('rg-btn-limpiar');

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
}

