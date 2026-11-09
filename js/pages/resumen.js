// js/pages/resumen.js — Resumen Ejecutivo de Empleabilidad a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional, paleta Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

let activeCharts = {};
let incluirMedicinaEnCicloFacultad = true;
let soloCarrerasRepresentativas = true;
let soloCarrerasRemunRepresentativas = true;

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

      <!-- Control de Segmentación para Ciclo y Facultad (Filtro Medicina Humana) -->
      <div class="exec-subcontrol-bar" style="margin: 0 0 14px 0; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 8px 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 9px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: rgba(7, 200, 204, 0.12); color: #002D72; font-size: 13px;">
            <i class="fas fa-stethoscope"></i>
          </span>
          <div>
            <strong style="color: #0a1b44; font-size: 12px; letter-spacing: -0.2px;">Filtro de Análisis para estos dos gráficos:</strong>
            <span style="color: #64748b; font-size: 11.5px; margin-left: 4px;">Medicina Humana (1,621 estudiantes con internado clínico y 14 ciclos)</span>
          </div>
        </div>
        <div class="exec-subcontrol-pills" id="resumen-medicina-pills">
          <button type="button" class="exec-pill-btn ${incluirMedicinaEnCicloFacultad ? 'active' : ''}" id="btn-med-con" data-mode="con" title="Incluir a todos los estudiantes incluyendo Medicina Humana">
            <i class="fas fa-check-circle" style="color: #07C8CC; margin-right: 4px;"></i> Con Medicina
          </button>
          <button type="button" class="exec-pill-btn ${!incluirMedicinaEnCicloFacultad ? 'active' : ''}" id="btn-med-sin" data-mode="sin" title="Excluir temporalmente a Medicina Humana para evaluar progresión típica">
            <i class="fas fa-eye-slash" style="color: #64748b; margin-right: 4px;"></i> Sin Medicina
          </button>
        </div>
      </div>

      <!-- Fila Intermedia: Ciclo y Facultad -->
      <div class="exec-charts-middle">
        
        <!-- Por Ciclo -->
        <div class="exec-panel" data-visual-id="resumen-ocupacion-ciclo">
          <div class="exec-panel-title" id="title-exec-ciclo">Nivel de Empleabilidad por ciclo</div>
          <div class="exec-chart-canvas-wrap">
            <canvas id="chart-exec-ciclo"></canvas>
          </div>
        </div>

        <!-- Por Facultad -->
        <div class="exec-panel" data-visual-id="resumen-ocupacion-facultad">
          <div class="exec-panel-title" id="title-exec-facultad">Nivel de Empleabilidad por facultad</div>
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
        <div class="exec-chart-canvas-wrap" style="height: 540px;">
          <canvas id="chart-exec-carrera"></canvas>
        </div>
        
        <!-- Caja de leyenda y advertencia metodológica para carreras con muestra mínima -->
        <div id="exec-carreras-alert-container"></div>
      </div>

      <!-- Fila Intermedia 2: Actividad Remunerada por Ciclo y por Facultad -->
      <div class="exec-charts-middle">
        
        <!-- Actividad Remunerada por Ciclo -->
        <div class="exec-panel" data-visual-id="resumen-remunerada-ciclo">
          <div class="exec-panel-title" id="title-exec-remun-ciclo">Actividad Remunerada por ciclo</div>
          <p class="exec-section-desc" style="margin: -6px 0 10px 0;">% de estudiantes ocupados (Empleabilidad Final = Sí) que perciben remuneración</p>
          <div class="exec-chart-canvas-wrap">
            <canvas id="chart-exec-remun-ciclo"></canvas>
          </div>
        </div>

        <!-- Actividad Remunerada por Facultad -->
        <div class="exec-panel" data-visual-id="resumen-remunerada-facultad">
          <div class="exec-panel-title" id="title-exec-remun-facultad">Actividad Remunerada por facultad</div>
          <p class="exec-section-desc" style="margin: -6px 0 10px 0;">% de estudiantes ocupados con actividad remunerada según facultad</p>
          <div class="exec-chart-canvas-wrap">
            <canvas id="chart-exec-remun-facultad"></canvas>
          </div>
        </div>

      </div>

      <!-- Actividad Remunerada por Carrera (Barras Agrupadas) -->
      <div class="exec-panel" data-visual-id="resumen-remunerada-carrera" style="margin-bottom: 22px;">
        <div class="exec-panel-title">
          <i class="fas fa-hand-holding-usd" style="color: #07C8CC; margin-right: 8px;"></i> Actividad Remunerada por Carrera
        </div>
        <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Comparativo porcentual entre Actividad Remunerada y Sin Remuneración / Formativa sobre el total de estudiantes ocupados (Empleabilidad Final)</p>
        <div class="exec-chart-canvas-wrap" style="height: 540px;">
          <canvas id="chart-exec-remun-carrera"></canvas>
        </div>
        
        <!-- Caja de leyenda y advertencia metodológica para carreras con muestra mínima en Actividad Remunerada -->
        <div id="exec-remun-carreras-alert-container"></div>
      </div>

      <!-- Panel Completo: Situación Laboral Actual (Con máxima amplitud y variables 100% completas) -->
      <div class="exec-panel" data-visual-id="resumen-vinculo-laboral" style="margin-bottom: 22px;">
        <div class="exec-panel-title">
          <i class="fas fa-briefcase" style="color: #07C8CC; margin-right: 8px;"></i> Situación Laboral Actual
        </div>
        <p class="exec-section-desc" style="margin: -6px 0 16px 0;">Distribución de actividades laborales y formativas declaradas por los 4,400 estudiantes ocupados</p>
        
        <div class="exec-donut-fullwidth-container">
          <div class="exec-donut-canvas-wrap" style="position: relative; width: 210px; height: 210px; flex-shrink: 0;">
            <canvas id="chart-exec-vinculo"></canvas>
          </div>
          <div class="exec-donut-grid-legend" id="exec-donut-legend-vinculo"></div>
        </div>
      </div>

      <!-- Fila Inferior (2 Columnas Amplias): Ingresos y Desarrollo Profesional -->
      <div class="exec-charts-middle" style="grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); margin-bottom: 22px;">

        <!-- Ingreso Mensual Aproximado -->
        <div class="exec-panel" data-visual-id="resumen-nivel-ingresos">
          <div class="exec-panel-title">
            <i class="fas fa-money-bill-wave" style="color: #07C8CC; margin-right: 8px;"></i> Ingreso mensual aproximado
          </div>
          <p class="exec-section-desc" style="margin: -6px 0 12px 0;">Distribución de ingresos mensuales reportados por estudiantes con actividad remunerada</p>
          <div class="exec-chart-canvas-wrap" style="height: 270px;">
            <canvas id="chart-exec-ingresos"></canvas>
          </div>
          <p class="exec-section-desc" id="exec-ingresos-note" style="margin-top: 8px; font-size: 11.5px; color: #64748b;">
            Datos declarados por estudiantes con actividad remunerada.
          </p>
        </div>

        <!-- Flexibilidad y Experiencia -->
        <div class="exec-panel" data-visual-id="resumen-desarrollo-profesional">
          <div class="exec-panel-title">
            <i class="fas fa-user-graduate" style="color: #07C8CC; margin-right: 8px;"></i> Flexibilidad y Trayectoria Formativa
          </div>
          <p class="exec-section-desc" style="margin: -6px 0 14px 0;">Compatibilidad de horarios con la vida universitaria e inicio de vida profesional</p>
          <div class="exec-desarrollo-list">
            <div class="exec-desarrollo-box" style="padding: 16px 20px; margin-bottom: 14px;">
              <div class="exec-desarrollo-label" style="font-size: 13px;">Ajuste de horario por estudios</div>
              <div class="exec-desarrollo-data" style="margin: 6px 0;">
                <span class="exec-desarrollo-pct" style="font-size: 28px;">${pctAjuste}%</span>
              </div>
              <div class="exec-desarrollo-sentence" style="font-size: 12.5px;">${conAjuste.toLocaleString()} de ${totalTrabajando.toLocaleString()} estudiantes pueden adecuar su jornada a sus clases.</div>
            </div>

            <div class="exec-desarrollo-box" style="padding: 16px 20px;">
              <div class="exec-desarrollo-label" style="font-size: 13px;">Primera experiencia formativa / laboral</div>
              <div class="exec-desarrollo-data" style="margin: 6px 0;">
                <span class="exec-desarrollo-pct" style="font-size: 28px;">${pct1raExp}%</span>
              </div>
              <div class="exec-desarrollo-sentence" style="font-size: 12.5px;">${con1raExp.toLocaleString()} estudiantes inician su primera experiencia profesional durante la carrera.</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Notas metodológicas y pie directivo -->
      <div class="exec-footer-notes">
        <p>Nota metodológica: Nivel de Empleabilidad = Estudiantes con actividad laboral o formativa (PEA Ocupada, 4,400) / Población Económicamente Activa evaluada (PEA = Sí + No de la columna central de empleabilidad, 5,726 estudiantes = 76.8%). Excluye a los 1,507 estudiantes inactivos con dedicación exclusiva a sus estudios (No PEA).</p>
        <p>Fuente: Encuesta Laboral a Estudiantes 2026 – Universidad Norbert Wiener. Muestra total de 7,233 estudiantes (cobertura del 30.6% sobre 23,639 matriculados).</p>
      </div>

    </div>
  `;

  setupFilterEvents(data);
  initExecCharts(data, trabajadores);
}

function setupFilterEvents(data = []) {
  const selFac = document.getElementById('exec-sel-facultad');
  const selCar = document.getElementById('exec-sel-carrera');
  const selCic = document.getElementById('exec-sel-ciclo');
  const selSed = document.getElementById('exec-sel-sede');
  const btnReset = document.getElementById('exec-btn-limpiar');
  const btnUpdate = document.getElementById('exec-btn-actualizar');
  const btnMedCon = document.getElementById('btn-med-con');
  const btnMedSin = document.getElementById('btn-med-sin');
  const btnCarrerasRep = document.getElementById('btn-carreras-rep');
  const btnCarrerasTodas = document.getElementById('btn-carreras-todas');
  const btnRemunCarrerasRep = document.getElementById('btn-remun-carreras-rep');
  const btnRemunCarrerasTodas = document.getElementById('btn-remun-carreras-todas');

  btnMedCon?.addEventListener('click', () => {
    if (incluirMedicinaEnCicloFacultad) return;
    incluirMedicinaEnCicloFacultad = true;
    btnMedCon.classList.add('active');
    btnMedSin.classList.remove('active');
    updateCicloYFacultad(data, true);
  });

  btnMedSin?.addEventListener('click', () => {
    if (!incluirMedicinaEnCicloFacultad) return;
    incluirMedicinaEnCicloFacultad = false;
    btnMedSin.classList.add('active');
    btnMedCon.classList.remove('active');
    updateCicloYFacultad(data, false);
  });

  btnCarrerasRep?.addEventListener('click', () => {
    if (soloCarrerasRepresentativas) return;
    soloCarrerasRepresentativas = true;
    btnCarrerasRep.classList.add('active');
    btnCarrerasTodas.classList.remove('active');
    createChartCarrera(data);
  });

  btnCarrerasTodas?.addEventListener('click', () => {
    if (!soloCarrerasRepresentativas) return;
    soloCarrerasRepresentativas = false;
    btnCarrerasTodas.classList.add('active');
    btnCarrerasRep.classList.remove('active');
    createChartCarrera(data);
  });

  btnRemunCarrerasRep?.addEventListener('click', () => {
    if (soloCarrerasRemunRepresentativas) return;
    soloCarrerasRemunRepresentativas = true;
    btnRemunCarrerasRep.classList.add('active');
    btnRemunCarrerasTodas.classList.remove('active');
    createChartRemunCarrera(data);
  });

  btnRemunCarrerasTodas?.addEventListener('click', () => {
    if (!soloCarrerasRemunRepresentativas) return;
    soloCarrerasRemunRepresentativas = false;
    btnRemunCarrerasTodas.classList.add('active');
    btnRemunCarrerasRep.classList.remove('active');
    createChartRemunCarrera(data);
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
    incluirMedicinaEnCicloFacultad = true;
    soloCarrerasRepresentativas = true;
    soloCarrerasRemunRepresentativas = true;
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

  updateCicloYFacultad(data, incluirMedicinaEnCicloFacultad);
  createChartCarrera(data);
  createChartRemunCarrera(data);
  createChartVinculo(trabajadores);
  createChartIngresos(trabajadores);

  if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
    setTimeout(() => window.Charts.attachFullscreenButtons(), 60);
  }
}

function updateCicloYFacultad(data, conMedicina) {
  const dataset = conMedicina
    ? data
    : data.filter(d => (d.carrera || '').trim().toLowerCase() !== 'medicina humana');

  createChartCiclo(dataset);
  createChartFacultad(dataset);
  createChartRemunCiclo(dataset);
  createChartRemunFacultad(dataset);

  const titleCiclo = document.getElementById('title-exec-ciclo');
  const titleFac = document.getElementById('title-exec-facultad');
  const titleRemunCiclo = document.getElementById('title-exec-remun-ciclo');
  const titleRemunFac = document.getElementById('title-exec-remun-facultad');

  const badgeSinMed = ' <span style="font-size: 11px; font-weight: 600; color: #002D72; background: #e0f2fe; padding: 2px 8px; border-radius: 10px; margin-left: 6px;">Sin Medicina Humana</span>';

  if (titleCiclo) {
    titleCiclo.innerHTML = conMedicina
      ? 'Nivel de Empleabilidad por ciclo'
      : `Nivel de Empleabilidad por ciclo${badgeSinMed}`;
  }

  if (titleFac) {
    titleFac.innerHTML = conMedicina
      ? 'Nivel de Empleabilidad por facultad'
      : `Nivel de Empleabilidad por facultad${badgeSinMed}`;
  }

  if (titleRemunCiclo) {
    titleRemunCiclo.innerHTML = conMedicina
      ? 'Actividad Remunerada por ciclo'
      : `Actividad Remunerada por ciclo${badgeSinMed}`;
  }

  if (titleRemunFac) {
    titleRemunFac.innerHTML = conMedicina
      ? 'Actividad Remunerada por facultad'
      : `Actividad Remunerada por facultad${badgeSinMed}`;
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
          ticks: { autoSkip: false, maxRotation: 45, minRotation: 0, font: { size: 10, family: 'Inter', weight: '500' }, color: '#475569' },
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
          ticks: { autoSkip: false, font: { size: 11, family: 'Inter', weight: '500' }, color: '#1e293b' },
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

// 3. Gráfico por Carrera (Barras Agrupadas: % Ocupados vs % No Ocupados con filtro de muestra mínima)
function createChartCarrera(data) {
  const ctx = document.getElementById('chart-exec-carrera');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const MIN_PEA_CARRERA = 15;
  const todasCarreras = Calculations.getEmpleabilidadPorCarrera(data);
  const carrerasStats = soloCarrerasRepresentativas
    ? todasCarreras.filter(c => c.pea >= MIN_PEA_CARRERA)
    : todasCarreras;
  const carrerasExcluidas = todasCarreras.filter(c => c.pea < MIN_PEA_CARRERA);

  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(300, carrerasStats.length * 34)}px`;
  }

  const labels = carrerasStats.map(c => {
    const isMinima = c.pea < MIN_PEA_CARRERA;
    const baseName = window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera;
    return isMinima ? `${baseName} *` : baseName;
  });

  const ocupadosData = carrerasStats.map(c => Math.round(c.tasaEmpleabilidad));
  const noOcupadosData = carrerasStats.map(c => Math.max(0, 100 - Math.round(c.tasaEmpleabilidad)));

  // Renderizar o actualizar la caja de advertencia/leyenda
  const alertContainer = document.getElementById('exec-carreras-alert-container');
  if (alertContainer) {
    if (carrerasExcluidas.length > 0) {
      alertContainer.innerHTML = `
        <div class="exec-sample-alert-box">
          <div class="exec-sample-alert-header">
            <i class="fas fa-exclamation-triangle" style="color: #F59E0B;"></i>
            <span>${soloCarrerasRepresentativas 
              ? 'Programas con muestra mínima no representativa (excluidos del ranking principal para evitar sesgo):' 
              : 'Advertencia metodológica sobre programas con muestra mínima (*):'}</span>
          </div>
          <div class="exec-sample-alert-list">
            ${carrerasExcluidas.map(c => `
              <span class="exec-sample-pill">
                <strong>${window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera}*:</strong> 
                ${Math.round(c.tasaEmpleabilidad)}% (${c.trabajan} de ${c.pea} en PEA, N=${c.total})
              </span>
            `).join('')}
          </div>
          <p class="exec-sample-alert-note">
            ${soloCarrerasRepresentativas
              ? '* Estos programas registran muestras reducidas (N ≤ 13 encuestados), lo que genera distorsiones estadísticas (como 100% con un único encuestado). Se excluyen de la visualización principal para garantizar un análisis directivo riguroso.'
              : '* Los programas marcados con asterisco (*) cuentan con muestras reducidas (N ≤ 13 encuestados) y deben interpretarse con cautela por falta de representatividad estadística.'}
          </p>
        </div>
      `;
    } else {
      alertContainer.innerHTML = '';
    }
  }

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
            autoSkip: false,
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
              const aviso = c.pea < MIN_PEA_CARRERA ? ' — *Muestra mínima no representativa' : '';
              return ` ${context.dataset.label}: ${Math.round(val)}% (${cant.toLocaleString()} de ${c.pea.toLocaleString()} en PEA)${aviso}`;
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

// 4. Situación Laboral Actual (Dona con todas las alternativas de la encuesta)
function createChartVinculo(trabajadores) {
  const ctx = document.getElementById('chart-exec-vinculo');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const dist = Calculations.countDistribution(trabajadores, 'actividad_principal');
  const validEntries = dist.entries
    .filter(e => e.label && !e.label.toLowerCase().includes('no realizo') && !e.label.toLowerCase().includes('no especifica'))
    .sort((a, b) => {
      const aOther = a.label.toLowerCase().startsWith('otr');
      const bOther = b.label.toLowerCase().startsWith('otr');
      if (aOther !== bOther) return aOther ? 1 : -1;
      return b.count - a.count;
    });
  const total = validEntries.reduce((a, b) => a + b.count, 0) || 1;

  // Paleta armónica institucional Wiener para todas las alternativas
  const palette = [
    '#07C8CC', // Cyan Wiener principal (Trabajo dependiente remunerado)
    '#156082', // Azul intermedio Wiener (Internado clínico)
    '#0a1b44', // Azul marino profundo (Trabajo independiente o freelance)
    '#0E9F9F', // Teal petróleo (Negocio propio o familiar)
    '#6366F1', // Índigo moderno (Otro tipo de actividad)
    '#38BDF8', // Celeste cielo (Prácticas preprofesionales remuneradas)
    '#F59E0B', // Ámbar dorado (Prácticas preprofesionales no remuneradas)
    '#94A3B8'  // Gris pizarra (Voluntariado o investigación)
  ];

  const fullLabels = validEntries.map(e => e.label);
  const counts = validEntries.map(e => e.count);
  const values = validEntries.map(e => Math.round((e.count / total) * 1000) / 10);
  const colors = validEntries.map((_, i) => palette[i % palette.length]);

  const legendEl = document.getElementById('exec-donut-legend-vinculo');
  if (legendEl) {
    legendEl.innerHTML = validEntries.map((e, i) => `
      <div class="exec-legend-card-item" title="${e.label}">
        <div class="exec-legend-card-left">
          <span class="exec-legend-card-dot" style="background-color: ${colors[i]};"></span>
          <span class="exec-legend-card-name">${e.label}</span>
        </div>
        <div class="exec-legend-card-right">
          <span class="exec-legend-card-pct">${values[i]}%</span>
          <span class="exec-legend-card-count">(${counts[i].toLocaleString()})</span>
        </div>
      </div>
    `).join('');
  }

  activeCharts.vinculo = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: fullLabels,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
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
            label: (item) => ` ${fullLabels[item.dataIndex]}: ${values[item.dataIndex]}% (${counts[item.dataIndex].toLocaleString()} estudiantes)`
          }
        }
      }
    },
    plugins: [{
      id: 'donutCenterText',
      beforeDraw(chart) {
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.font = '800 22px Inter, sans-serif';
        ctx.fillStyle = '#0a1b44';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total.toLocaleString(), width / 2, height / 2 - 9);
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Ocupados', width / 2, height / 2 + 12);
        ctx.restore();
      }
    }]
  });
}

// 5. Ingreso Mensual Aproximado (Barras Verticales Cyan con DataLabels — Todas las escalas salariales)
function createChartIngresos(trabajadores) {
  const ctx = document.getElementById('chart-exec-ingresos');
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

  const totalValidos = allEntries.reduce((a, b) => a + b.count, 0) || 1;

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
  const exactPcts = allEntries.map(e => (e.count / totalValidos) * 100);
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
        borderRadius: 2,
        barPercentage: 0.68,
        categoryPercentage: 0.84
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 22, right: 8, left: 4, bottom: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => fullLabels[items[0].dataIndex] || '',
            label: (item) => {
              const c = counts[item.dataIndex] || 0;
              const v = values[item.dataIndex] || 0;
              return ` ${formatPctLabel(v, c)} (${c.toLocaleString()} de ${totalValidos.toLocaleString()} remunerados)`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: Math.ceil((Math.max(...values, 35) + 8) / 10) * 10,
          ticks: { stepSize: 10, callback: (v) => `${v}%`, font: { size: 10, family: 'Inter' }, color: '#64748b' },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            font: { size: 9.5, family: 'Inter', weight: '600' },
            color: '#334155'
          },
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

// 6. Actividad Remunerada por Ciclo (Barras Verticales)
function createChartRemunCiclo(data) {
  const ctx = document.getElementById('chart-exec-remun-ciclo');
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
      id: 'execDataLabelsRemunCiclo',
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

// 7. Actividad Remunerada por Facultad (Barras Horizontales)
function createChartRemunFacultad(data) {
  const ctx = document.getElementById('chart-exec-remun-facultad');
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
        borderRadius: 2,
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
          ticks: { autoSkip: false, font: { size: 11, family: 'Inter', weight: '500' }, color: '#1e293b' },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'execDataLabelsRemunFacultad',
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

// 8. Actividad Remunerada por Carrera (Barras Agrupadas: % Con Actividad Remunerada vs % Sin Remuneración / Formativa)
function createChartRemunCarrera(data) {
  const ctx = document.getElementById('chart-exec-remun-carrera');
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  const MIN_PEA_CARRERA = 15;
  const todasCarreras = Calculations.getActividadRemuneradaPorCarrera(data);
  const carrerasStats = soloCarrerasRemunRepresentativas
    ? todasCarreras.filter(c => c.pea >= MIN_PEA_CARRERA)
    : todasCarreras;
  const carrerasExcluidas = todasCarreras.filter(c => c.pea < MIN_PEA_CARRERA);

  const wrap = ctx.parentElement;
  if (wrap) {
    wrap.style.height = `${Math.max(300, carrerasStats.length * 34)}px`;
  }

  const labels = carrerasStats.map(c => {
    const isMinima = c.pea < MIN_PEA_CARRERA;
    const baseName = window.toTitleCase ? window.toTitleCase(c.carrera) : c.carrera;
    return isMinima ? `${baseName} *` : baseName;
  });

  const remuneradaData = carrerasStats.map(c => Math.round(c.tasaRemuneradaOcupados));
  const noRemuneradaData = carrerasStats.map(c => Math.max(0, 100 - Math.round(c.tasaRemuneradaOcupados)));

  const alertContainer = document.getElementById('exec-remun-carreras-alert-container');
  if (alertContainer) {
    if (carrerasExcluidas.length > 0) {
      alertContainer.innerHTML = `
        <div class="exec-sample-alert-box">
          <div class="exec-sample-alert-header">
            <i class="fas fa-exclamation-triangle" style="color: #F59E0B;"></i>
            <span>${soloCarrerasRemunRepresentativas 
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
            ${soloCarrerasRemunRepresentativas
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
            autoSkip: false,
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
      id: 'execDataLabelsRemunCarrera',
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
