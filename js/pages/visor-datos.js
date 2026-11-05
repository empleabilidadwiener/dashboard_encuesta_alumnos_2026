// js/pages/visor-datos.js — Visor de Microdatos para Encuesta a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni
// Estilo visual exacto institucional Wiener (#07C8CC, #156082, #0a1b44) y jerarquía directiva

export async function loadVisorDatosPage(container, data = []) {
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="resumen-ejecutivo-wrapper">
        <div class="exec-top-bar">
          <span class="exec-institution">Universidad Norbert Wiener</span>
          <span class="exec-date">Visor de Microdatos &nbsp;&nbsp;&nbsp;&nbsp; Edición 2026</span>
        </div>
        <h1 class="exec-header-title">Visor de Microdatos</h1>
        <div class="exec-header-subtitle">No se encontraron registros disponibles para el criterio de filtro seleccionado.</div>
      </div>
    `;
    return;
  }

  const defaultVisible = [
    'id',
    'carrera',
    'ciclo',
    'sede',
    'empleabilidad_final',
    'actividad_principal',
    'pertinencia_carrera',
    'ingreso_mensual',
    'tipo_oportunidad_interes'
  ];

  const colLabels = {
    id: 'ID',
    carrera: 'Carrera',
    ciclo: 'Ciclo',
    edad: 'Edad',
    sexo: 'Sexo',
    sede: 'Sede',
    empleabilidad_final: '¿Trabaja?',
    actividad_remunerada: '¿Remunerada?',
    actividad_principal: 'Actividad Principal',
    modalidad_vinculacion: 'Vinculación Laboral',
    trabajo_independiente: 'Independiente / Freelance',
    formalizacion_negocio: 'Formalización Negocio',
    empresa: 'Empresa / Institución',
    sector_economico: 'Sector Económico',
    modalidad_trabajo: 'Modalidad Trabajo',
    ajuste_horario: 'Ajuste Horario Estudios',
    ingreso_mensual: 'Ingreso Mensual',
    primera_experiencia: '1ra Experiencia',
    pertinencia_carrera: 'Pertinencia',
    satisfaccion_actividad: 'Satisfacción',
    plan_12_meses_trabaja: 'Plan 12 Meses',
    intencion_busqueda: 'Intención Búsqueda',
    tiempo_busqueda: 'Tiempo Búsqueda',
    participado_entrevista: 'Entrevista',
    factores_dificultan: 'Dificultades',
    experiencia_previa: 'Exp. Previa',
    elementos_empleabilidad: 'Elementos Empleabilidad',
    competencias_fortalecer: 'Competencias Deseadas',
    tipo_oportunidad_interes: 'Oportunidad Deseada',
    capaz_identificar_trabajo: 'Autoeficacia: Identificar',
    capaz_postular_empleo: 'Autoeficacia: Postular',
    capaz_explicar_habilidades: 'Autoeficacia: Entrevista',
    servicio_bolsa_laboral: 'Bolsa Laboral',
    servicio_ferias_laborales: 'Ferias Laborales',
    servicio_jornadas_charlas: 'Jornadas / Charlas',
    servicio_talleres_programas: 'Talleres',
    servicio_asesorias: 'Asesorías',
    servicio_cursos_actualizacion: 'Cursos Actualización',
    servicios_interes_12m: 'Servicios de Interés'
  };

  let visibleCols = [...defaultVisible];
  let searchText = '';
  let currentPage = 1;
  const rowsPerPage = 50;

  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const getFilteredData = () => {
    if (!searchText) return data;
    const searchNorm = norm(searchText);
    return data.filter(row => visibleCols.some(h => norm(String(row[h] || '')).includes(searchNorm)));
  };

  const formatCell = (val, maxLen = 40) => {
    if (val === undefined || val === null || val === '') return '<span style="color: #94a3b8;">-</span>';
    let strVal = String(val).trim();
    strVal = strVal.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (strVal.length > maxLen) {
      return `<span title="${strVal}" style="cursor: help;">${strVal.substring(0, maxLen)}…</span>`;
    }
    return strVal;
  };

  const renderTable = () => {
    const searchHadFocus = document.activeElement && document.activeElement.id === 'visor-search';
    const searchCursorPos = searchHadFocus ? document.activeElement.selectionStart : null;

    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filteredData.slice(start, start + rowsPerPage);

    container.innerHTML = `
      <div class="resumen-ejecutivo-wrapper">
        
        <!-- Barra superior institucional -->
        <div class="exec-top-bar">
          <span class="exec-institution">Universidad Norbert Wiener</span>
          <span class="exec-date">Visor de Microdatos &nbsp;&nbsp;&nbsp;&nbsp; Edición 2026</span>
        </div>

        <!-- Título principal y subtítulo directivo -->
        <h1 class="exec-header-title">Visor de Microdatos</h1>
        <div class="exec-header-subtitle">Explorador de registros individuales anonimizados de la encuesta a estudiantes</div>

        <!-- Panel con controles y tabla -->
        <div class="exec-panel" style="margin-bottom: 22px;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 16px;">
            <div style="flex: 1; min-width: 280px; max-width: 480px; position: relative;">
              <input type="text" id="visor-search" placeholder="Buscar por carrera, sector, empresa, etc..." value="${searchText}"
                style="width: 100%; height: 38px; padding: 0 12px 0 36px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; outline: none; background: #ffffff;">
              <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #94a3b8; font-size: 13px;"></i>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 12.5px; color: #64748b;">
                Mostrando <strong>${start + 1}</strong>–<strong>${Math.min(start + rowsPerPage, filteredData.length)}</strong> de <strong>${filteredData.length.toLocaleString()}</strong>
              </span>
              <button type="button" id="btn-export-visor" class="exec-btn-clean" style="height: 38px; padding: 0 16px; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
                <i class="fas fa-download" style="color: #07C8CC;"></i> Exportar CSV
              </button>
            </div>
          </div>

          <!-- Tabla de Datos -->
          <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table class="fullscreen-data-table" style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #0a1b44;">
                  ${visibleCols.map(c => `<th style="padding: 10px 12px; text-align: left; font-weight: 700;">${colLabels[c] || c}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${pageRows.map((row, idx) => `
                  <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#fcfdfd'};">
                    ${visibleCols.map(c => `<td style="padding: 9px 12px; color: #1e293b;">${formatCell(row[c])}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Paginador Ejecutivo -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 12px; color: #64748b;">
              Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong>
            </span>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="visor-prev" class="exec-btn-clean" style="height: 32px; padding: 0 12px; font-size: 12px;" ${currentPage <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <i class="fas fa-chevron-left"></i> Anterior
              </button>
              <button type="button" id="visor-next" class="exec-btn-clean" style="height: 32px; padding: 0 12px; font-size: 12px;" ${currentPage >= totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                Siguiente <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- Notas pie -->
        <div class="exec-footer-notes">
          <p>Nota: Los datos desplegados han sido anonimizados protegiendo la identidad y datos personales de los estudiantes (Ley de Protección de Datos Personales N° 29733).</p>
        </div>

      </div>
    `;

    // Restaurar foco de búsqueda si existía
    const searchEl = document.getElementById('visor-search');
    if (searchHadFocus && searchEl) {
      searchEl.focus();
      if (searchCursorPos !== null) {
        searchEl.setSelectionRange(searchCursorPos, searchCursorPos);
      }
    }

    // Eventos
    searchEl?.addEventListener('input', (e) => {
      searchText = e.target.value;
      currentPage = 1;
      renderTable();
    });

    document.getElementById('visor-prev')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    document.getElementById('visor-next')?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });

    document.getElementById('btn-export-visor')?.addEventListener('click', () => {
      exportarCSV(filteredData, visibleCols, colLabels);
    });
  };

  renderTable();
}

function exportarCSV(rows, cols, labels) {
  if (!rows || rows.length === 0) return;
  const headerLine = cols.map(c => `"${labels[c] || c}"`).join(',');
  const rowLines = rows.map(r => {
    return cols.map(c => {
      const val = String(r[c] || '').replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `encuesta_estudiantes_wiener_2026_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
