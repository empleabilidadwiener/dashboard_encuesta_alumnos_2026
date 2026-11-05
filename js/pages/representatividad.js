// js/pages/representatividad.js — Ficha Técnica y Representatividad Muestral (Pestaña 3: Universo vs Muestra)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

let activeCharts = {};

export async function loadRepresentatividadPage(container) {
  // Limpiar gráficos previos
  Object.values(activeCharts).forEach(c => {
    if (c && typeof c.destroy === 'function') c.destroy();
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
    <div class="page-header">
      <div class="page-title-wrap">
        <span class="badge badge-primary"><i class="fas fa-clipboard-check"></i> Ficha Técnica Oficial</span>
        <h2 class="page-title">Ficha Técnica y Representatividad Muestral</h2>
        <p class="page-subtitle">Universidad Norbert Wiener · Análisis de cobertura y precisión estadística sobre el universo de matriculados 2026-2</p>
      </div>
      <div class="header-pills">
        <span class="pill-info"><i class="fas fa-university"></i> Universo: ${totalUniverso.toLocaleString()}</span>
        <span class="pill-info"><i class="fas fa-users"></i> Muestra: ${totalMuestra.toLocaleString()}</span>
        <span class="pill-info"><i class="fas fa-percentage"></i> Cobertura: ${representatividadGlobal}%</span>
        <span class="pill-info"><i class="fas fa-calculator"></i> Margen de Error: ±${margenErrorGlobal.toFixed(2)}%</span>
      </div>
    </div>

    <!-- KPIs Metodológicos -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-tint-white">
        <div class="kpi-icon-wrap" style="color: #2563eb;"><i class="fas fa-database"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Universo Oficial</span>
          <span class="kpi-value" style="color: #2563eb;">${totalUniverso.toLocaleString()}</span>
          <span class="kpi-desc">Alumnos matriculados en 2026-2</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-teal">
        <div class="kpi-icon-wrap" style="color: #0284c7;"><i class="fas fa-user-check"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Muestra Efectiva</span>
          <span class="kpi-value" style="color: #0284c7;">${totalMuestra.toLocaleString()}</span>
          <span class="kpi-desc">Cuestionarios completos validados</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-wiener">
        <div class="kpi-icon-wrap" style="color: #10b981;"><i class="fas fa-chart-pie"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Representatividad</span>
          <span class="kpi-value" style="color: #10b981;">${representatividadGlobal}%</span>
          <span class="kpi-desc">1 de cada 3 alumnos encuestados</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-orange">
        <div class="kpi-icon-wrap" style="color: #f59e0b;"><i class="fas fa-bullseye"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Margen de Error Global</span>
          <span class="kpi-value" style="color: #f59e0b;">±${margenErrorGlobal.toFixed(2)}%</span>
          <span class="kpi-desc">Al 95% de nivel de confianza (p=q=0.5)</span>
        </div>
      </div>
    </div>

    <!-- Navegación por pestañas de la Ficha Técnica -->
    <div class="view-tabs" style="margin-bottom: 24px; display: flex; gap: 12px; border-bottom: 2px solid var(--border-color, #e2e8f0); padding-bottom: 8px;">
      <button type="button" class="btn-tab active" data-tab="tab-sede" style="background: none; border: none; font-weight: 600; padding: 8px 16px; cursor: pointer; color: #07C8CC; border-bottom: 3px solid #07C8CC;">
        <i class="fas fa-map-marker-alt"></i> Por Sede
      </button>
      <button type="button" class="btn-tab" data-tab="tab-carrera" style="background: none; border: none; font-weight: 600; padding: 8px 16px; cursor: pointer; color: #64748b;">
        <i class="fas fa-graduation-cap"></i> Por Carrera Profesional (26)
      </button>
      <button type="button" class="btn-tab" data-tab="tab-ciclo" style="background: none; border: none; font-weight: 600; padding: 8px 16px; cursor: pointer; color: #64748b;">
        <i class="fas fa-layer-group"></i> Por Ciclo Académico (1 al 14)
      </button>
    </div>

    <!-- CONTENEDOR 1: POR SEDE -->
    <div id="tab-sede" class="tab-pane active">
      <div class="dashboard-grid">
        <div class="card card-span-6">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-chart-bar" style="color: #07C8CC;"></i> Cobertura por Sede (%)</h3>
              <p class="card-subtitle">Porcentaje de representatividad alcanzado en cada sede</p>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height: 300px; position: relative;">
              <canvas id="chart-ficha-sede"></canvas>
            </div>
          </div>
        </div>

        <div class="card card-span-6">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-table" style="color: #3b82f6;"></i> Tabla de Representatividad por Sede</h3>
              <p class="card-subtitle">Universo, encuestados y margen de error finite por sede</p>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="fullscreen-data-table">
                <thead>
                  <tr>
                    <th>Sede</th>
                    <th style="text-align: right;">Universo</th>
                    <th style="text-align: right;">Encuestados</th>
                    <th style="text-align: right;">% Cobertura</th>
                    <th style="text-align: right;">Margen de Error</th>
                  </tr>
                </thead>
                <tbody>
                  ${sedes.map(s => {
                    const u = parseInt(s.universo, 10);
                    const m = parseInt(s.muestra, 10);
                    const pct = Math.round(parseFloat(s.representatividad) * 1000) / 10;
                    const me = Calculations.margenErrorFinito(m, u);
                    return `
                      <tr>
                        <td><strong>${s.categoria}</strong></td>
                        <td style="text-align: right;">${u.toLocaleString()}</td>
                        <td style="text-align: right;">${m.toLocaleString()}</td>
                        <td style="text-align: right;"><span class="badge" style="background: rgba(7, 200, 204, 0.15); color: #07C8CC; font-weight: 700;">${pct}%</span></td>
                        <td style="text-align: right;">±${me.toFixed(2)}%</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENEDOR 2: POR CARRERA -->
    <div id="tab-carrera" class="tab-pane" style="display: none;">
      <div class="dashboard-grid">
        <div class="card card-span-12">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-graduation-cap" style="color: #10b981;"></i> Universo vs Muestra por Carrera Profesional</h3>
              <p class="card-subtitle">Desglose de representatividad para las 26 carreras profesionales</p>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height: 480px; position: relative;">
              <canvas id="chart-ficha-carreras"></canvas>
            </div>
          </div>
        </div>

        <div class="card card-span-12">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-table" style="color: #8b5cf6;"></i> Detalle Estadístico por Carrera</h3>
              <p class="card-subtitle">Indicadores de precisión y tamaño muestral</p>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="fullscreen-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Carrera Profesional</th>
                    <th style="text-align: right;">Matrícula 2026-2</th>
                    <th style="text-align: right;">Encuestados</th>
                    <th style="text-align: right;">% Representatividad</th>
                    <th style="text-align: right;">Margen de Error</th>
                  </tr>
                </thead>
                <tbody>
                  ${carreras.map((c, idx) => {
                    const u = parseInt(c.universo, 10);
                    const m = parseInt(c.muestra, 10);
                    const pct = Math.round(parseFloat(c.representatividad) * 1000) / 10;
                    const me = Calculations.margenErrorFinito(m, u);
                    return `
                      <tr>
                        <td>${idx + 1}</td>
                        <td><strong>${c.categoria}</strong></td>
                        <td style="text-align: right;">${u.toLocaleString()}</td>
                        <td style="text-align: right;">${m.toLocaleString()}</td>
                        <td style="text-align: right;">
                          <span class="badge" style="background: ${pct >= 30 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${pct >= 30 ? '#10b981' : '#f59e0b'}; font-weight: 700;">
                            ${pct}%
                          </span>
                        </td>
                        <td style="text-align: right;">${m >= u ? 'Censo (0%)' : `±${me.toFixed(2)}%`}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENEDOR 3: POR CICLO -->
    <div id="tab-ciclo" class="tab-pane" style="display: none;">
      <div class="dashboard-grid">
        <div class="card card-span-6">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-layer-group" style="color: #f59e0b;"></i> Cobertura por Ciclo Académico</h3>
              <p class="card-subtitle">Porcentaje de estudiantes encuestados según ciclo cursado</p>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height: 380px; position: relative;">
              <canvas id="chart-ficha-ciclos"></canvas>
            </div>
          </div>
        </div>

        <div class="card card-span-6">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i class="fas fa-table" style="color: #ec4899;"></i> Tabla de Representatividad por Ciclo</h3>
              <p class="card-subtitle">Distribución muestral del ciclo 1 al 14</p>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="fullscreen-data-table">
                <thead>
                  <tr>
                    <th>Ciclo</th>
                    <th style="text-align: right;">Matriculados</th>
                    <th style="text-align: right;">Encuestados</th>
                    <th style="text-align: right;">% Cobertura</th>
                    <th style="text-align: right;">Margen de Error</th>
                  </tr>
                </thead>
                <tbody>
                  ${ciclos.map(ci => {
                    const u = parseInt(ci.universo, 10);
                    const m = parseInt(ci.muestra, 10);
                    const pct = Math.round(parseFloat(ci.representatividad) * 1000) / 10;
                    const me = Calculations.margenErrorFinito(m, u);
                    return `
                      <tr>
                        <td><strong>Ciclo ${ci.categoria}</strong></td>
                        <td style="text-align: right;">${u.toLocaleString()}</td>
                        <td style="text-align: right;">${m.toLocaleString()}</td>
                        <td style="text-align: right;"><span class="badge" style="background: rgba(236, 72, 153, 0.15); color: #ec4899; font-weight: 700;">${pct}%</span></td>
                        <td style="text-align: right;">${m >= u ? 'Censo (0%)' : `±${me.toFixed(2)}%`}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Setup tab switcher
  container.querySelectorAll('.btn-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.btn-tab').forEach(b => {
        b.classList.remove('active');
        b.style.color = '#64748b';
        b.style.borderBottom = 'none';
      });
      container.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      btn.style.color = '#07C8CC';
      btn.style.borderBottom = '3px solid #07C8CC';

      const tabId = btn.dataset.tab;
      const targetPane = document.getElementById(tabId);
      if (targetPane) {
        targetPane.style.display = 'block';
        window.dispatchEvent(new Event('resize'));
      }
    });
  });

  renderFichaCharts(sedes, carreras, ciclos);
}

function renderFichaCharts(sedes, carreras, ciclos) {
  // 1. Sede Bar Chart
  activeCharts.sede = Charts.createBarChart(
    'chart-ficha-sede',
    sedes.map(s => s.categoria),
    [{
      label: '% de Representatividad',
      data: sedes.map(s => Math.round(parseFloat(s.representatividad) * 1000) / 10),
      backgroundColor: '#07C8CC',
      borderRadius: 6
    }]
  );

  // 2. Carreras Bar Chart (Horizontal)
  activeCharts.carreras = Charts.createHorizontalBarChart(
    'chart-ficha-carreras',
    carreras.map(c => c.categoria),
    [
      {
        label: 'Encuestados',
        data: carreras.map(c => parseInt(c.muestra, 10)),
        backgroundColor: '#10b981'
      },
      {
        label: 'Matrícula Total (Universo)',
        data: carreras.map(c => parseInt(c.universo, 10)),
        backgroundColor: '#94a3b8'
      }
    ]
  );

  // 3. Ciclos Bar Chart
  activeCharts.ciclos = Charts.createBarChart(
    'chart-ficha-ciclos',
    ciclos.map(c => `Ciclo ${c.categoria}`),
    [{
      label: '% de Cobertura',
      data: ciclos.map(c => Math.round(parseFloat(c.representatividad) * 1000) / 10),
      backgroundColor: '#f59e0b',
      borderRadius: 6
    }]
  );
}
