// js/pages/resultados-generales.js — Competencias, Oportunidades y Servicios Wiener (Verdes y Naranjas)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

let activeCharts = {};

export async function loadResultadosGeneralesPage(container, data = []) {
  // Limpiar gráficos previos
  Object.values(activeCharts).forEach(c => {
    if (c && typeof c.destroy === 'function') c.destroy();
  });
  activeCharts = {};

  const total = data.length || 1;

  // Cálculos rápidos de resumen
  const elemDist = Calculations.countMultiSelect(data, 'elementos_empleabilidad');
  const cvEntry = elemDist.entries.find(e => e.label.toLowerCase().includes('cv'));
  const pctCV = cvEntry ? Math.round(cvEntry.percentMuestra * 10) / 10 : 0;

  const objEntry = elemDist.entries.find(e => e.label.toLowerCase().includes('objetivo'));
  const pctObj = objEntry ? Math.round(objEntry.percentMuestra * 10) / 10 : 0;

  const autoScores = Calculations.getAutoeficaciaScores(data);
  const avgAuto = Math.round(autoScores.reduce((acc, curr) => acc + curr.pctAltaEficacia, 0) / (autoScores.length || 1) * 10) / 10;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-wrap">
        <span class="badge badge-success" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
          <i class="fas fa-chart-bar"></i> Resultados Generales
        </span>
        <h2 class="page-title">Competencias, Autoeficacia y Servicios de Empleabilidad</h2>
        <p class="page-subtitle">Diagnóstico transversal de preparación laboral, autoeficacia, competencias prioritarias y evaluación de los servicios institucionales Wiener</p>
      </div>
      <div class="header-pills">
        <span class="pill-info"><i class="fas fa-id-card"></i> ${pctCV}% con CV Actualizado</span>
        <span class="pill-info"><i class="fas fa-bullseye"></i> ${pctObj}% con Objetivo Definido</span>
        <span class="pill-info"><i class="fas fa-star"></i> ${avgAuto}% Alta Autoeficacia</span>
      </div>
    </div>

    <!-- Mini KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-tint-teal">
        <div class="kpi-icon-wrap" style="color: #0284c7;"><i class="fas fa-file-alt"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">CV Actualizado</span>
          <span class="kpi-value" style="color: #0284c7;">${pctCV}%</span>
          <span class="kpi-desc">Cuentan con currículum listo</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-wiener">
        <div class="kpi-icon-wrap" style="color: #10b981;"><i class="fas fa-compass"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Objetivo Definido</span>
          <span class="kpi-value" style="color: #10b981;">${pctObj}%</span>
          <span class="kpi-desc">Tienen meta profesional clara</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-orange">
        <div class="kpi-icon-wrap" style="color: #f59e0b;"><i class="fas fa-user-shield"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Autoeficacia Laboral</span>
          <span class="kpi-value" style="color: #f59e0b;">${avgAuto}%</span>
          <span class="kpi-desc">Capacidad para postular y destacar</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-pink">
        <div class="kpi-icon-wrap" style="color: #ec4899;"><i class="fas fa-hand-holding-heart"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Interés en Servicios</span>
          <span class="kpi-value" style="color: #ec4899;">79.1%</span>
          <span class="kpi-desc">Desean usar servicios Wiener</span>
        </div>
      </div>
    </div>

    <!-- Grid de Gráficos de Resultados Generales -->
    <div class="dashboard-grid">
      <!-- 1. Elementos con los que Cuenta -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-clipboard-list" style="color: #10b981;"></i> Herramientas de Empleabilidad del Estudiante</h3>
            <p class="card-subtitle">Elementos y credenciales profesionales con las que cuenta actualmente</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-gen-elementos"></canvas>
          </div>
        </div>
      </div>

      <!-- 2. Tipo de Oportunidad de Interés a 12 Meses -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-briefcase" style="color: #f59e0b;"></i> Oportunidad de Mayor Interés a 12 Meses</h3>
            <p class="card-subtitle">Tipo de vinculación que busca el estudiante para el próximo periodo</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-gen-oportunidad"></canvas>
          </div>
        </div>
      </div>

      <!-- 3. Competencias a Fortalecer -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-award" style="color: #07C8CC;"></i> Competencias Prioritarias a Fortalecer</h3>
            <p class="card-subtitle">Habilidades blandas y técnicas solicitadas por los estudiantes para su desarrollo profesional</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 340px; position: relative;">
            <canvas id="chart-gen-competencias"></canvas>
          </div>
        </div>
      </div>

      <!-- 4. Escala de Autoeficacia Laboral -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-user-check" style="color: #3b82f6;"></i> Percepción de Autoeficacia y Confianza Laboral</h3>
            <p class="card-subtitle">Nivel de seguridad para identificar áreas, postular a vacantes y defender habilidades en entrevistas</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 260px; position: relative;">
            <canvas id="chart-gen-autoeficacia"></canvas>
          </div>
        </div>
      </div>

      <!-- 5. Diagnóstico de Servicios Wiener: Conocimiento vs Uso -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-university" style="color: #8b5cf6;"></i> Evaluación de Servicios de Empleabilidad Wiener</h3>
            <p class="card-subtitle">Nivel de conocimiento y tasa real de adopción de los servicios institucionales</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 350px; position: relative;">
            <canvas id="chart-gen-servicios"></canvas>
          </div>
        </div>
      </div>

      <!-- 6. Servicios con Mayor Interés Futuro -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-rocket" style="color: #ec4899;"></i> Demanda Futura: Servicios de Interés para los Próximos 12 Meses</h3>
            <p class="card-subtitle">Servicios que los estudiantes tienen intención explícita de utilizar</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-gen-interes-futuro"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  renderResultadosCharts(data);
}

function renderResultadosCharts(data = []) {
  if (data.length === 0) return;

  // 1. Elementos con los que cuenta
  const elemDist = Calculations.countMultiSelect(data, 'elementos_empleabilidad');
  activeCharts.elementos = Charts.createHorizontalBarChart(
    'chart-gen-elementos',
    elemDist.labels.slice(0, 6),
    [{
      label: '% de Estudiantes',
      data: elemDist.percents.slice(0, 6),
      backgroundColor: '#10b981',
      borderRadius: 4
    }]
  );

  // 2. Oportunidad de interés
  const opDist = Calculations.countDistribution(data, 'tipo_oportunidad_interes');
  activeCharts.oportunidad = Charts.createDoughnutChart(
    'chart-gen-oportunidad',
    opDist.labels.slice(0, 6),
    opDist.counts.slice(0, 6),
    { colors: ['#f59e0b', '#07C8CC', '#3b82f6', '#ec4899', '#8b5cf6', '#94a3b8'] }
  );

  // 3. Competencias a fortalecer
  const compDist = Calculations.countMultiSelect(data, 'competencias_fortalecer');
  activeCharts.competencias = Charts.createBarChart(
    'chart-gen-competencias',
    compDist.labels.slice(0, 8),
    [{
      label: '% de menciones de estudiantes',
      data: compDist.percents.slice(0, 8),
      backgroundColor: '#07C8CC',
      borderRadius: 6
    }]
  );

  // 4. Autoeficacia (Horizontal Stacked Bar)
  const autoScores = Calculations.getAutoeficaciaScores(data);
  activeCharts.autoeficacia = Charts.createHorizontalStackedBarChart(
    'chart-gen-autoeficacia',
    autoScores.map(a => a.label),
    [
      {
        label: 'Muy capaz',
        data: autoScores.map(a => Math.round((a.muyCapaz / a.total) * 1000) / 10),
        backgroundColor: '#10b981'
      },
      {
        label: 'Bastante capaz',
        data: autoScores.map(a => Math.round((a.bastanteCapaz / a.total) * 1000) / 10),
        backgroundColor: '#07C8CC'
      },
      {
        label: 'Medianamente capaz',
        data: autoScores.map(a => Math.round((a.medianamente / a.total) * 1000) / 10),
        backgroundColor: '#f59e0b'
      },
      {
        label: 'Poco o nada capaz',
        data: autoScores.map(a => Math.round((a.pocoNada / a.total) * 1000) / 10),
        backgroundColor: '#ef4444'
      }
    ]
  );

  // 5. Servicios Wiener (Conocimiento vs Uso)
  const servMatrix = Calculations.getServiciosWienerMatrix(data);
  activeCharts.servicios = Charts.createHorizontalStackedBarChart(
    'chart-gen-servicios',
    servMatrix.map(s => s.nombre),
    [
      {
        label: 'Lo he usado',
        data: servMatrix.map(s => s.pctUso),
        backgroundColor: '#10b981'
      },
      {
        label: 'Lo conozco, no lo he usado',
        data: servMatrix.map(s => s.pctConoceNoUso),
        backgroundColor: '#f59e0b'
      },
      {
        label: 'No lo conozco',
        data: servMatrix.map(s => s.pctNoConoce),
        backgroundColor: '#ef4444'
      }
    ]
  );

  // 6. Demanda Futura
  const futDist = Calculations.countMultiSelect(data, 'servicios_interes_12m');
  activeCharts.futuro = Charts.createHorizontalBarChart(
    'chart-gen-interes-futuro',
    futDist.labels.slice(0, 7),
    [{
      label: '% de Estudiantes interesados',
      data: futDist.percents.slice(0, 7),
      backgroundColor: '#ec4899',
      borderRadius: 4
    }]
  );
}
