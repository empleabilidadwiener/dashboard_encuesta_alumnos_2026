// js/pages/empleabilidad.js — Perfil de Estudiantes que Trabajan
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};

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

      <!-- Fila Intermedia: Vinculación Contractual y Modalidad de Trabajo -->
      <div class="exec-charts-middle">
        
        <!-- Vinculación Contractual -->
        <div class="exec-panel" data-visual-id="emp-vinculacion-contractual">
          <div class="exec-panel-title">Régimen y Modalidad de Vinculación</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Distribución de la formalidad contractual entre estudiantes trabajadores</p>
          <div class="exec-chart-canvas-wrap" style="height: 250px;">
            <canvas id="chart-emp-vinculacion"></canvas>
          </div>
        </div>

        <!-- Modalidad de Trabajo (Dona 3 slices) -->
        <div class="exec-panel" data-visual-id="emp-modalidad-trabajo">
          <div class="exec-panel-title">Modalidad de Trabajo</div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Entorno de ejecución de la jornada laboral o formativa</p>
          <div class="exec-donut-container" style="min-height: 250px;">
            <div class="exec-donut-canvas-wrap" style="position: relative; width: 170px; height: 170px;">
              <canvas id="chart-emp-modalidad"></canvas>
            </div>
            <div class="exec-donut-legend" id="exec-donut-legend-modalidad"></div>
          </div>
        </div>

      </div>

      <!-- Fila Inferior: Pertinencia, Ingresos y Proyección -->
      <div class="exec-charts-bottom">
        
        <!-- Pertinencia con la Carrera -->
        <div class="exec-panel" data-visual-id="emp-pertinencia-detalle">
          <div class="exec-panel-title">Nivel de Pertinencia con la Carrera</div>
          <div class="exec-chart-canvas-wrap" style="height: 220px;">
            <canvas id="chart-emp-pertinencia"></canvas>
          </div>
        </div>

        <!-- Ingreso Mensual -->
        <div class="exec-panel" data-visual-id="emp-ingresos-detalle">
          <div class="exec-panel-title">Distribución de Ingresos Mensuales</div>
          <div class="exec-chart-canvas-wrap" style="height: 220px;">
            <canvas id="chart-emp-ingresos"></canvas>
          </div>
        </div>

        <!-- Proyección 12 Meses -->
        <div class="exec-panel" data-visual-id="emp-planes-futuros">
          <div class="exec-panel-title">Planes Laborales (Próximos 12 Meses)</div>
          <div class="exec-chart-canvas-wrap" style="height: 220px;">
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

  setupFilterEvents();
  initEmpleabilidadCharts(trabajadores);
}

function setupFilterEvents() {
  const selFac = document.getElementById('emp-sel-facultad');
  const selCar = document.getElementById('emp-sel-carrera');
  const selCic = document.getElementById('emp-sel-ciclo');
  const selSed = document.getElementById('emp-sel-sede');
  const btnReset = document.getElementById('emp-btn-limpiar');
  const btnUpdate = document.getElementById('emp-btn-actualizar');

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

function initEmpleabilidadCharts(trabajadores = []) {
  if (typeof Chart === 'undefined' || trabajadores.length === 0) return;

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

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 34) l = l.slice(0, 32) + '…';
    return l;
  });
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

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
      layout: { padding: { right: 40, left: 0, top: 5, bottom: 5 } },
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
          ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#334155' },
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

// 3. Nivel de Pertinencia (Barras Horizontales Cyan)
function createChartPertinencia(trabajadores) {
  const ctx = document.getElementById('chart-emp-pertinencia');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'pertinencia_carrera');
  const valid = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica') && e.label !== '#N/A');
  const total = valid.reduce((a, b) => a + b.count, 0) || 1;

  const labels = valid.map(e => e.label);
  const values = valid.map(e => Math.round((e.count / total) * 100));
  const counts = valid.map(e => e.count);

  activeCharts.pertinencia = new Chart(ctx, {
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
      layout: { padding: { right: 35, left: 0 } },
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
            ctx.fillText(`${val}%`, bar.x + 5, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

// 4. Distribución de Ingresos (Barras Verticales Cyan)
function createChartIngresos(trabajadores) {
  const ctx = document.getElementById('chart-emp-ingresos');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'ingreso_mensual');
  const valid = dist.entries.filter(e => !e.label.toLowerCase().includes('prefiero no responder') && !e.label.toLowerCase().includes('no especifica'));
  const top = valid.slice(0, 5);
  const total = valid.reduce((a, b) => a + b.count, 0) || 1;

  const labels = top.map(e => e.label.replace('Aproximadamente, ', '').replace(' mensual', '').trim());
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

  activeCharts.ingresos = new Chart(ctx, {
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
      id: 'labelsIngresosEmp',
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

// 5. Proyección Laboral a 12 Meses (Barras Horizontales Cyan)
function createChartPlanes(trabajadores) {
  const ctx = document.getElementById('chart-emp-planes');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'plan_12_meses_trabaja');
  const top = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica')).slice(0, 4);
  const total = top.reduce((a, b) => a + b.count, 0) || 1;

  const labels = top.map(e => {
    let l = e.label;
    if (l.length > 30) l = l.slice(0, 28) + '…';
    return l;
  });
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

  activeCharts.planes = new Chart(ctx, {
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
      layout: { padding: { right: 35, left: 0 } },
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
      id: 'labelsPlanes',
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
            ctx.fillText(`${val}%`, bar.x + 5, bar.y);
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
  const valid = dist.entries.filter(e => e.label && !e.label.toLowerCase().includes('no especifica'));
  const top = valid.slice(0, 8);
  const total = trabajadores.length || 1;

  const labels = top.map(e => e.label);
  const values = top.map(e => Math.round((e.count / total) * 100));
  const counts = top.map(e => e.count);

  activeCharts.sectores = new Chart(ctx, {
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
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: Math.max(...values, 30) + 10,
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
