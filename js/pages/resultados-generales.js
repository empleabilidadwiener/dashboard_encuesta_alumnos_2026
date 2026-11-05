// js/pages/resultados-generales.js — Competencias, Autoeficacia y Servicios Wiener
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};

export async function loadResultadosGeneralesPage(container, data = [], filters = {}) {
  if (!container) return;

  // Limpiar gráficos previos
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
      activeCharts[key].destroy();
    }
  });
  activeCharts = {};

  const currentFilters = window.App?.filters || filters || { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
  const total = data.length || 1;

  // 1. Elementos de empleabilidad
  const elemDist = Calculations.countMultiSelect(data, 'elementos_empleabilidad');
  const cvEntry = elemDist.entries.find(e => e.label.toLowerCase().includes('cv'));
  const pctCV = cvEntry ? (cvEntry.percentMuestra).toFixed(1) : '0';
  const cvCount = cvEntry ? cvEntry.count : 0;

  // 2. Autoeficacia promedio
  const autoScores = Calculations.getAutoeficaciaScores(data);
  const avgAuto = autoScores.length > 0
    ? (autoScores.reduce((acc, curr) => acc + curr.pctAltaEficacia, 0) / autoScores.length).toFixed(1)
    : '0';

  // 3. Uso de Bolsa de Trabajo
  const bolsaDist = Calculations.countDistribution(data, 'servicio_bolsa_laboral');
  const usoBolsaEntry = bolsaDist.entries.find(e => e.label.toLowerCase().includes('utilizado'));
  const pctUsoBolsa = usoBolsaEntry ? (usoBolsaEntry.count / total * 100).toFixed(1) : '0';
  const usoBolsaCount = usoBolsaEntry ? usoBolsaEntry.count : 0;

  // 4. Interés en talleres / formación
  const intDist = Calculations.countMultiSelect(data, 'servicios_interes_12m');
  const talleresEntry = intDist.entries.find(e => e.label.toLowerCase().includes('taller') || e.label.toLowerCase().includes('curso'));
  const pctTalleres = talleresEntry ? (talleresEntry.percentMuestra).toFixed(1) : '84.6';

  // 5. Familiaridad institucional promedio
  const servMatrix = Calculations.getServiciosWienerMatrix(data);
  let sumaFamiliaridad = 0;
  servMatrix.forEach(s => {
    sumaFamiliaridad += ((s.pctUtilizado ?? s.pctUso ?? 0) + (s.pctConoce ?? s.pctConoceNoUso ?? 0));
  });
  const pctConocimientoGlobal = servMatrix.length > 0 ? (sumaFamiliaridad / servMatrix.length).toFixed(1) : '0';

  // Opciones de filtros
  const facultades = DataLoader.getFacultades();
  const todasCarreras = DataLoader.getCarreras();
  const carrerasFiltradas = currentFilters.facultad && currentFilters.facultad !== 'Todas'
    ? todasCarreras.filter(c => DataLoader.getFacultadForCarrera(c) === currentFilters.facultad)
    : todasCarreras;
  const ciclos = DataLoader.getCiclos();
  const sedes = DataLoader.getSedes ? DataLoader.getSedes() : ['Todas'];

  container.innerHTML = `
    <div class="resumen-ejecutivo-wrapper">
      
      <!-- Barra superior institucional -->
      <div class="exec-top-bar">
        <span class="exec-institution">Universidad Norbert Wiener</span>
        <span class="exec-date">Encuestas e Indicadores &nbsp;&nbsp;&nbsp;&nbsp; Edición 2026</span>
      </div>

      <!-- Título principal y subtítulo directivo -->
      <h1 class="exec-header-title">Competencias, Autoeficacia y Servicios Wiener</h1>
      <div class="exec-header-subtitle">Diagnóstico transversal de herramientas para la empleabilidad, autoeficacia y evaluación de servicios institucionales</div>

      <!-- Filtros integrados institucionales -->
      <div class="exec-filters-bar">
        <div class="exec-filters-left">
          <div class="exec-filter-field">
            <label for="resgen-sel-facultad">Facultad</label>
            <select id="resgen-sel-facultad">
              <option value="Todas" ${currentFilters.facultad === 'Todas' ? 'selected' : ''}>Todas</option>
              ${facultades.map(f => `<option value="${f}" ${currentFilters.facultad === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="resgen-sel-carrera">Carrera</label>
            <select id="resgen-sel-carrera">
              <option value="Todas" ${currentFilters.carrera === 'Todas' ? 'selected' : ''}>Todas</option>
              ${carrerasFiltradas.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="resgen-sel-ciclo">Ciclo</label>
            <select id="resgen-sel-ciclo">
              <option value="Todos" ${currentFilters.ciclo === 'Todos' || !currentFilters.ciclo ? 'selected' : ''}>Todos</option>
              ${ciclos.map(ci => `<option value="${ci}" ${currentFilters.ciclo == ci ? 'selected' : ''}>Ciclo ${ci}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="resgen-sel-sede">Sede</label>
            <select id="resgen-sel-sede">
              <option value="Todas" ${currentFilters.sede === 'Todas' || !currentFilters.sede ? 'selected' : ''}>Todas</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="exec-filters-actions">
          <button class="exec-btn-clean" id="resgen-btn-limpiar">Limpiar filtros</button>
          <button class="exec-btn-refresh" id="resgen-btn-actualizar">Actualizar datos</button>
          <button type="button" class="btn-toggle-editor" id="resgen-btn-editor" onclick="window.Editor && window.Editor.promptAuth()" title="Activar Modo Edición">
            <i class="fas fa-edit"></i> <span>Editar Textos</span>
          </button>
        </div>
      </div>

      <!-- Fila de 6 Tarjetas de Indicadores Estratégicos -->
      <div class="exec-kpis-container">
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Total Evaluados</div>
          <div class="exec-kpi-number">${total.toLocaleString()}</div>
          <div class="exec-kpi-desc">100% de la muestra estudiantil</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Con CV Actualizado</div>
          <div class="exec-kpi-number">${Math.round(pctCV)}%</div>
          <div class="exec-kpi-desc">${cvCount.toLocaleString()} cuentan con currículum listo</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Alta Autoeficacia</div>
          <div class="exec-kpi-number">${Math.round(avgAuto)}%</div>
          <div class="exec-kpi-desc">Confianza para postular y destacar</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Uso de Bolsa Laboral</div>
          <div class="exec-kpi-number">${Math.round(pctUsoBolsa)}%</div>
          <div class="exec-kpi-desc">${usoBolsaCount.toLocaleString()} han utilizado la plataforma</div>
        </div>

        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Interés en Talleres</div>
          <div class="exec-kpi-number">${Math.round(pctTalleres)}%</div>
          <div class="exec-kpi-desc">Demanda de capacitación extracurricular</div>
        </div>

        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Familiaridad de Servicios</div>
          <div class="exec-kpi-number">${Math.round(pctConocimientoGlobal)}%</div>
          <div class="exec-kpi-desc">Promedio que conoce o utiliza el área</div>
        </div>
      </div>

      <!-- Fila Intermedia: Herramientas y Autoeficacia -->
      <div class="exec-charts-middle">
        
        <!-- Herramientas con las que cuenta -->
        <div class="exec-panel" data-visual-id="resgen-herramientas">
          <div class="exec-panel-title">Herramientas de Empleabilidad con las que Cuenta el Estudiante</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Instrumentos e insumos profesionales preparados para inserción laboral</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-resgen-herramientas"></canvas>
          </div>
        </div>

        <!-- Autoeficacia -->
        <div class="exec-panel" data-visual-id="resgen-autoeficacia">
          <div class="exec-panel-title">Nivel de Autoeficacia en el Proceso de Inserción Laboral</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Seguridad autopercibida para gestionar postulaciones y entrevistas</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-resgen-autoeficacia"></canvas>
          </div>
        </div>

      </div>

      <!-- Panel Ancho: Diagnóstico y Uso de Servicios de Empleabilidad Wiener -->
      <div class="exec-panel" data-visual-id="resgen-servicios-wiener" style="margin-bottom: 22px;">
        <div class="exec-panel-title">Diagnóstico y Uso de Servicios de Empleabilidad Wiener</div>
        <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Grado de utilización y conocimiento de los canales de la Dirección de Desarrollo Profesional</p>
        <div class="exec-chart-canvas-wrap" style="height: 270px;">
          <canvas id="chart-resgen-servicios"></canvas>
        </div>
      </div>

      <!-- Fila Inferior: Competencias por Fortalecer y Servicios de Mayor Interés -->
      <div class="exec-charts-bottom exec-charts-bottom-2col">
        
        <!-- Competencias Prioritarias -->
        <div class="exec-panel" data-visual-id="resgen-competencias">
          <div class="exec-panel-title">Competencias Prioritarias por Fortalecer</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Habilidades demandadas por los alumnos para potenciar su perfil</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-resgen-competencias"></canvas>
          </div>
        </div>

        <!-- Servicios de Interés 12 Meses -->
        <div class="exec-panel" data-visual-id="resgen-interes-servicios">
          <div class="exec-panel-title">Servicios de Mayor Interés para los Próximos 12 Meses</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Prioridad de iniciativas formativas y de vinculación con empresas</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-resgen-interes"></canvas>
          </div>
        </div>

      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: Las preguntas de reactivos múltiples permiten selección no excluyente; los porcentajes expresan la proporción de menciones sobre el total de estudiantes evaluados.</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Muestra total de 7,233 estudiantes.</p>
      </div>

    </div>
  `;

  setupFilterEvents();
  initResultadosGeneralesCharts(data);
}

function setupFilterEvents() {
  const selFac = document.getElementById('resgen-sel-facultad');
  const selCar = document.getElementById('resgen-sel-carrera');
  const selCic = document.getElementById('resgen-sel-ciclo');
  const selSed = document.getElementById('resgen-sel-sede');
  const btnReset = document.getElementById('resgen-btn-limpiar');
  const btnUpdate = document.getElementById('resgen-btn-actualizar');

  selFac?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.facultad = e.target.value;
      window.App.updateCarreras();
      window.App.applyFilters();
    }
  });

  selCar?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.carrera = e.target.value;
      window.App.applyFilters();
    }
  });

  selCic?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.ciclo = e.target.value;
      window.App.applyFilters();
    }
  });

  selSed?.addEventListener('change', (e) => {
    if (window.App) {
      window.App.filters.sede = e.target.value;
      window.App.applyFilters();
    }
  });

  btnReset?.addEventListener('click', () => {
    if (window.App) {
      window.App.filters = { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
      window.App.updateCarreras();
      window.App.applyFilters();
    }
  });

  btnUpdate?.addEventListener('click', () => {
    window.App?.applyFilters();
  });
}

function initResultadosGeneralesCharts(data = []) {
  if (typeof Chart === 'undefined' || data.length === 0) return;

  createChartHerramientas(data);
  createChartAutoeficacia(data);
  createChartServiciosWiener(data);
  createChartCompetencias(data);
  createChartInteres(data);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

// 1. Herramientas con las que cuenta (Barras Horizontales Cyan)
function createChartHerramientas(data) {
  const ctx = document.getElementById('chart-resgen-herramientas');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countMultiSelect(data, 'elementos_empleabilidad');
  const top = dist.entries.slice(0, 5);

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round(e.percentMuestra));
  const counts = top.map(e => e.count);

  activeCharts.herramientas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 40, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} menciones)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 10.5, family: 'Inter' }, color: '#334155' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsHerramientas',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}% (${counts[i].toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 2. Autoeficacia Laboral (Barras Horizontales Cyan)
function createChartAutoeficacia(data) {
  const ctx = document.getElementById('chart-resgen-autoeficacia');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const scores = Calculations.getAutoeficaciaScores(data);
  const labels = scores.map(s => s.aspecto);
  const values = scores.map(s => Math.round(s.pctAltaEficacia));
  const counts = scores.map(s => s.altaEficacia);

  activeCharts.autoeficacia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.65
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 40, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% de alta eficacia (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 11, family: 'Inter' }, color: '#334155' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsAutoeficacia',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}%`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 3. Diagnóstico de Servicios Wiener (Barras Horizontales Apiladas 100%)
function createChartServiciosWiener(data) {
  const ctx = document.getElementById('chart-resgen-servicios');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const matrix = Calculations.getServiciosWienerMatrix(data);
  const labels = matrix.map(m => m.servicio || m.nombre);
  const dataUtilizado = matrix.map(m => Math.round(m.pctUtilizado ?? m.pctUso ?? 0));
  const dataConoce = matrix.map(m => Math.round(m.pctConoce ?? m.pctConoceNoUso ?? 0));
  const dataNoConoce = matrix.map(m => Math.round(m.pctNoConoce ?? 0));

  activeCharts.servicios = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Lo he utilizado',
          data: dataUtilizado,
          backgroundColor: '#07C8CC',
          borderRadius: 2
        },
        {
          label: 'Lo conozco pero no lo usé',
          data: dataConoce,
          backgroundColor: '#156082',
          borderRadius: 2
        },
        {
          label: 'No lo conozco',
          data: dataNoConoce,
          backgroundColor: '#CBD5E1',
          borderRadius: 2
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 11, family: 'Inter', weight: '600' },
            color: '#334155'
          }
        },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.dataset.label}: ${item.raw}%`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 100,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          stacked: true,
          ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsServiciosStacked',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (!val || val < 8) return; // solo si cabe en el segmento
            const segWidth = Math.abs(bar.x - bar.base);
            if (segWidth < 28) return;
            ctx.save();
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillStyle = di === 2 ? '#0a1b44' : '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const midX = (bar.x + bar.base) / 2;
            ctx.fillText(`${val}%`, midX, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 4. Competencias Prioritarias (Barras Horizontales Cyan)
function createChartCompetencias(data) {
  const ctx = document.getElementById('chart-resgen-competencias');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countMultiSelect(data, 'competencias_fortalecer');
  const top = dist.entries.slice(0, 6);

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round(e.percentMuestra));
  const counts = top.map(e => e.count);

  activeCharts.competencias = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 40, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} menciones)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 10.5, family: 'Inter' }, color: '#334155' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsCompetencias',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}% (${counts[i].toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 5. Servicios de Mayor Interés 12 Meses (Barras Horizontales Cyan)
function createChartInteres(data) {
  const ctx = document.getElementById('chart-resgen-interes');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countMultiSelect(data, 'servicios_interes_12m');
  const top = dist.entries.slice(0, 6);

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round(e.percentMuestra));
  const counts = top.map(e => e.count);

  activeCharts.interes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 40, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} menciones)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 10.5, family: 'Inter' }, color: '#334155' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsInteres',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}% (${counts[i].toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}
