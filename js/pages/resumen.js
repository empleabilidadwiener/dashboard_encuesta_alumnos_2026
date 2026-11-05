// js/pages/resumen.js — Resumen Ejecutivo de Empleabilidad a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional, paleta Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};

export async function loadResumenPage(container, data = [], filters = {}) {
  if (!container) return;

  // Limpiar gráficos anteriores
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
      activeCharts[key].destroy();
    }
  });
  activeCharts = {};

  const currentFilters = window.App?.filters || filters || { facultad: 'Todas', carrera: 'Todas', ciclo: 'Todos' };
  const totalMuestra = data.length || 0;

  // Trabajadores y Métricas
  const stats = Calculations.getStats(data);
  const trabajadores = Calculations.getRespuestasTrabajadores(data);
  const totalTrabajando = trabajadores.length;
  const pctTrabaja = stats.tasaEmpleabilidad;
  const pctPertinencia = stats.tasaPertinencia;
  const pctSatisfaccion = stats.tasaSatisfaccion;

  // Flexibilidad y Primera Experiencia
  const conAjuste = trabajadores.filter(d => {
    const a = (d.ajuste_horario || '').toLowerCase();
    return a === 'sí' || a === 'si' || a.includes('parcialmente');
  }).length;
  const pctAjuste = totalTrabajando > 0 ? Math.round((conAjuste / totalTrabajando) * 100) : 0;

  const con1raExp = trabajadores.filter(d => (d.primera_experiencia || '').trim().toLowerCase() === 'sí').length;
  const pct1raExp = totalTrabajando > 0 ? Math.round((con1raExp / totalTrabajando) * 100) : 0;

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
      <h1 class="exec-header-title">Encuesta de Empleabilidad a Estudiantes 2026</h1>
      <div class="exec-header-subtitle">Pregrado y Semipresencial &nbsp;|&nbsp; Resultados finales consolidados 2026</div>

      <!-- Filtros integrados idénticos a la maqueta -->
      <div class="exec-filters-bar">
        <div class="exec-filters-left">
          <div class="exec-filter-field">
            <label for="exec-sel-facultad">Facultad</label>
            <select id="exec-sel-facultad">
              <option value="Todas" ${currentFilters.facultad === 'Todas' ? 'selected' : ''}>Todas</option>
              ${facultades.map(f => `<option value="${f}" ${currentFilters.facultad === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="exec-sel-carrera">Carrera</label>
            <select id="exec-sel-carrera">
              <option value="Todas" ${currentFilters.carrera === 'Todas' ? 'selected' : ''}>Todas</option>
              ${carrerasFiltradas.map(c => `<option value="${c}" ${currentFilters.carrera === c ? 'selected' : ''}>${window.toTitleCase ? window.toTitleCase(c) : c}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="exec-sel-ciclo">Ciclo</label>
            <select id="exec-sel-ciclo">
              <option value="Todos" ${currentFilters.ciclo === 'Todos' || !currentFilters.ciclo ? 'selected' : ''}>Todos</option>
              ${ciclos.map(ci => `<option value="${ci}" ${currentFilters.ciclo == ci ? 'selected' : ''}>Ciclo ${ci}</option>`).join('')}
            </select>
          </div>

          <div class="exec-filter-field">
            <label for="exec-sel-sede">Sede</label>
            <select id="exec-sel-sede">
              <option value="Todas" ${currentFilters.sede === 'Todas' || !currentFilters.sede ? 'selected' : ''}>Todas</option>
              ${sedes.map(s => `<option value="${s}" ${currentFilters.sede === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="exec-filters-actions">
          <button class="exec-btn-clean" id="exec-btn-limpiar">Limpiar filtros</button>
          <button class="exec-btn-refresh" id="exec-btn-actualizar">Actualizar datos</button>
          <button type="button" class="btn-toggle-editor" id="exec-btn-editor" onclick="window.Editor && window.Editor.promptAuth()" title="Activar Modo Edición">
            <i class="fas fa-edit"></i> <span>Editar Textos</span>
          </button>
        </div>
      </div>

      <!-- Fila de 6 Tarjetas de Indicadores Estratégicos -->
      <div class="exec-kpis-container" id="exec-kpis-container">
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Encuestas válidas</div>
          <div class="exec-kpi-number">${totalMuestra.toLocaleString()}</div>
          <div class="exec-kpi-desc">Total de respuestas válidas de estudiantes</div>
        </div>

        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Representatividad</div>
          <div class="exec-kpi-number">30.6%</div>
          <div class="exec-kpi-desc">${totalMuestra.toLocaleString()} de 23,639 alumnos matriculados</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Nivel de Empleabilidad</div>
          <div class="exec-kpi-number">${pctTrabaja.toFixed(1)}%</div>
          <div class="exec-kpi-desc">De los estudiantes en el mercado activo (${totalTrabajando.toLocaleString()} de ${stats.totalPEA.toLocaleString()})</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Pertinencia laboral</div>
          <div class="exec-kpi-number">${Math.round(pctPertinencia)}%</div>
          <div class="exec-kpi-desc">Actividad vinculada a su carrera profesional</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Satisfacción laboral</div>
          <div class="exec-kpi-number">${Math.round(pctSatisfaccion)}%</div>
          <div class="exec-kpi-desc">Se encuentra satisfecho o muy satisfecho</div>
        </div>

        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Margen de Error Global</div>
          <div class="exec-kpi-number">±0.96%</div>
          <div class="exec-kpi-desc">Al 95% de nivel de confianza (p=q=0.5)</div>
        </div>
      </div>

      <!-- Fila Intermedia: Ciclo y Facultad -->
      <div class="exec-charts-middle">
        
        <!-- Por Ciclo -->
        <div class="exec-panel" data-visual-id="resumen-ocupacion-ciclo">
          <div class="exec-panel-title">Nivel de Empleabilidad por ciclo</div>
          <div class="exec-chart-canvas-wrap">
            <canvas id="chart-exec-ciclo"></canvas>
          </div>
        </div>

        <!-- Por Facultad -->
        <div class="exec-panel" data-visual-id="resumen-ocupacion-facultad">
          <div class="exec-panel-title">Nivel de Empleabilidad por facultad</div>
          <div class="exec-chart-canvas-wrap">
            <canvas id="chart-exec-facultad"></canvas>
          </div>
        </div>

      </div>

      <!-- Nivel de Empleabilidad por Carrera (Barras Agrupadas) -->
      <div class="exec-panel" data-visual-id="resumen-ocupacion-carrera" style="margin-bottom: 22px;">
        <div class="exec-panel-title">
          <i class="fas fa-percentage" style="color: #07C8CC; margin-right: 8px;"></i> Nivel de Empleabilidad por Carrera
        </div>
        <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Comparativo porcentual de estudiantes ocupados frente a no ocupados por programa académico</p>
        <div class="exec-chart-canvas-wrap" style="height: 600px;">
          <canvas id="chart-exec-carrera"></canvas>
        </div>
      </div>

      <!-- Fila Inferior: Situación Laboral, Ingresos y Desarrollo -->
      <div class="exec-charts-bottom">

        <!-- Situación Laboral Actual (Dona) -->
        <div class="exec-panel" data-visual-id="resumen-vinculo-laboral">
          <div class="exec-panel-title">Situación Laboral Actual</div>
          <div class="exec-donut-container">
            <div class="exec-donut-canvas-wrap" style="position: relative; width: 180px; height: 180px;">
              <canvas id="chart-exec-vinculo"></canvas>
            </div>
            <div class="exec-donut-legend" id="exec-donut-legend-vinculo"></div>
          </div>
        </div>

        <!-- Ingreso Mensual Aproximado -->
        <div class="exec-panel" data-visual-id="resumen-nivel-ingresos">
          <div class="exec-panel-title">Ingreso mensual aproximado</div>
          <div class="exec-chart-canvas-wrap" style="height: 200px;">
            <canvas id="chart-exec-ingresos"></canvas>
          </div>
          <p class="exec-section-desc" id="exec-ingresos-note" style="margin-top: 8px; font-size: 11.5px; color: #64748b;">
            Datos declarados por estudiantes con actividad remunerada.
          </p>
        </div>

        <!-- Flexibilidad y Experiencia -->
        <div class="exec-panel" data-visual-id="resumen-desarrollo-profesional">
          <div class="exec-panel-title">Flexibilidad y Experiencia</div>
          <div class="exec-desarrollo-list">
            <div class="exec-desarrollo-box">
              <div class="exec-desarrollo-label">Ajuste de horario por estudios</div>
              <div class="exec-desarrollo-data">
                <span class="exec-desarrollo-pct">${pctAjuste}%</span>
              </div>
              <div class="exec-desarrollo-sentence">${conAjuste.toLocaleString()} de ${totalTrabajando.toLocaleString()} estudiantes pueden adecuar su jornada a sus clases.</div>
            </div>

            <div class="exec-desarrollo-box">
              <div class="exec-desarrollo-label">Primera experiencia formativa / laboral</div>
              <div class="exec-desarrollo-data">
                <span class="exec-desarrollo-pct">${pct1raExp}%</span>
              </div>
              <div class="exec-desarrollo-sentence">${con1raExp.toLocaleString()} estudiantes inician su primera experiencia profesional.</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: Nivel de Empleabilidad = estudiantes con actividad dependiente, formativa/internado, independiente o negocio / total encuestados.</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Muestra de 7,233 estudiantes (cobertura del 30.6% sobre 23,639 matriculados).</p>
      </div>

    </div>
  `;

  setupFilterEvents();
  initExecCharts(data, trabajadores);
}

function setupFilterEvents() {
  const selFac = document.getElementById('exec-sel-facultad');
  const selCar = document.getElementById('exec-sel-carrera');
  const selCic = document.getElementById('exec-sel-ciclo');
  const selSed = document.getElementById('exec-sel-sede');
  const btnReset = document.getElementById('exec-btn-limpiar');
  const btnUpdate = document.getElementById('exec-btn-actualizar');

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

function initExecCharts(data, trabajadores) {
  if (typeof Chart === 'undefined') return;

  createChartCiclo(data);
  createChartFacultad(data);
  createChartCarrera(data);
  createChartVinculo(trabajadores);
  createChartIngresos(trabajadores);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

// 1. Gráfico por Ciclo (Barras Verticales Cyan con DataLabels)
function createChartCiclo(data) {
  const ctx = document.getElementById('chart-exec-ciclo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const ciclosStats = Calculations.getEmpleabilidadPorCiclo(data);
  const labels = ciclosStats.map(c => `Ciclo ${c.ciclo}`);
  const values = ciclosStats.map(c => Math.round(c.tasaEmpleabilidad));
  const counts = ciclosStats.map(c => c.trabajan);
  const totals = ciclosStats.map(c => c.pea || c.total);

  activeCharts.ciclo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        rawTotals: totals,
        backgroundColor: '#07C8CC',
        borderRadius: 2,
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
              return ` ${item.raw}% (${(c || 0).toLocaleString()} de ${(t || 0).toLocaleString()} en PEA)`;
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
          ticks: { font: { size: 10.5, family: 'Inter', weight: '500' }, color: '#475569' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'execDataLabelsCiclo',
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

// 2. Gráfico por Facultad (Barras Horizontales Cyan con DataLabels)
function createChartFacultad(data) {
  const ctx = document.getElementById('chart-exec-facultad');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const facStats = Calculations.getEmpleabilidadPorFacultad(data);
  const labels = facStats.map(f => f.facultad);
  const values = facStats.map(f => Math.round(f.tasaEmpleabilidad));
  const counts = facStats.map(f => f.trabajan);
  const totals = facStats.map(f => f.pea || f.total);

  activeCharts.facultad = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        rawTotals: totals,
        backgroundColor: '#07C8CC',
        borderRadius: 2,
        barPercentage: 0.6,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 5, right: 45, left: 0, bottom: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const c = item.dataset.rawCounts?.[item.dataIndex];
              const t = item.dataset.rawTotals?.[item.dataIndex];
              return ` ${item.raw}% (${(c || 0).toLocaleString()} de ${(t || 0).toLocaleString()} en PEA)`;
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
      id: 'execDataLabelsFacultad',
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

// 3. Gráfico por Carrera (Barras Agrupadas: % Ocupados vs % No Ocupados)
function createChartCarrera(data) {
  const ctx = document.getElementById('chart-exec-carrera');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const carrerasStats = Calculations.getEmpleabilidadPorCarrera(data);
  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(240, carrerasStats.length * 30)}px`;
  }

  const labels = carrerasStats.map(c => window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera);
  const ocupadosData = carrerasStats.map(c => Math.round(c.tasaEmpleabilidad));
  const noOcupadosData = carrerasStats.map(c => Math.max(0, 100 - Math.round(c.tasaEmpleabilidad)));

  activeCharts.carrera = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Ocupados (%)',
          data: ocupadosData,
          backgroundColor: '#07C8CC',
          borderRadius: 2,
          barPercentage: 0.8,
          categoryPercentage: 0.82
        },
        {
          label: 'No Ocupados (%)',
          data: noOcupadosData,
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
      layout: { padding: { right: 40, left: 10, top: 10, bottom: 10 } },
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
              const cant = context.datasetIndex === 0 ? c.trabajan : c.desocupados;
              return ` ${context.dataset.label}: ${Math.round(val)}% (${cant.toLocaleString()} de ${c.pea.toLocaleString()} en PEA)`;
            }
          }
        }
      }
    },
    plugins: [{
      id: 'execDataLabelsCarrera',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          if (di !== 0) return; // Solo etiquetar barra de ocupados
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

// 4. Situación Laboral Actual (Dona Limpia con 3 categorías clave)
function createChartVinculo(trabajadores) {
  const ctx = document.getElementById('chart-exec-vinculo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  let dependientes = 0;
  let formativo = 0;
  let independienteNegocio = 0;

  trabajadores.forEach(d => {
    const act = (d.actividad_principal || '').toLowerCase();
    if (act.includes('dependiente')) dependientes++;
    else if (act.includes('internado') || act.includes('formativa') || act.includes('práctica')) formativo++;
    else independienteNegocio++;
  });

  const total = trabajadores.length || 1;
  const pctDep = Math.round((dependientes / total) * 100);
  const pctForm = Math.round((formativo / total) * 100);
  const pctInd = 100 - pctDep - pctForm;

  const labels = ['Dependiente', 'Formativo / Internado', 'Independiente / Negocio'];
  const values = [pctDep, pctForm, pctInd];
  const counts = [dependientes, formativo, total - dependientes - formativo];
  const colors = ['#07C8CC', '#156082', '#0a1b44'];

  const legendEl = document.getElementById('exec-donut-legend-vinculo');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11.5px; margin-bottom: 6px;">
        <span style="display: flex; align-items: center; gap: 6px; color: #475569;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${colors[i]}; display: inline-block;"></span>
          ${l}
        </span>
        <strong style="color: #0a1b44;">${values[i]}% <span style="font-weight: 400; color: #64748b;">(${counts[i].toLocaleString()})</span></strong>
      </div>
    `).join('');
  }

  activeCharts.vinculo = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
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
      id: 'donutCenterText',
      beforeDraw(chart) {
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.font = '800 20px Inter, sans-serif';
        ctx.fillStyle = '#0a1b44';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pctDep}%`, width / 2, height / 2 - 8);
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Dependiente', width / 2, height / 2 + 10);
        ctx.restore();
      }
    }]
  });
}

// 5. Ingreso Mensual Aproximado (Barras Verticales Cyan con DataLabels)
function createChartIngresos(trabajadores) {
  const ctx = document.getElementById('chart-exec-ingresos');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'ingreso_mensual');
  const validEntries = dist.entries.filter(e => !e.label.toLowerCase().includes('no especifica') && !e.label.toLowerCase().includes('prefiero no responder'));
  const totalValidos = validEntries.reduce((a, b) => a + b.count, 0) || 1;

  const labels = validEntries.slice(0, 5).map(e => {
    return e.label.replace('Aproximadamente, ', '').replace(' mensual', '').trim();
  });
  const values = validEntries.slice(0, 5).map(e => Math.round((e.count / totalValidos) * 100));
  const counts = validEntries.slice(0, 5).map(e => e.count);

  activeCharts.ingresos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        rawCounts: counts,
        backgroundColor: '#07C8CC',
        borderRadius: 2,
        barPercentage: 0.6,
        categoryPercentage: 0.8
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
            label: (item) => ` ${item.raw}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: Math.max(...values, 40) + 10,
          ticks: { stepSize: 10, callback: (v) => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: { font: { size: 10.5, family: 'Inter', weight: '500' }, color: '#475569' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'execDataLabelsIngresos',
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
