// js/pages/representatividad.js — Ficha Técnica y Representatividad Muestral
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};

export async function loadRepresentatividadPage(container) {
  if (!container) return;

  // Limpiar gráficos previos
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
      activeCharts[key].destroy();
    }
  });
  activeCharts = {};

  const universoData = DataLoader.getUniverso();

  // Segmentar por tipo_desglose
  const sedes = universoData.filter(d => d.tipo_desglose === 'Sede');
  const carreras = universoData.filter(d => d.tipo_desglose === 'Carrera');
  const ciclos = universoData.filter(d => d.tipo_desglose === 'Ciclo');

  const totalUniverso = 23639;
  const totalMuestra = 7233;
  const representatividadGlobal = 30.6;
  const margenErrorGlobal = Calculations.margenErrorFinito(totalMuestra, totalUniverso);

  container.innerHTML = `
    <div class="resumen-ejecutivo-wrapper">
      
      <!-- Barra superior institucional -->
      <div class="exec-top-bar">
        <span class="exec-institution">Universidad Norbert Wiener</span>
        <span class="exec-date">Ficha Metodológica &nbsp;&nbsp;&nbsp;&nbsp; Edición 2026</span>
      </div>

      <!-- Título principal y subtítulo directivo -->
      <h1 class="exec-header-title">Ficha Técnica y Representatividad Muestral</h1>
      <div class="exec-header-subtitle">Población total de alumnos matriculados, muestra efectiva levantada y márgenes de error estadístico (Cochran)</div>

      <!-- Fila de 4 Tarjetas de Indicadores Estratégicos -->
      <div class="exec-kpis-container" style="grid-template-columns: repeat(4, 1fr);">
        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Universo Oficial</div>
          <div class="exec-kpi-number">${totalUniverso.toLocaleString()}</div>
          <div class="exec-kpi-desc">Alumnos matriculados activos</div>
        </div>

        <div class="exec-kpi-box kpi-tint-white">
          <div class="exec-kpi-title">Muestra Efectiva</div>
          <div class="exec-kpi-number">${totalMuestra.toLocaleString()}</div>
          <div class="exec-kpi-desc">Cuestionarios completos validados</div>
        </div>

        <div class="exec-kpi-box kpi-tint-wiener">
          <div class="exec-kpi-title">Representatividad Global</div>
          <div class="exec-kpi-number">${representatividadGlobal}%</div>
          <div class="exec-kpi-desc">1 de cada 3 alumnos encuestados</div>
        </div>

        <div class="exec-kpi-box kpi-tint-green">
          <div class="exec-kpi-title">Margen de Error Global</div>
          <div class="exec-kpi-number">±${margenErrorGlobal.toFixed(2)}%</div>
          <div class="exec-kpi-desc">Al 95% de confianza (p=q=0.5)</div>
        </div>
      </div>

      <!-- Segmented Control de Pestañas Bento -->
      <div class="exec-subcontrol-bar" style="margin-bottom: 20px;">
        <span class="exec-subcontrol-label">Nivel de Desglose:</span>
        <div class="exec-subcontrol-pills">
          <button type="button" class="exec-pill-btn active" data-tab="tab-sede">Por Sede (3)</button>
          <button type="button" class="exec-pill-btn" data-tab="tab-carrera">Por Carrera Profesional (26)</button>
          <button type="button" class="exec-pill-btn" data-tab="tab-ciclo">Por Ciclo Académico (1 al 14)</button>
        </div>
      </div>

      <!-- PESTAÑA 1: POR SEDE -->
      <div id="tab-sede" class="rep-tab-content">
        <div class="exec-charts-middle">
          <div class="exec-panel">
            <div class="exec-panel-title">Representatividad Muestral por Sede (%)</div>
            <div class="exec-chart-canvas-wrap" style="height: 260px;">
              <canvas id="chart-rep-sede"></canvas>
            </div>
          </div>
          <div class="exec-panel">
            <div class="exec-panel-title">Distribución de Muestra por Sede</div>
            <div class="exec-chart-canvas-wrap" style="height: 260px;">
              <canvas id="chart-rep-sede-muestra"></canvas>
            </div>
          </div>
        </div>

        <div class="exec-panel" style="margin-bottom: 22px;">
          <div class="exec-panel-title">Tabla de Cobertura por Sede</div>
          <div style="overflow-x: auto;">
            <table class="fullscreen-data-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; color: #0a1b44;">
                  <th style="padding: 10px 14px;">Sede</th>
                  <th style="padding: 10px 14px; text-align: right;">Universo</th>
                  <th style="padding: 10px 14px; text-align: right;">Muestra</th>
                  <th style="padding: 10px 14px; text-align: right;">Representatividad</th>
                  <th style="padding: 10px 14px; text-align: right;">Margen de Error (95%)</th>
                </tr>
              </thead>
              <tbody>
                ${sedes.map(s => {
                  const mError = Calculations.margenErrorFinito(s.muestra, s.universo);
                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">${s.categoria}</td>
                      <td style="padding: 10px 14px; text-align: right; color: #64748b;">${s.universo.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 600; color: #0a1b44;">${s.muestra.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #00878A;">${s.representatividad}%</td>
                      <td style="padding: 10px 14px; text-align: right; color: #475569;">±${mError.toFixed(2)}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 2: POR CARRERA -->
      <div id="tab-carrera" class="rep-tab-content" style="display: none;">
        <div class="exec-panel" style="margin-bottom: 22px;">
          <div class="exec-panel-title">Representatividad por Carrera Profesional (%)</div>
          <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Porcentaje de matriculados encuestados en cada uno de los 26 programas académicos</p>
          <div class="exec-chart-canvas-wrap" style="height: 620px;">
            <canvas id="chart-rep-carrera"></canvas>
          </div>
        </div>

        <div class="exec-panel" style="margin-bottom: 22px;">
          <div class="exec-panel-title">Ficha Técnica Completa por Carrera</div>
          <div style="overflow-x: auto;">
            <table class="fullscreen-data-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; color: #0a1b44;">
                  <th style="padding: 10px 14px;">Programa Académico</th>
                  <th style="padding: 10px 14px; text-align: right;">Universo</th>
                  <th style="padding: 10px 14px; text-align: right;">Muestra</th>
                  <th style="padding: 10px 14px; text-align: right;">Representatividad</th>
                  <th style="padding: 10px 14px; text-align: right;">Margen de Error (95%)</th>
                </tr>
              </thead>
              <tbody>
                ${carreras.map(c => {
                  const mError = Calculations.margenErrorFinito(c.muestra, c.universo);
                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 14px; font-weight: 500; color: #1e293b;">${window.toTitleCase ? window.toTitleCase(c.categoria) : c.categoria}</td>
                      <td style="padding: 10px 14px; text-align: right; color: #64748b;">${c.universo.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 600; color: #0a1b44;">${c.muestra.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #00878A;">${c.representatividad}%</td>
                      <td style="padding: 10px 14px; text-align: right; color: #475569;">±${mError.toFixed(2)}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 3: POR CICLO -->
      <div id="tab-ciclo" class="rep-tab-content" style="display: none;">
        <div class="exec-panel" style="margin-bottom: 22px;">
          <div class="exec-panel-title">Representatividad por Ciclo Académico (%)</div>
          <div class="exec-chart-canvas-wrap" style="height: 380px;">
            <canvas id="chart-rep-ciclo"></canvas>
          </div>
        </div>

        <div class="exec-panel" style="margin-bottom: 22px;">
          <div class="exec-panel-title">Ficha Técnica por Ciclo</div>
          <div style="overflow-x: auto;">
            <table class="fullscreen-data-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; color: #0a1b44;">
                  <th style="padding: 10px 14px;">Ciclo</th>
                  <th style="padding: 10px 14px; text-align: right;">Universo</th>
                  <th style="padding: 10px 14px; text-align: right;">Muestra</th>
                  <th style="padding: 10px 14px; text-align: right;">Representatividad</th>
                  <th style="padding: 10px 14px; text-align: right;">Margen de Error (95%)</th>
                </tr>
              </thead>
              <tbody>
                ${ciclos.map(ci => {
                  const mError = Calculations.margenErrorFinito(ci.muestra, ci.universo);
                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">Ciclo ${ci.categoria}</td>
                      <td style="padding: 10px 14px; text-align: right; color: #64748b;">${ci.universo.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 600; color: #0a1b44;">${ci.muestra.toLocaleString()}</td>
                      <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #00878A;">${ci.representatividad}%</td>
                      <td style="padding: 10px 14px; text-align: right; color: #475569;">±${mError.toFixed(2)}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: El cálculo del margen de error muestral se realiza con la fórmula de Cochran para poblaciones finitas con un nivel de confianza del 95% (Z = 1.96) y varianza máxima (p = q = 0.5).</p>
        <p>Fuente: Matrícula Oficial UWiener y Encuesta Laboral a Estudiantes 2026. Muestra total de 7,233 estudiantes de 23,639 matriculados.</p>
      </div>

    </div>
  `;

  setupTabEvents(sedes, carreras, ciclos);
  initSedeCharts(sedes);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

function setupTabEvents(sedes, carreras, ciclos) {
  const tabs = document.querySelectorAll('.exec-pill-btn[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.dataset.tab;
      document.querySelectorAll('.rep-tab-content').forEach(pane => {
        pane.style.display = pane.id === targetId ? 'block' : 'none';
      });

      if (targetId === 'tab-carrera' && !activeCharts.carrera) {
        initCarreraChart(carreras);
      } else if (targetId === 'tab-ciclo' && !activeCharts.ciclo) {
        initCicloChart(ciclos);
      }

      if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
        setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
      }
    });
  });
}

function initSedeCharts(sedes) {
  if (typeof Chart === 'undefined' || sedes.length === 0) return;

  // 1. Representatividad Sede
  const ctx1 = document.getElementById('chart-rep-sede');
  if (ctx1) {
    const existing = Chart.getChart(ctx1);
    if (existing) existing.destroy();

    activeCharts.sede = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: sedes.map(s => s.categoria),
        datasets: [{
          data: sedes.map(s => s.representatividad),
          backgroundColor: '#07C8CC',
          borderRadius: 3,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.raw}% de representatividad (${sedes[item.dataIndex].muestra.toLocaleString()} de ${sedes[item.dataIndex].universo.toLocaleString()})`
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 50,
            ticks: { callback: v => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#334155' },
            grid: { display: false }
          }
        }
      },
      plugins: [{
        id: 'labelsRepSede',
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

  // 2. Muestra Sede
  const ctx2 = document.getElementById('chart-rep-sede-muestra');
  if (ctx2) {
    const existing = Chart.getChart(ctx2);
    if (existing) existing.destroy();

    activeCharts.sedeMuestra = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: sedes.map(s => s.categoria),
        datasets: [{
          data: sedes.map(s => s.muestra),
          backgroundColor: '#156082',
          borderRadius: 3,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.raw.toLocaleString()} estudiantes encuestados`
            }
          }
        },
        scales: {
          y: {
            ticks: { font: { size: 10, family: 'Inter' }, color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { font: { size: 11, family: 'Inter', weight: '500' }, color: '#334155' },
            grid: { display: false }
          }
        }
      },
      plugins: [{
        id: 'labelsMuestraSede',
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
              ctx.fillText(Number(val).toLocaleString(), bar.x, bar.y - 4);
              ctx.restore();
            });
          });
        }
      }]
    });
  }

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

function initCarreraChart(carreras) {
  const ctx = document.getElementById('chart-rep-carrera');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const sorted = [...carreras].sort((a, b) => b.representatividad - a.representatividad);
  const labels = sorted.map(c => window.toTitleCase ? window.toTitleCase(c.categoria) : c.categoria);
  const values = sorted.map(c => c.representatividad);
  const muestras = sorted.map(c => c.muestra);
  const universos = sorted.map(c => c.universo);

  activeCharts.carrera = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 55, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${muestras[item.dataIndex].toLocaleString()} de ${universos[item.dataIndex].toLocaleString()})`
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
          ticks: { font: { size: 10.5, family: 'Inter' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsRepCarrera',
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
            ctx.fillText(`${val}% (${muestras[i].toLocaleString()})`, bar.x + 6, bar.y);
            ctx.restore();
          });
        });
      }
    }]
  });
}

function initCicloChart(ciclos) {
  const ctx = document.getElementById('chart-rep-ciclo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const labels = ciclos.map(c => `Ciclo ${c.categoria}`);
  const values = ciclos.map(c => c.representatividad);
  const muestras = ciclos.map(c => c.muestra);
  const universos = ciclos.map(c => c.universo);

  activeCharts.ciclo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: '#07C8CC',
        borderRadius: 3,
        barPercentage: 0.65
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw}% (${muestras[item.dataIndex].toLocaleString()} de ${universos[item.dataIndex].toLocaleString()})`
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
          ticks: { font: { size: 10.5, family: 'Inter' }, color: '#334155' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'labelsRepCiclo',
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
