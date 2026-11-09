// js/pages/empleabilidad.js — Perfil de Estudiantes que Trabajan
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};
let soloEmpCarrerasRemunRep = true;

export async function loadEmpleabilidadPage(container, data = [], filters = {}) {
  if (!container) return;

  // Limpiar gráficos previos
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
      activeCharts[key].destroy();
    }
  });
  activeCharts = {};

  const currentFilters = window.App?.filters || filters || { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos', sede: 'Todas' };
  const stats = Calculations.getStats(data);
  const trabajadores = Calculations.getRespuestasTrabajadores(data);
  const totalTrabajadores = trabajadores.length;
  const totalMuestra = data.length || 1;
  const pctSobreMuestra = stats.tasaOcupacionTotal.toFixed(1);
  const pctPEA = stats.tasaEmpleabilidad.toFixed(1);

  // 1. Pertinencia
  const conPert = trabajadores.filter(d => d.pertinencia_carrera && d.pertinencia_carrera !== '#N/A');
  const rel = conPert.filter(d => {
    const p = (d.pertinencia_carrera || '').toLowerCase();
    return p.includes('totalmente') || p.includes('parcialmente');
  }).length;
  const pctPertinencia = conPert.length > 0 ? (rel / conPert.length * 100).toFixed(1) : 0;

  // 2. Ajuste horario académico
  const conAjuste = trabajadores.filter(d => {
    const a = (d.ajuste_horario || '').toLowerCase();
    return a === 'sí' || a === 'si' || a.includes('parcialmente');
  }).length;
  const pctAjuste = totalTrabajadores > 0 ? (conAjuste / totalTrabajadores * 100).toFixed(1) : 0;

  // 3. Satisfacción
  const conSatValidos = trabajadores.filter(d => d.satisfaccion_actividad && d.satisfaccion_actividad !== '#N/A');
  const satPositiva = conSatValidos.filter(d => {
    const s = (d.satisfaccion_actividad || '').trim().toLowerCase();
    return s === 'satisfecho' || s === 'muy satisfecho';
  }).length;
  const pctSatisfaccion = conSatValidos.length > 0 ? (satPositiva / conSatValidos.length * 100).toFixed(1) : 0;

  // 4. Primera experiencia
  const con1raExp = trabajadores.filter(d => (d.primera_experiencia || '').trim().toLowerCase() === 'sí').length;
  const pct1raExp = totalTrabajadores > 0 ? (con1raExp / totalTrabajadores * 100).toFixed(1) : 0;

  // 5. Modalidad presencial
  const conPresencial = trabajadores.filter(d => (d.modalidad_trabajo || '').toLowerCase().includes('presencial')).length;
  const pctPresencial = totalTrabajadores > 0 ? (conPresencial / totalTrabajadores * 100).toFixed(1) : 0;

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
      <h1 class="exec-header-title">Perfil de Estudiantes que Trabajan</h1>
      <div class="exec-header-subtitle">Condiciones laborales, régimen contractual, pertinencia formativa y proyección profesional</div>

      <!-- Filtros integrados institucionales -->
      <div class="exec-filters-bar">
        <div class="exec-filters-left">
          <div class="exec-filter-field">
            <label for="emp-sel-facultad">Facultad</label>
            <select id="emp-sel-facultad">
              <option value="Todas" ${currentFilters.facultad === 'Todas' ? 'selected' : ''}>Todas</option>
              ${facultades.map(f => `<option value="${f}" ${currentFilters.facultad === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="emp-sel-carrera">Carrera</label>
            <select id="emp-sel-carrera">
              <option value="Todas" ${currentFilters.carrera === 'Todas' ? 'selected' : ''}>Todas</option>
              ${carrerasFiltradas.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="emp-sel-ciclo">Ciclo</label>
            <select id="emp-sel-ciclo">
              <option value="Todos" ${currentFilters.ciclo === 'Todos' || !currentFilters.ciclo ? 'selected' : ''}>Todos</option>
              ${ciclos.map(ci => `<option value="${ci}" ${currentFilters.ciclo == ci ? 'selected' : ''}>Ciclo ${ci}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="emp-sel-sede">Sede</label>
            <select id="emp-sel-sede">
              <option value="Todas" ${currentFilters.sede === 'Todas' || !currentFilters.sede ? 'selected' : ''}>Todas</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="exec-filters-actions">
          <button class="exec-btn-clean" id="emp-btn-limpiar">Limpiar filtros</button>
          <button class="exec-btn-refresh" id="emp-btn-actualizar">Actualizar datos</button>
          <button type="button" class="btn-toggle-editor" id="emp-btn-editor" onclick="window.Editor && window.Editor.promptAuth()" title="Activar Modo Edición">
            <i class="fas fa-edit"></i> <span>Editar Textos</span>
          </button>
        </div>
      </div>

      <!-- Fila de 6 Tarjetas de Indicadores Estratégicos -->
      <div class="exec-kpis-container">
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Estudiantes Ocupados</div>
          <div class="exec-kpi-number">${totalTrabajadores.toLocaleString()}</div>
          <div class="exec-kpi-desc">${pctPEA}% de la PEA (${pctSobreMuestra}% de la muestra total)</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Pertinencia con Carrera</div>
          <div class="exec-kpi-number">${Math.round(pctPertinencia)}%</div>
          <div class="exec-kpi-desc">${rel.toLocaleString()} actividades con afinidad profesional</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Flexibilidad Horaria</div>
          <div class="exec-kpi-number">${Math.round(pctAjuste)}%</div>
          <div class="exec-kpi-desc">${conAjuste.toLocaleString()} pueden adecuar horario a clases</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Satisfacción Laboral</div>
          <div class="exec-kpi-number">${Math.round(pctSatisfaccion)}%</div>
          <div class="exec-kpi-desc">${satPositiva.toLocaleString()} satisfechos con su actividad</div>
        </div>

        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Primera Experiencia</div>
          <div class="exec-kpi-number">${Math.round(pct1raExp)}%</div>
          <div class="exec-kpi-desc">${con1raExp.toLocaleString()} inician su trayectoria laboral</div>
        </div>

        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Modalidad Presencial</div>
          <div class="exec-kpi-number">${Math.round(pctPresencial)}%</div>
          <div class="exec-kpi-desc">${conPresencial.toLocaleString()} laboran en centros físicos</div>
        </div>
      </div>

      <!-- Fila: Actividad Remunerada por Ciclo y Facultad -->
      <div class="exec-charts-middle">
        
        <!-- Actividad Remunerada por Ciclo -->
        <div class="exec-panel" data-visual-id="emp-remunerada-ciclo">
          <div class="exec-panel-title">Actividad Remunerada por ciclo</div>
          <p class="exec-section-desc" style="margin: -6px 0 10px 0;">% de estudiantes ocupados (Empleabilidad Final = Sí) que perciben remuneración</p>
          <div class="exec-chart-canvas-wrap" style="height: 260px;">
            <canvas id="chart-emp-remun-ciclo"></canvas>
          </div>
        </div>

        <!-- Actividad Remunerada por Facultad -->
        <div class="exec-panel" data-visual-id="emp-remunerada-facultad">
          <div class="exec-panel-title">Actividad Remunerada por facultad</div>
          <p class="exec-section-desc" style="margin: -6px 0 10px 0;">% de estudiantes ocupados con actividad remunerada según facultad</p>
          <div class="exec-chart-canvas-wrap" style="height: 260px;">
            <canvas id="chart-emp-remun-facultad"></canvas>
          </div>
        </div>

      </div>

      <!-- Panel Completo: Actividad Remunerada por Carrera -->
      <div class="exec-panel" data-visual-id="emp-remunerada-carrera" style="margin-bottom: 22px;">
        <div class="exec-panel-title">
          <i class="fas fa-hand-holding-usd" style="color: #07C8CC; margin-right: 8px;"></i> Actividad Remunerada por Carrera
        </div>
        <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Comparativo porcentual entre Actividad Remunerada y Sin Remuneración / Formativa sobre el total de estudiantes ocupados (Empleabilidad Final)</p>
        <div class="exec-chart-canvas-wrap" style="height: 480px;">
          <canvas id="chart-emp-remun-carrera"></canvas>
        </div>
        <div id="emp-remun-carreras-alert-container"></div>
      </div>

      <!-- Fila Intermedia: Vinculación Contractual y Modalidad de Trabajo -->
      <div class="exec-charts-middle" style="grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);">
        
        <!-- Vinculación Contractual -->
        <div class="exec-panel" data-visual-id="emp-vinculacion-contractual">
          <div class="exec-panel-title">Régimen y Modalidad de Vinculación</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Distribución de la formalidad contractual entre estudiantes trabajadores</p>
          <div class="exec-chart-canvas-wrap" style="height: 310px;">
            <canvas id="chart-emp-vinculacion"></canvas>
          </div>
        </div>

        <!-- Modalidad de Trabajo (Dona 3 slices) -->
        <div class="exec-panel" data-visual-id="emp-modalidad-trabajo">
          <div class="exec-panel-title">Modalidad de Trabajo</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Entorno de ejecución de la jornada laboral o formativa</p>
          <div class="exec-donut-container" style="min-height: 310px;">
            <div class="exec-donut-canvas-wrap" style="position: relative; width: 170px; height: 170px;">
              <canvas id="chart-emp-modalidad"></canvas>
            </div>
            <div class="exec-donut-legend" id="exec-donut-legend-modalidad"></div>
          </div>
        </div>

      </div>

      <!-- Panel Completo: Distribución de Ingresos Mensuales -->
      <div class="exec-panel" data-visual-id="emp-ingresos-detalle" style="margin-bottom: 22px;">
        <div class="exec-panel-title">
          <i class="fas fa-money-bill-wave" style="color: #07C8CC; margin-right: 8px;"></i> Distribución de Ingresos Mensuales
        </div>
        <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Escalas de remuneración mensual percibida por estudiantes con actividad remunerada</p>
        <div class="exec-chart-canvas-wrap" style="height: 270px;">
          <canvas id="chart-emp-ingresos"></canvas>
        </div>
      </div>

      <!-- Fila: Pertinencia y Proyección a 12 Meses -->
      <div class="exec-charts-middle" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr); margin-bottom: 22px;">
        
        <!-- Pertinencia con la Carrera -->
        <div class="exec-panel" data-visual-id="emp-pertinencia-detalle">
          <div class="exec-panel-title">Nivel de Pertinencia con la Carrera</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Grado de relación entre la ocupación actual y su formación profesional</p>
          <div class="exec-chart-canvas-wrap" style="height: 290px;">
            <canvas id="chart-emp-pertinencia"></canvas>
          </div>
        </div>

        <!-- Proyección 12 Meses -->
        <div class="exec-panel" data-visual-id="emp-planes-futuros">
          <div class="exec-panel-title">Planes Laborales (Próximos 12 Meses)</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Proyección y metas laborales de los estudiantes ocupados</p>
          <div class="exec-chart-canvas-wrap" style="height: 310px;">
            <canvas id="chart-emp-planes"></canvas>
          </div>
        </div>

      </div>

      <!-- Fila Completa: Principales Sectores Económicos y Empresas -->
      <div class="exec-panel" data-visual-id="emp-sectores-economicos" style="margin-bottom: 22px;">
        <div class="exec-panel-title">Principales Sectores Económicos de Desempeño</div>
        <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Concentración sectorial de la actividad laboral o formativa de los estudiantes</p>
        <div class="exec-chart-canvas-wrap" style="height: 300px;">
          <canvas id="chart-emp-sectores"></canvas>
        </div>
      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: El módulo de Estudiantes que Trabajan comprende a encuestados con actividad remunerada dependiente, internados clínicos, servicios independientes o negocios formales e informales.</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Submuestra de 4,400 estudiantes ocupados.</p>
      </div>

    </div>
  `;

  setupFilterEvents(data);
  initEmpleabilidadCharts(trabajadores, data);
}

function setupFilterEvents(baseData = []) {
  const selFac = document.getElementById('emp-sel-facultad');
  const selCar = document.getElementById('emp-sel-carrera');
  const selCic = document.getElementById('emp-sel-ciclo');
  const selSed = document.getElementById('emp-sel-sede');
  const btnReset = document.getElementById('emp-btn-limpiar');
  const btnUpdate = document.getElementById('emp-btn-actualizar');
  const btnRemunRep = document.getElementById('btn-emp-remun-carreras-rep');
  const btnRemunTodas = document.getElementById('btn-emp-remun-carreras-todas');

  btnRemunRep?.addEventListener('click', () => {
    if (soloEmpCarrerasRemunRep) return;
    soloEmpCarrerasRemunRep = true;
    btnRemunRep.classList.add('active');
    btnRemunTodas?.classList.remove('active');
    createChartEmpRemunCarrera(baseData);
  });

  btnRemunTodas?.addEventListener('click', () => {
    if (!soloEmpCarrerasRemunRep) return;
    soloEmpCarrerasRemunRep = false;
    btnRemunTodas.classList.add('active');
    btnRemunRep?.classList.remove('active');
    createChartEmpRemunCarrera(baseData);
  });

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

function initEmpleabilidadCharts(trabajadores = [], data = []) {
  if (typeof Chart === 'undefined' || trabajadores.length === 0) return;

  const baseData = data.length > 0 ? data : trabajadores;
  createChartEmpRemunCiclo(baseData);
  createChartEmpRemunFacultad(baseData);
  createChartEmpRemunCarrera(baseData);
  createChartVinculacion(trabajadores);
  createChartModalidad(trabajadores);
  createChartPertinencia(trabajadores);
  createChartIngresos(trabajadores);
  createChartPlanes(trabajadores);
  createChartSectores(trabajadores);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

// 1. Régimen y Vinculación Contractual (Barras Horizontales Cyan)
function createChartVinculacion(trabajadores) {
  const ctx = document.getElementById('chart-emp-vinculacion');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'modalidad_vinculacion');
  const validEntries = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
  const top = validEntries.slice(0, 5);
  const total = trabajadores.length || 1;

  const maxChars = typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 34;
  const labels = top.map(e => Calculations.wrapLabel(e.label, maxChars));
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);
  const maxVal = Math.max(...values, 5);
  const xMax = Math.ceil((maxVal + 3) / 2) * 2;

  activeCharts.vinculacion = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.7,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 65, left: 10, top: 5, bottom: 5 } },
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
          max: xMax,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 10.5, family: 'Inter', weight: '500' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'execLabelsVinculacion',
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

// 2. Modalidad de Trabajo (Dona 3 colores Wiener con porcentaje al centro)
function createChartModalidad(trabajadores) {
  const ctx = document.getElementById('chart-emp-modalidad');
  const legendContainer = document.getElementById('exec-donut-legend-modalidad');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'modalidad_trabajo');
  const top = dist.entries.slice(0, 3);
  const total = trabajadores.length || 1;

  const labels = top.map(e => e.label || 'Presencial');
  const counts = top.map(e => e.count);
  const values = top.map(e => Math.round((e.count / total) * 100));

  // Solo paleta institucional de 3 colores
  const palette = ['#07C8CC', '#156082', '#0a1b44'];

  const pctPresencial = values[0] || 0;

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

  activeCharts.modalidad = new Chart(ctx, {
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
      id: 'donutCenterModalidad',
      beforeDraw(chart) {
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.font = '800 20px Inter, sans-serif';
        ctx.fillStyle = '#0a1b44';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pctPresencial}%`, width / 2, height / 2 - 8);
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Presencial', width / 2, height / 2 + 10);
        ctx.restore();
      }
    }]
  });
}

// 3. Nivel de Pertinencia (Barras Horizontales Cyan — Orden Escalar Likert)
function createChartPertinencia(trabajadores) {
  const ctx = document.getElementById('chart-emp-pertinencia');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const ORDEN_PERTINENCIA = [
    'Totalmente relacionada',
    'Parcialmente relacionada',
    'No está relacionada'
  ];

  const dist = Calculations.countDistribution(trabajadores, 'pertinencia_carrera');
  const countMap = {};
  ORDEN_PERTINENCIA.forEach(k => { countMap[k] = 0; });
  dist.entries.forEach(e => {
    const clean = (e.label || '').trim();
    if (!clean || clean.toLowerCase().includes('no especifica') || clean === '#N/A') return;
    countMap[clean] = (countMap[clean] || 0) + e.count;
  });

  const ordered = ORDEN_PERTINENCIA.map(label => ({
    label,
    count: countMap[label] || 0
  }));
  const total = ordered.reduce((a, b) => a + b.count, 0) || 1;

  const labels = ordered.map(e => e.label);
  const values = ordered.map(e => Math.round((e.count / total) * 100));
  const counts = ordered.map(e => e.count);
  const maxVal = Math.max(...values, 30);
  const xMax = Math.min(100, Math.ceil((maxVal + 10) / 10) * 10);

  activeCharts.pertinencia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.65,
        categoryPercentage: 0.82
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 65, left: 4 } },
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
      id: 'labelsPertinencia',
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

// 4. Distribución de Ingresos (Barras Verticales Cyan — Todas las escalas salariales)
function createChartIngresos(trabajadores) {
  const ctx = document.getElementById('chart-emp-ingresos');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const RANGOS_INGRESO = [
    'Menos de S/ 500',
    'De S/ 500 a S/ 999',
    'De S/ 1,000 a S/ 1,499',
    'De S/ 1,500 a S/ 1,999',
    'De S/ 2,000 a S/ 2,999',
    'De S/ 3,000 a S/ 3,999',
    'De S/ 4,000 a S/ 5,999',
    'S/ 6,000 o más'
  ];

  const dist = Calculations.countDistribution(trabajadores, 'ingreso_mensual');
  const countMap = {};
  RANGOS_INGRESO.forEach(r => { countMap[r] = 0; });
  dist.entries.forEach(e => {
    const clean = (e.label || '').replace('Aproximadamente, ', '').replace(' mensual', '').trim();
    const low = clean.toLowerCase();
    if (!clean || low.includes('no especifica') || low.includes('prefiero no responder') || low.includes('no recibo ingresos')) return;
    countMap[clean] = (countMap[clean] || 0) + e.count;
  });

  const allEntries = RANGOS_INGRESO.map(label => ({
    label,
    count: countMap[label] || 0
  }));

  const total = allEntries.reduce((a, b) => a + b.count, 0) || 1;

  const formatTwoLines = (lbl) => {
    if (lbl.startsWith('De ') && lbl.includes(' a ')) {
      const parts = lbl.split(' a ');
      return [parts[0], `a ${parts[1]}`];
    }
    if (lbl === 'Menos de S/ 500') return ['Menos de', 'S/ 500'];
    if (lbl === 'S/ 6,000 o más') return ['S/ 6,000', 'o más'];
    return lbl;
  };

  const fullLabels = allEntries.map(e => e.label);
  const labels = allEntries.map(e => formatTwoLines(e.label));
  const exactPcts = allEntries.map(e => (e.count / total) * 100);
  const values = exactPcts.map(p => Math.round(p * 10) / 10);
  const counts = allEntries.map(e => e.count);

  const formatPctLabel = (val, count) => {
    if (!count || val <= 0) return '0%';
    const rounded = Math.round(val);
    if (rounded === 0) return `${val.toFixed(1)}%`;
    return `${rounded}%`;
  };

  activeCharts.ingresos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        fullLabels,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.65,
        categoryPercentage: 0.84
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 22, right: 10, left: 4, bottom: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => fullLabels[items[0].dataIndex] || '',
            label: (item) => {
              const c = counts[item.dataIndex] || 0;
              const v = values[item.dataIndex] || 0;
              return ` ${formatPctLabel(v, c)} (${c.toLocaleString()} de ${total.toLocaleString()} remunerados)`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: Math.ceil((Math.max(...values, 35) + 8) / 10) * 10,
          ticks: { stepSize: 10, callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
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
      id: 'labelsIngresosEmp',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            const c = counts[i] || 0;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(formatPctLabel(Number(val), c), bar.x, bar.y - 4);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 5. Proyección Laboral a 12 Meses (Barras Horizontales Cyan)
function createChartPlanes(trabajadores) {
  const ctx = document.getElementById('chart-emp-planes');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'plan_12_meses_trabaja');
  const top = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
  const total = top.reduce((a, b) => a + b.count, 0) || 1;

  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(290, top.length * 36)}px`;
  }

  const maxChars = typeof window !== 'undefined' && window.innerWidth < 768 ? 26 : 36;
  const labels = top.map(e => Calculations.wrapLabel(e.label, maxChars));
  const exactPcts = top.map(e => (e.count / total) * 100);
  const values = exactPcts.map(p => Math.round(p * 10) / 10);
  const counts = top.map(e => e.count);

  const formatPctLabel = (val, count) => {
    if (!count || val <= 0) return '0%';
    const rounded = Math.round(val);
    if (rounded === 0) return `${val.toFixed(1)}%`;
    return `${rounded}%`;
  };

  activeCharts.planes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.72
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 65, left: 6 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${formatPctLabel(values[item.dataIndex], counts[item.dataIndex])} (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.ceil((Math.max(...values, 30) + 6) / 5) * 5,
          ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 10.5, family: 'Inter', weight: '500' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsPlanes',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            const c = counts[i] || 0;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${formatPctLabel(Number(val), c)} (${c.toLocaleString()})`, bar.x + 5, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 6. Principales Sectores Económicos (Barras Horizontales Cyan)
function createChartSectores(trabajadores) {
  const ctx = document.getElementById('chart-emp-sectores');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'sector_economico');
  const top = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
  const total = trabajadores.length || 1;

  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(300, top.length * 30)}px`;
  }

  const labels = top.map(e => e.label);
  const exactPcts = top.map(e => (e.count / total) * 100);
  const values = exactPcts.map(p => Math.round(p * 10) / 10);
  const counts = top.map(e => e.count);

  const formatPctLabel = (val, count) => {
    if (!count || val <= 0) return '0%';
    const rounded = Math.round(val);
    if (rounded === 0) return `${val.toFixed(1)}%`;
    return `${rounded}%`;
  };

  activeCharts.sectores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.68
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 65, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${formatPctLabel(values[item.dataIndex], counts[item.dataIndex])} (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.ceil((Math.max(...values, 30) + 8) / 10) * 10,
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
      id: 'labelsSectores',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            const c = counts[i] || 0;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${formatPctLabel(Number(val), c)} (${c.toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 7. Actividad Remunerada por Ciclo (Barras Verticales)
function createChartEmpRemunCiclo(data) {
  const ctx = document.getElementById('chart-emp-remun-ciclo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const ciclosStats = Calculations.getActividadRemuneradaPorCiclo(data);
  const labels = ciclosStats.map(c => `Ciclo ${c.ciclo}`);
  const values = ciclosStats.map(c => Math.round(c.tasaRemuneradaOcupados));
  const counts = ciclosStats.map(c => c.remunerados);
  const totals = ciclosStats.map(c => c.ocupados);

  activeCharts.remunCiclo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        rawTotals: totals,
        backgroundColor: '#156082',
        borderRadius: 3,
        barPercentage: 0.65,
        categoryPercentage: 0.85
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, right: 10, left: 0, bottom: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const c = item.dataset.rawCounts?.[item.dataIndex];
              const t = item.dataset.rawTotals?.[item.dataIndex];
              return ` ${item.raw}% con actividad remunerada (${(c || 0).toLocaleString()} de ${(t || 0).toLocaleString()} ocupados)`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, callback: (v) => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: { autoSkip: false, maxRotation: 45, minRotation: 0, font: { size: 10, family: 'Inter', weight: '500' }, color: '#475569' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'empDataLabelsRemunCiclo',
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
            ctx.fillText(`${Math.round(Number(val))}%`, bar.x, bar.y - 4);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 8. Actividad Remunerada por Facultad (Barras Horizontales)
function createChartEmpRemunFacultad(data) {
  const ctx = document.getElementById('chart-emp-remun-facultad');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const facStats = Calculations.getActividadRemuneradaPorFacultad(data);
  const labels = facStats.map(f => f.facultad);
  const values = facStats.map(f => Math.round(f.tasaRemuneradaOcupados));
  const counts = facStats.map(f => f.remunerados);
  const totals = facStats.map(f => f.ocupados);

  activeCharts.remunFacultad = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        rawTotals: totals,
        backgroundColor: '#156082',
        borderRadius: 3,
        barPercentage: 0.6,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 5, right: 50, left: 5, bottom: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const c = item.dataset.rawCounts?.[item.dataIndex];
              const t = item.dataset.rawTotals?.[item.dataIndex];
              return ` ${item.raw}% con actividad remunerada (${(c || 0).toLocaleString()} de ${(t || 0).toLocaleString()} ocupados)`;
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, callback: (v) => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'empDataLabelsRemunFacultad',
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
            ctx.fillText(`${Math.round(Number(val))}%`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 9. Actividad Remunerada por Carrera (Barras Agrupadas)
function createChartEmpRemunCarrera(data) {
  const ctx = document.getElementById('chart-emp-remun-carrera');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const MIN_PEA_CARRERA = 15;
  const todasCarreras = Calculations.getActividadRemuneradaPorCarrera(data);
  const carrerasStats = soloEmpCarrerasRemunRep
    ? todasCarreras.filter(c => c.pea >= MIN_PEA_CARRERA)
    : todasCarreras;
  const carrerasExcluidas = todasCarreras.filter(c => c.pea < MIN_PEA_CARRERA);

  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(260, carrerasStats.length * 30)}px`;
  }

  const labels = carrerasStats.map(c => {
    const isMinima = c.pea < MIN_PEA_CARRERA;
    const baseName = window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera;
    return isMinima ? `${baseName} *` : baseName;
  });

  const remuneradaData = carrerasStats.map(c => Math.round(c.tasaRemuneradaOcupados));
  const noRemuneradaData = carrerasStats.map(c => Math.max(0, 100 - Math.round(c.tasaRemuneradaOcupados)));

  const alertContainer = document.getElementById('emp-remun-carreras-alert-container');
  if (alertContainer) {
    if (carrerasExcluidas.length > 0) {
      alertContainer.innerHTML = `
        <div class="exec-sample-alert-box">
          <div class="exec-sample-alert-header">
            <i class="fas fa-exclamation-triangle" style="color: #F59E0B;"></i>
            <span>${soloEmpCarrerasRemunRep 
              ? 'Programas con muestra mínima no representativa (excluidos del ranking principal de actividad remunerada):' 
              : 'Advertencia metodológica sobre programas con muestra mínima (*):'}</span>
          </div>
          <div class="exec-sample-alert-list">
            ${carrerasExcluidas.map(c => `
              <span class="exec-sample-pill">
                <strong>${window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera}*:</strong> 
                ${Math.round(c.tasaRemuneradaOcupados)}% remunerada (${c.remunerados} de ${c.ocupados} ocupados, PEA=${c.pea})
              </span>
            `).join('')}
          </div>
          <p class="exec-sample-alert-note">
            ${soloEmpCarrerasRemunRep
              ? '* Estos programas registran muestras reducidas (PEA < 15), por lo que se presentan por separado para mantener la consistencia estadística del indicador.'
              : '* Los programas marcados con asterisco (*) cuentan con muestras reducidas (PEA < 15) y deben interpretarse de forma referencial.'}
          </p>
        </div>
      `;
    } else {
      alertContainer.innerHTML = '';
    }
  }

  activeCharts.remunCarrera = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Con Actividad Remunerada (%)',
          data: remuneradaData,
          backgroundColor: '#156082',
          borderRadius: 2,
          barPercentage: 0.8,
          categoryPercentage: 0.82
        },
        {
          label: 'Sin Remuneración / Formativa (%)',
          data: noRemuneradaData,
          backgroundColor: '#D1D5DB',
          borderRadius: 2,
          barPercentage: 0.8,
          categoryPercentage: 0.82
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 52, left: 10, top: 10, bottom: 10 } },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, callback: (v) => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        y: {
          ticks: {
            font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
            color: '#0a1b44'
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { font: { family: "'Inter', sans-serif", size: 12 }, usePointStyle: true, boxWidth: 8 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const idx = context.dataIndex;
              const c = carrerasStats[idx];
              const val = context.parsed.x;
              const cant = context.datasetIndex === 0 ? c.remunerados : c.sinRemuneracionOFormativa;
              const aviso = c.pea < MIN_PEA_CARRERA ? ' — *Muestra mínima no representativa' : '';
              return ` ${context.dataset.label}: ${Math.round(val)}% (${cant.toLocaleString()} de ${c.ocupados.toLocaleString()} ocupados)${aviso}`;
            }
          }
        }
      }
    },
    plugins: [{
      id: 'empDataLabelsRemunCarrera',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((bar, i) => {
            const val = ds.data[i];
            if (val == null) return;
            ctx.save();
            ctx.font = 'bold 10.5px Inter, sans-serif';
            ctx.fillStyle = '#0a1b44';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round(Number(val))}%`, bar.x + 5, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}
