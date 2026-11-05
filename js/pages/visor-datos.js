// js/pages/visor-datos.js — Visor de Microdatos para Encuesta a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

export async function loadVisorDatosPage(container, data = []) {
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="page-header">
        <h2 class="page-title">Visor de Datos</h2>
        <p class="page-subtitle">No hay registros disponibles con los filtros actuales.</p>
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

  const allHeaders = Object.keys(data[0] || {});
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
    if (val === undefined || val === null || val === '') return '<span class="text-muted" style="color: #94a3b8;">-</span>';
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
      <div class="page-header">
        <div class="page-title-wrap">
          <span class="badge badge-primary"><i class="fas fa-table"></i> Microdatos</span>
          <h2 class="page-title">Visor de Microdatos</h2>
          <p class="page-subtitle">Explorador de registros individuales anonimizados de la encuesta a estudiantes</p>
        </div>
        <div class="header-pills">
          <span class="pill-info"><i class="fas fa-database"></i> ${filteredData.length.toLocaleString()} Registros</span>
          <button type="button" id="btn-export-visor" class="btn btn-sm btn-primary" style="background: #07C8CC; border: none; color: #0a1b44; font-weight: 700; border-radius: 6px; padding: 6px 14px; cursor: pointer;">
            <i class="fas fa-download"></i> Exportar CSV
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="flex: 1; min-width: 280px; max-width: 450px;">
            <div class="search-input-wrap" style="position: relative;">
              <input type="text" id="visor-search" placeholder="Buscar por carrera, empresa, sector, etc..." value="${searchText}"
                style="width: 100%; padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid var(--border-color, #cbd5e1); font-size: 14px; outline: none;">
              <i class="fas fa-search" style="position: absolute; left: 12px; top: 11px; color: #94a3b8;"></i>
            </div>
          </div>
          <div style="font-size: 13px; color: #64748b;">
            Mostrando <strong>${start + 1}</strong> a <strong>${Math.min(start + rowsPerPage, filteredData.length)}</strong> de <strong>${filteredData.length.toLocaleString()}</strong>
          </div>
        </div>

        <div class="card-body" style="padding: 0;">
          <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
            <table class="fullscreen-data-table" style="width: 100%; font-size: 13px;">
              <thead style="position: sticky; top: 0; background: var(--bg-card, #ffffff); z-index: 10; border-bottom: 2px solid #e2e8f0;">
                <tr>
                  ${visibleCols.map(c => `<th>${colLabels[c] || c}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${pageRows.map(row => `
                  <tr>
                    ${visibleCols.map(c => `<td>${formatCell(row[c])}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación -->
        <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-top: 1px solid var(--border-color, #e2e8f0);">
          <button type="button" class="btn btn-sm btn-secondary" id="btn-prev-page" ${currentPage <= 1 ? 'disabled style="opacity: 0.5;"' : ''}>
            <i class="fas fa-chevron-left"></i> Anterior
          </button>
          <span style="font-size: 13px; color: #64748b;">Página ${currentPage} de ${totalPages}</span>
          <button type="button" class="btn btn-sm btn-secondary" id="btn-next-page" ${currentPage >= totalPages ? 'disabled style="opacity: 0.5;"' : ''}>
            Siguiente <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    // Reattach search
    const searchInput = document.getElementById('visor-search');
    if (searchInput) {
      if (searchHadFocus) {
        searchInput.focus();
        if (searchCursorPos !== null) searchInput.setSelectionRange(searchCursorPos, searchCursorPos);
      }
      let debounceTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          searchText = e.target.value;
          currentPage = 1;
          renderTable();
        }, 250);
      });
    }

    // Pagination events
    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });

    // Export button
    document.getElementById('btn-export-visor')?.addEventListener('click', () => {
      exportCurrentView(filteredData);
    });
  };

  const exportCurrentView = (rowsToExport) => {
    if (!rowsToExport || rowsToExport.length === 0) return;
    const headers = Object.keys(rowsToExport[0]);
    let csv = '\uFEFF' + headers.join(';') + '\n';
    rowsToExport.forEach(r => {
      const line = headers.map(h => {
        let val = String(r[h] || '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(';');
      csv += line + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microdatos_estudiantes_wiener_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  renderTable();
}
