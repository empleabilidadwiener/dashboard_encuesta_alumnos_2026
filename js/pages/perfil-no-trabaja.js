// js/pages/perfil-no-trabaja.js — Perfil de Estudiantes que NO Trabajan (Encabezados Rojos)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

let activeCharts = {};

export async function loadPerfilNoTrabajaPage(container, data = []) {
  // Limpiar gráficos previos
  Object.values(activeCharts).forEach(c => {
    if (c && typeof c.destroy === 'function') c.destroy();
  });
  activeCharts = {};

  const noTrabajadores = Calculations.getRespuestasNoTrabajadores(data);
  const totalNoTrabajan = noTrabajadores.length;
  const totalMuestra = data.length || 1;
  const pctNoTrabajan = Math.round((totalNoTrabajan / totalMuestra) * 1000) / 10;

  // Búsqueda activa
  const buscanActivos = noTrabajadores.filter(d => (d.intencion_busqueda || '').toLowerCase().includes('activamente')).length;
  const pctBuscanActivos = totalNoTrabajan > 0 ? Math.round((buscanActivos / totalNoTrabajan) * 1000) / 10 : 0;

  // Con experiencia previa
  const conExp = noTrabajadores.filter(d => (d.experiencia_previa || '').trim().toLowerCase() === 'sí').length;
  const pctConExp = totalNoTrabajan > 0 ? Math.round((conExp / totalNoTrabajan) * 1000) / 10 : 0;

  // En entrevista
  const enEntrevista = noTrabajadores.filter(d => (d.participado_entrevista || '').trim().toLowerCase() === 'sí').length;
  const pctEntrevista = buscanActivos > 0 ? Math.round((enEntrevista / buscanActivos) * 1000) / 10 : 0;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-wrap">
        <span class="badge badge-danger" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">
          <i class="fas fa-user-clock"></i> Módulo No Ocupados
        </span>
        <h2 class="page-title">Perfil de Estudiantes que No Trabajan</h2>
        <p class="page-subtitle">Análisis de la intención de búsqueda, tiempos de postulación, procesos de entrevista y principales barreras de inserción</p>
      </div>
      <div class="header-pills">
        <span class="pill-info"><i class="fas fa-users-slash"></i> ${totalNoTrabajan.toLocaleString()} Estudiantes No Ocupados</span>
        <span class="pill-info"><i class="fas fa-percentage"></i> ${pctNoTrabajan}% de la Muestra Total</span>
        <span class="pill-info"><i class="fas fa-search"></i> ${buscanActivos.toLocaleString()} en Búsqueda Activa</span>
      </div>
    </div>

    <!-- Mini KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-tint-rose">
        <div class="kpi-icon-wrap" style="color: #ef4444;"><i class="fas fa-user-clock"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Total No Ocupados</span>
          <span class="kpi-value" style="color: #ef4444;">${totalNoTrabajan.toLocaleString()}</span>
          <span class="kpi-desc">${pctNoTrabajan}% de la muestra total</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-orange">
        <div class="kpi-icon-wrap" style="color: #f59e0b;"><i class="fas fa-search-plus"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Búsqueda Activa</span>
          <span class="kpi-value" style="color: #f59e0b;">${pctBuscanActivos}%</span>
          <span class="kpi-desc">${buscanActivos.toLocaleString()} buscan trabajo/prácticas</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-teal">
        <div class="kpi-icon-wrap" style="color: #0284c7;"><i class="fas fa-history"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Experiencia Previa</span>
          <span class="kpi-value" style="color: #0284c7;">${pctConExp}%</span>
          <span class="kpi-desc">${conExp.toLocaleString()} han laborado anteriormente</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-wiener">
        <div class="kpi-icon-wrap" style="color: #10b981;"><i class="fas fa-comments"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Han Tenido Entrevistas</span>
          <span class="kpi-value" style="color: #10b981;">${pctEntrevista}%</span>
          <span class="kpi-desc">De quienes buscan activamente</span>
        </div>
      </div>
    </div>

    <!-- Grid de Gráficos de No Trabajadores -->
    <div class="dashboard-grid">
      <!-- 1. Intención de Búsqueda -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-compass" style="color: #ef4444;"></i> Intención de Búsqueda de Trabajo o Prácticas</h3>
            <p class="card-subtitle">Momento en que el estudiante planea iniciar o retomar su inserción laboral</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-notrab-intencion"></canvas>
          </div>
        </div>
      </div>

      <!-- 2. Tiempo Llevado en Búsqueda Activa -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-stopwatch" style="color: #f59e0b;"></i> Tiempo de Búsqueda Activa</h3>
            <p class="card-subtitle">Duración acumulada de postulación (solo quienes buscan activamente)</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-notrab-tiempo"></canvas>
          </div>
        </div>
      </div>

      <!-- 3. Entrevistas y Experiencia Previa -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-user-check" style="color: #0284c7;"></i> Experiencia Laboral Previa</h3>
            <p class="card-subtitle">¿Ha tenido alguna experiencia formativa o laboral en el pasado?</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas id="chart-notrab-experiencia"></canvas>
          </div>
        </div>
      </div>

      <!-- 4. Participación en Entrevistas -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-handshake" style="color: #10b981;"></i> Participación en Procesos de Selección</h3>
            <p class="card-subtitle">¿Ha sido convocado a entrevistas durante su búsqueda actual?</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas id="chart-notrab-entrevista"></canvas>
          </div>
        </div>
      </div>

      <!-- 5. Dificultades y Factores que Obstaculizan la Inserción -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-exclamation-triangle" style="color: #f43f5e;"></i> Factores que Dificultan Encontrar Oportunidad Laboral o Prácticas</h3>
            <p class="card-subtitle">Principales obstáculos reportados por los estudiantes no ocupados (selección múltiple)</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 350px; position: relative;">
            <canvas id="chart-notrab-factores"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  renderNoTrabajaCharts(noTrabajadores);
}

function renderNoTrabajaCharts(noTrabajadores = []) {
  if (noTrabajadores.length === 0) return;

  // 1. Intención de Búsqueda
  const intDist = Calculations.countDistribution(noTrabajadores, 'intencion_busqueda');
  activeCharts.intencion = Charts.createDoughnutChart(
    'chart-notrab-intencion',
    intDist.labels,
    intDist.counts,
    { colors: ['#f59e0b', '#ef4444', '#07C8CC', '#94a3b8'] }
  );

  // 2. Tiempo de Búsqueda
  const buscadores = noTrabajadores.filter(d => (d.intencion_busqueda || '').toLowerCase().includes('activamente'));
  const tiempoDist = Calculations.countDistribution(buscadores, 'tiempo_busqueda');
  activeCharts.tiempo = Charts.createBarChart(
    'chart-notrab-tiempo',
    tiempoDist.labels,
    [{
      label: 'Estudiantes en búsqueda',
      data: tiempoDist.counts,
      backgroundColor: '#f59e0b',
      borderRadius: 6
    }]
  );

  // 3. Experiencia Previa
  const expDist = Calculations.countDistribution(noTrabajadores, 'experiencia_previa');
  activeCharts.experiencia = Charts.createDoughnutChart(
    'chart-notrab-experiencia',
    expDist.labels,
    expDist.counts,
    { colors: ['#ef4444', '#10b981'] }
  );

  // 4. Entrevista
  const entDist = Calculations.countDistribution(buscadores, 'participado_entrevista');
  activeCharts.entrevista = Charts.createDoughnutChart(
    'chart-notrab-entrevista',
    entDist.labels,
    entDist.counts,
    { colors: ['#ef4444', '#10b981'] }
  );

  // 5. Factores que dificultan
  const factDist = Calculations.countMultiSelect(noTrabajadores, 'factores_dificultan');
  activeCharts.factores = Charts.createHorizontalBarChart(
    'chart-notrab-factores',
    factDist.labels.slice(0, 8),
    [{
      label: '% de Estudiantes que reportan esta dificultad',
      data: factDist.percents.slice(0, 8),
      backgroundColor: '#f43f5e',
      borderRadius: 4
    }]
  );
}
