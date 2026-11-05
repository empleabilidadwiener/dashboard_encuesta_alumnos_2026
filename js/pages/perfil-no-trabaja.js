// js/pages/perfil-no-trabaja.js — Perfil de Estudiantes que No Trabajan
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};

export async function loadPerfilNoTrabajaPage(container, data = [], filters = {}) {
  if (!container) return;

  // Limpiar gráficos previos
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
      activeCharts[key].destroy();
    }
  });
  activeCharts = {};

  const currentFilters = window.App?.filters || filters || { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
  const noTrabajadores = Calculations.getRespuestasNoTrabajadores(data);
  const totalNoTrabajan = noTrabajadores.length;
  const totalMuestra = data.length || 1;
  const pctNoTrabajan = (totalNoTrabajan / totalMuestra * 100).toFixed(1);

  // 1. Búsqueda activa
  const buscanActivos = noTrabajadores.filter(d => (d.intencion_busqueda || '').toLowerCase().includes('activamente')).length;
  const pctBuscanActivos = totalNoTrabajan > 0 ? (buscanActivos / totalNoTrabajan * 100).toFixed(1) : 0;

  // 2. Con experiencia previa
  const conExp = noTrabajadores.filter(d => (d.experiencia_previa || '').trim().toLowerCase() === 'sí').length;
  const pctConExp = totalNoTrabajan > 0 ? (conExp / totalNoTrabajan * 100).toFixed(1) : 0;

  // 3. Participación en entrevistas
  const enEntrevista = noTrabajadores.filter(d => (d.participado_entrevista || '').trim().toLowerCase() === 'sí').length;
  const pctEntrevista = buscanActivos > 0 ? (enEntrevista / buscanActivos * 100).toFixed(1) : 0;

  // 4. Búsqueda reciente (< 3 meses)
  const tiempoReciente = noTrabajadores.filter(d => (d.tiempo_busqueda || '').toLowerCase().includes('menos de 3 meses')).length;
  const pctReciente = buscanActivos > 0 ? (tiempoReciente / buscanActivos * 100).toFixed(1) : 0;

  // 5. Dedicación a estudios
  const dedicacionEstudios = noTrabajadores.filter(d => {
    const i = (d.intencion_busqueda || '').toLowerCase();
    return i.includes('terminar mis estudios') || i.includes('no busco');
  }).length;
  const pctEstudios = totalNoTrabajan > 0 ? (dedicacionEstudios / totalNoTrabajan * 100).toFixed(1) : 0;

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
      <h1 class="exec-header-title">Perfil de Estudiantes que No Trabajan</h1>
      <div class="exec-header-subtitle">Dedicación académica, intención de búsqueda laboral, tiempos de postulación y factores de dificultad</div>

      <!-- Filtros integrados institucionales -->
      <div class="exec-filters-bar">
        <div class="exec-filters-left">
          <div class="exec-filter-field">
            <label for="notrab-sel-facultad">Facultad</label>
            <select id="notrab-sel-facultad">
              <option value="Todas" ${currentFilters.facultad === 'Todas' ? 'selected' : ''}>Todas</option>
              ${facultades.map(f => `<option value="${f}" ${currentFilters.facultad === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="notrab-sel-carrera">Carrera</label>
            <select id="notrab-sel-carrera">
              <option value="Todas" ${currentFilters.carrera === 'Todas' ? 'selected' : ''}>Todas</option>
              ${carrerasFiltradas.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="notrab-sel-ciclo">Ciclo</label>
            <select id="notrab-sel-ciclo">
              <option value="Todos" ${currentFilters.ciclo === 'Todos' || !currentFilters.ciclo ? 'selected' : ''}>Todos</option>
              ${ciclos.map(ci => `<option value="${ci}" ${currentFilters.ciclo == ci ? 'selected' : ''}>Ciclo ${ci}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="notrab-sel-sede">Sede</label>
            <select id="notrab-sel-sede">
              <option value="Todas" ${currentFilters.sede === 'Todas' || !currentFilters.sede ? 'selected' : ''}>Todas</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="exec-filters-actions">
          <button class="exec-btn-clean" id="notrab-btn-limpiar">Limpiar filtros</button>
          <button class="exec-btn-refresh" id="notrab-btn-actualizar">Actualizar datos</button>
          <button type="button" class="btn-toggle-editor" id="notrab-btn-editor" onclick="window.Editor && window.Editor.promptAuth()" title="Activar Modo Edición">
            <i class="fas fa-edit"></i> <span>Editar Textos</span>
          </button>
        </div>
      </div>

      <!-- Fila de 6 Tarjetas de Indicadores Estratégicos -->
      <div class="exec-kpis-container">
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">No Trabajan Actualmente</div>
          <div class="exec-kpi-number">${totalNoTrabajan.toLocaleString()}</div>
          <div class="exec-kpi-desc">${pctNoTrabajan}% de los estudiantes encuestados</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Búsqueda Activa</div>
          <div class="exec-kpi-number">${Math.round(pctBuscanActivos)}%</div>
          <div class="exec-kpi-desc">${buscanActivos.toLocaleString()} buscan empleo o prácticas</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Con Experiencia Previa</div>
          <div class="exec-kpi-number">${Math.round(pctConExp)}%</div>
          <div class="exec-kpi-desc">${conExp.toLocaleString()} han laborado anteriormente</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Han Tenido Entrevistas</div>
          <div class="exec-kpi-number">${Math.round(pctEntrevista)}%</div>
          <div class="exec-kpi-desc">De quienes buscan activamente (${enEntrevista.toLocaleString()})</div>
        </div>

        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Búsqueda Reciente (&lt;3m)</div>
          <div class="exec-kpi-number">${Math.round(pctReciente)}%</div>
          <div class="exec-kpi-desc">${tiempoReciente.toLocaleString()} en fase inicial de búsqueda</div>
        </div>

        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Dedicación Exclusiva</div>
          <div class="exec-kpi-number">${Math.round(pctEstudios)}%</div>
          <div class="exec-kpi-desc">Priorizan culminar su ciclo académico</div>
        </div>
      </div>

      <!-- Fila Intermedia: Intención de Búsqueda y Experiencia Previa -->
      <div class="exec-charts-middle">
        
        <!-- Intención de Búsqueda -->
        <div class="exec-panel" data-visual-id="notrab-intencion-busqueda">
          <div class="exec-panel-title">Intención de Búsqueda de Trabajo o Prácticas</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Planes y momento de inserción laboral previsto por el estudiante</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-notrab-intencion"></canvas>
          </div>
        </div>

        <!-- Experiencia Previa (Dona 2 slices) -->
        <div class="exec-panel" data-visual-id="notrab-experiencia-previa">
          <div class="exec-panel-title">Experiencia Laboral o Formativa Previa</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Proporción con antecedentes laborales previos</p>
          <div class="exec-donut-container" style="min-height: 250px;">
            <div class="exec-donut-canvas-wrap" style="position: relative; width: 170px; height: 170px;">
              <canvas id="chart-notrab-experiencia"></canvas>
            </div>
            <div class="exec-donut-legend" id="exec-donut-legend-notrab-exp"></div>
          </div>
        </div>

      </div>

      <!-- Fila Inferior: Tiempos de Búsqueda y Factores de Dificultad -->
      <div class="exec-charts-bottom exec-charts-bottom-2col">
        
        <!-- Tiempo en Búsqueda Activa -->
        <div class="exec-panel" data-visual-id="notrab-tiempo-busqueda">
          <div class="exec-panel-title">Tiempo en Situación de Búsqueda Activa</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Meses transcurridos buscando oportunidad laboral o formativa</p>
          <div class="exec-chart-canvas-wrap" style="height: 240px;">
            <canvas id="chart-notrab-tiempo"></canvas>
          </div>
        </div>

        <!-- Factores que Dificultan Encontrar Empleo -->
        <div class="exec-panel" data-visual-id="notrab-factores-dificultad">
          <div class="exec-panel-title">Principales Factores que Dificultan Encontrar Empleo</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Barreras reportadas por los estudiantes para acceder al mercado</p>
          <div class="exec-chart-canvas-wrap" style="height: 240px;">
            <canvas id="chart-notrab-factores"></canvas>
          </div>
        </div>

      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: El módulo de Estudiantes que No Trabajan comprende 2,833 encuestados (39.2% de la muestra total), distribuidos entre la <strong>PEA Desocupada (1,326 estudiantes)</strong> que buscan empleo o prácticas activamente o en los próximos 3 meses (considerados en el denominador de la tasa oficial de empleabilidad), y la <strong>No PEA / Inactivos (1,507 estudiantes)</strong> que priorizan culminar sus estudios o buscarán más adelante (celdas vacías en la columna central de empleabilidad).</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Muestra total: 7,233 estudiantes.</p>
      </div>

    </div>
  `;

  setupFilterEvents();
  initPerfilNoTrabajaCharts(noTrabajadores);
}

function setupFilterEvents() {
  const selFac = document.getElementById('notrab-sel-facultad');
  const selCar = document.getElementById('notrab-sel-carrera');
  const selCic = document.getElementById('notrab-sel-ciclo');
  const selSed = document.getElementById('notrab-sel-sede');
  const btnReset = document.getElementById('notrab-btn-limpiar');
  const btnUpdate = document.getElementById('notrab-btn-actualizar');

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

function initPerfilNoTrabajaCharts(noTrabajadores = []) {
  if (typeof Chart === 'undefined' || noTrabajadores.length === 0) return;

  createChartIntencion(noTrabajadores);
  createChartExperiencia(noTrabajadores);
  createChartTiempo(noTrabajadores);
  createChartFactores(noTrabajadores);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

// 1. Intención de Búsqueda (Barras Horizontales Cyan)
function createChartIntencion(noTrabajadores) {
  const ctx = document.getElementById('chart-notrab-intencion');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(noTrabajadores, 'intencion_busqueda');
  const top = dist.entries.slice(0, 5);
  const total = noTrabajadores.length || 1;

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

  activeCharts.intencion = new Chart(ctx, {
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
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.max(...values, 40) + 10,
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
      id: 'labelsIntencion',
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

// 2. Experiencia Previa (Dona 2 colores Wiener)
function createChartExperiencia(noTrabajadores) {
  const ctx = document.getElementById('chart-notrab-experiencia');
  const legendContainer = document.getElementById('exec-donut-legend-notrab-exp');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(noTrabajadores, 'experiencia_previa');
  const conExpCount = dist.entries.find(e => e.label.toLowerCase() === 'sí')?.count || 0;
  const sinExpCount = dist.entries.find(e => e.label.toLowerCase() === 'no')?.count || 0;
  const total = conExpCount + sinExpCount || 1;

  const pctCon = Math.round((conExpCount / total) * 100);
  const pctSin = 100 - pctCon;

  const labels = ['Con experiencia laboral previa', 'Sin experiencia (Primera vez)'];
  const values = [pctCon, pctSin];
  const counts = [conExpCount, sinExpCount];
  const palette = ['#07C8CC', '#CBD5E1'];

  if (legendContainer) {
    legendContainer.innerHTML = labels.map((l, i) => `
      <div class="exec-legend-row">
        <div class="exec-legend-left">
          <span class="exec-legend-dot" style="background-color: ${palette[i]};"></span>
          <span class="exec-legend-label" title="${l}">${l}</span>
        </div>
        <span class="exec-legend-val">${values[i]}% <span style="font-weight: 400; color: #94a3b8; font-size: 11px;">(${counts[i].toLocaleString()})</span></span>
      </div>
    `).join('');
  }

  activeCharts.experiencia = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: palette,
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.label}: ${values[item.dataIndex]}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      }
    },
    plugins: [{
      id: 'donutCenterExp',
      beforeDraw(chart) {
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.font = '800 20px Inter, sans-serif';
        ctx.fillStyle = '#0a1b44';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pctCon}%`, width / 2, height / 2 - 8);
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Con Exp.', width / 2, height / 2 + 10);
        ctx.restore();
      }
    }]
  });
}

// 3. Tiempo Llevado en Búsqueda Activa (Barras Verticales Cyan)
function createChartTiempo(noTrabajadores) {
  const ctx = document.getElementById('chart-notrab-tiempo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(noTrabajadores, 'tiempo_busqueda');
  const valid = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no busco') && !e.label.toLowerCase().includes('no especifica'));
  const total = valid.reduce((a, b) => a + b.count, 0) || 1;

  const labels = valid.slice(0, 5).map(e => e.label);
  const values = valid.slice(0, 5).map(e => Math.round((e.count / total) * 100));
  const counts = valid.slice(0, 5).map(e => e.count);

  activeCharts.tiempo = new Chart(ctx, {
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
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, right: 10, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: Math.max(...values, 40) + 10,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: { font: { size: 10, family: 'Inter' }, color: '#475569' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsTiempoNotrab',
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
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`${val}%`, bar.x, bar.y - 4);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 4. Factores que Dificultan Encontrar Empleo (Barras Horizontales Cyan)
function createChartFactores(noTrabajadores) {
  const ctx = document.getElementById('chart-notrab-factores');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(noTrabajadores, 'factores_dificultan');
  const valid = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
  const top = valid.slice(0, 6);
  const total = valid.reduce((a, b) => a + b.count, 0) || 1;

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

  activeCharts.factores = new Chart(ctx, {
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
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.max(...values, 40) + 10,
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
      id: 'labelsFactoresNotrab',
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
