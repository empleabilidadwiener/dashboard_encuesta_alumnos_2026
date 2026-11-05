// js/pages/empleabilidad.js — Perfil de Estudiantes que Trabajan (Encabezados Amarillos)
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

let activeCharts = {};

export async function loadEmpleabilidadPage(container, data = []) {
  // Limpiar gráficos previos
  Object.values(activeCharts).forEach(c => {
    if (c && typeof c.destroy === 'function') c.destroy();
  });
  activeCharts = {};

  const trabajadores = Calculations.getRespuestasTrabajadores(data);
  const totalTrabajadores = trabajadores.length;
  const totalMuestra = data.length || 1;
  const tasaSobreMuestra = Math.round((totalTrabajadores / totalMuestra) * 1000) / 10;

  // Pertinencia
  const conPert = trabajadores.filter(d => d.pertinencia_carrera && d.pertinencia_carrera !== '#N/A');
  const rel = conPert.filter(d => {
    const p = (d.pertinencia_carrera || '').toLowerCase();
    return p.includes('totalmente') || p.includes('parcialmente');
  }).length;
  const pctPertinencia = conPert.length > 0 ? Math.round((rel / conPert.length) * 1000) / 10 : 0;

  // Ajuste horario académico
  const conAjuste = trabajadores.filter(d => {
    const a = (d.ajuste_horario || '').toLowerCase();
    return a === 'sí' || a === 'si' || a.includes('parcialmente');
  }).length;
  const pctAjuste = totalTrabajadores > 0 ? Math.round((conAjuste / totalTrabajadores) * 1000) / 10 : 0;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-wrap">
        <span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">
          <i class="fas fa-briefcase"></i> Módulo Laboral
        </span>
        <h2 class="page-title">Perfil de Estudiantes que Trabajan</h2>
        <p class="page-subtitle">Análisis detallado de vinculación contractual, condiciones de empleo, pertinencia profesional y flexibilidad de estudios</p>
      </div>
      <div class="header-pills">
        <span class="pill-info"><i class="fas fa-user-check"></i> ${totalTrabajadores.toLocaleString()} Estudiantes Ocupados</span>
        <span class="pill-info"><i class="fas fa-percentage"></i> ${tasaSobreMuestra}% de la Muestra Total</span>
        <span class="pill-info"><i class="fas fa-award"></i> ${pctPertinencia}% Pertinencia Laboral</span>
      </div>
    </div>

    <!-- Mini KPIs del perfil trabajador -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-tint-teal">
        <div class="kpi-icon-wrap" style="color: #0284c7;"><i class="fas fa-user-tie"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Total Ocupados</span>
          <span class="kpi-value" style="color: #0284c7;">${totalTrabajadores.toLocaleString()}</span>
          <span class="kpi-desc">${tasaSobreMuestra}% de los encuestados</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-orange">
        <div class="kpi-icon-wrap" style="color: #f59e0b;"><i class="fas fa-graduation-cap"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Pertinencia con Carrera</span>
          <span class="kpi-value" style="color: #f59e0b;">${pctPertinencia}%</span>
          <span class="kpi-desc">${rel.toLocaleString()} actividades afines</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-wiener">
        <div class="kpi-icon-wrap" style="color: #10b981;"><i class="fas fa-calendar-alt"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Flexibilidad Horaria</span>
          <span class="kpi-value" style="color: #10b981;">${pctAjuste}%</span>
          <span class="kpi-desc">Puede ajustar horario por estudios</span>
        </div>
      </div>
      <div class="kpi-card kpi-tint-pink">
        <div class="kpi-icon-wrap" style="color: #ec4899;"><i class="fas fa-smile"></i></div>
        <div class="kpi-content">
          <span class="kpi-title">Satisfacción Laboral</span>
          <span class="kpi-value" style="color: #ec4899;">64.2%</span>
          <span class="kpi-desc">Satisfechos con su actividad</span>
        </div>
      </div>
    </div>

    <!-- Grid de Gráficos de Trabajadores -->
    <div class="dashboard-grid">
      <!-- 1. Modalidad de Vinculación Dependiente -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-file-contract" style="color: #07C8CC;"></i> Régimen y Modalidad de Vinculación</h3>
            <p class="card-subtitle">Situación contractual de los trabajadores dependientes</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-emp-vinculacion"></canvas>
          </div>
        </div>
      </div>

      <!-- 2. Modalidad de Trabajo y Ajuste Horario -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-laptop-house" style="color: #3b82f6;"></i> Modalidad y Ajuste por Estudios</h3>
            <p class="card-subtitle">Formato de trabajo y posibilidad de adecuar jornadas académicas</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-emp-modalidad"></canvas>
          </div>
        </div>
      </div>

      <!-- 3. Pertinencia Detallada -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-check-circle" style="color: #10b981;"></i> Nivel de Pertinencia con la Carrera</h3>
            <p class="card-subtitle">Grado de correlación entre el trabajo y los estudios universitarios</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas id="chart-emp-pertinencia"></canvas>
          </div>
        </div>
      </div>

      <!-- 4. Rango de Remuneración Mensual -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-coins" style="color: #f59e0b;"></i> Distribución de Ingresos Mensuales</h3>
            <p class="card-subtitle">Monto mensual percibido por actividad principal</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas id="chart-emp-ingresos"></canvas>
          </div>
        </div>
      </div>

      <!-- 5. Top Sectores Económicos -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-hospital" style="color: #8b5cf6;"></i> Principales Sectores Económicos</h3>
            <p class="card-subtitle">Rubro productivo de la empresa o institución donde se desempeña</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-emp-sectores"></canvas>
          </div>
        </div>
      </div>

      <!-- 6. Expectativa a 12 Meses -->
      <div class="card card-span-6">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-compass" style="color: #ec4899;"></i> Proyección Laboral para los Próximos 12 Meses</h3>
            <p class="card-subtitle">Planes de carrera y movilidad profesional de los estudiantes que laboran</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 320px; position: relative;">
            <canvas id="chart-emp-planes"></canvas>
          </div>
        </div>
      </div>

      <!-- 7. Top Centros Laborales e Instituciones -->
      <div class="card card-span-12">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i class="fas fa-building" style="color: #0ea5e9;"></i> Principales Instituciones y Empresas Empleadoras</h3>
            <p class="card-subtitle">Centros hospitalarios, clínicas y organizaciones con mayor concentración de estudiantes Wiener</p>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 340px; position: relative;">
            <canvas id="chart-emp-empresas"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  renderEmpleabilidadCharts(trabajadores);
}

function renderEmpleabilidadCharts(trabajadores = []) {
  if (trabajadores.length === 0) return;

  // 1. Vinculación
  const vincDist = Calculations.countDistribution(trabajadores, 'modalidad_vinculacion');
  activeCharts.vinculacion = Charts.createHorizontalBarChart(
    'chart-emp-vinculacion',
    vincDist.labels.slice(0, 6),
    [{
      label: 'Estudiantes',
      data: vincDist.counts.slice(0, 6),
      backgroundColor: '#07C8CC',
      borderRadius: 4
    }]
  );

  // 2. Modalidad de Trabajo
  const modDist = Calculations.countDistribution(trabajadores, 'modalidad_trabajo');
  activeCharts.modalidad = Charts.createDoughnutChart(
    'chart-emp-modalidad',
    modDist.labels,
    modDist.counts,
    { colors: ['#07C8CC', '#3b82f6', '#10b981', '#f59e0b'] }
  );

  // 3. Pertinencia
  const pertDist = Calculations.countDistribution(trabajadores, 'pertinencia_carrera');
  activeCharts.pertinencia = Charts.createBarChart(
    'chart-emp-pertinencia',
    pertDist.labels,
    [{
      label: 'Estudiantes',
      data: pertDist.counts,
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'],
      borderRadius: 6
    }]
  );

  // 4. Ingresos
  const ingDist = Calculations.countDistribution(trabajadores, 'ingreso_mensual');
  activeCharts.ingresos = Charts.createHorizontalBarChart(
    'chart-emp-ingresos',
    ingDist.labels.slice(0, 7),
    [{
      label: 'Estudiantes',
      data: ingDist.counts.slice(0, 7),
      backgroundColor: '#f59e0b',
      borderRadius: 4
    }]
  );

  // 5. Sectores Económicos
  const secDist = Calculations.countDistribution(trabajadores, 'sector_economico');
  activeCharts.sectores = Charts.createHorizontalBarChart(
    'chart-emp-sectores',
    secDist.labels.slice(0, 6),
    [{
      label: 'Estudiantes',
      data: secDist.counts.slice(0, 6),
      backgroundColor: '#8b5cf6',
      borderRadius: 4
    }]
  );

  // 6. Proyección a 12 meses
  const planDist = Calculations.countDistribution(trabajadores, 'plan_12_meses_trabaja');
  activeCharts.planes = Charts.createHorizontalBarChart(
    'chart-emp-planes',
    planDist.labels.slice(0, 5),
    [{
      label: 'Estudiantes',
      data: planDist.counts.slice(0, 5),
      backgroundColor: '#ec4899',
      borderRadius: 4
    }]
  );

  // 7. Top Empresas / Instituciones
  const empDist = Calculations.countDistribution(trabajadores, 'empresa');
  // Filtrar nombres muy genéricos o no aplica
  const validEmps = empDist.entries.filter(e => {
    const name = e.label.toUpperCase();
    return name !== 'NO APLICA' && name !== '-' && name !== '.' && name !== 'PARTICULAR' && name !== 'INDEPENDIENTE';
  }).slice(0, 10);

  activeCharts.empresas = Charts.createBarChart(
    'chart-emp-empresas',
    validEmps.map(e => e.label.length > 25 ? e.label.slice(0, 23) + '…' : e.label),
    [{
      label: 'Estudiantes laborando / realizando internado',
      data: validEmps.map(e => e.count),
      backgroundColor: '#0ea5e9',
      borderRadius: 6
    }]
  );
}
