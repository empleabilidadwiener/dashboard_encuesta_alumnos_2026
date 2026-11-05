// js/kpiCatalog.js — Catálogo de KPIs para Encuesta a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

const KPICatalog = {
  activeCharts: {},

  kpis: {
    encuestasValidas: {
      id: 'encuestasValidas',
      titulo: 'Encuestas Válidas',
      icono: 'fas fa-clipboard-check',
      color: '#2563eb',
      tintClass: 'kpi-tint-white',
      calcular: (data) => {
        const total = data ? data.length : 0;
        return {
          valor: total.toLocaleString(),
          descripcion: 'Total de estudiantes encuestados',
          valorNumerico: total
        };
      }
    },

    coberturaMuestra: {
      id: 'coberturaMuestra',
      titulo: 'Representatividad',
      icono: 'fas fa-chart-pie',
      color: '#8b5cf6',
      tintClass: 'kpi-tint-warm',
      calcular: (data) => {
        const muestra = data ? data.length : 0;
        const universo = 23639;
        const pct = (muestra / universo) * 100;
        return {
          valor: `${pct.toFixed(1)}%`,
          descripcion: `${muestra.toLocaleString()} de ${universo.toLocaleString()} matriculados`,
          valorNumerico: pct
        };
      }
    },

    estudiantesTrabajan: {
      id: 'estudiantesTrabajan',
      titulo: 'Estudiantes que Trabajan',
      icono: 'fas fa-briefcase',
      color: '#0284c7',
      tintClass: 'kpi-tint-teal',
      calcular: (data) => {
        const total = data ? data.length : 0;
        const trab = (data || []).filter(d => (d.empleabilidad_final || '').trim() === 'Sí').length;
        const pct = total > 0 ? (trab / total) * 100 : 0;
        return {
          valor: trab.toLocaleString(),
          descripcion: `${pct.toFixed(1)}% de la muestra total`,
          valorNumerico: trab
        };
      }
    },

    tasaEmpleabilidad: {
      id: 'tasaEmpleabilidad',
      titulo: 'Tasa de Actividad Laboral',
      icono: 'fas fa-chart-line',
      color: '#10b981',
      tintClass: 'kpi-tint-wiener',
      calcular: (data) => {
        const total = data ? data.length : 0;
        const trab = (data || []).filter(d => (d.empleabilidad_final || '').trim() === 'Sí').length;
        const pct = total > 0 ? (trab / total) * 100 : 0;
        return {
          valor: `${pct.toFixed(1)}%`,
          descripcion: `${trab.toLocaleString()} realizan actividad laboral o formativa`,
          valorNumerico: pct
        };
      }
    },

    pertinenciaLaboral: {
      id: 'pertinenciaLaboral',
      titulo: 'Pertinencia con Carrera',
      icono: 'fas fa-award',
      color: '#f59e0b',
      tintClass: 'kpi-tint-orange',
      calcular: (data) => {
        const trab = (data || []).filter(d => (d.empleabilidad_final || '').trim() === 'Sí');
        const conPert = trab.filter(d => d.pertinencia_carrera && d.pertinencia_carrera !== '#N/A');
        const rel = conPert.filter(d => {
          const p = (d.pertinencia_carrera || '').toLowerCase();
          return p.includes('totalmente') || p.includes('parcialmente');
        }).length;
        const pct = conPert.length > 0 ? (rel / conPert.length) * 100 : 0;
        return {
          valor: `${pct.toFixed(1)}%`,
          descripcion: `${rel.toLocaleString()} actividades vinculadas a su carrera`,
          valorNumerico: pct
        };
      }
    },

    satisfaccionLaboral: {
      id: 'satisfaccionLaboral',
      titulo: 'Satisfacción Laboral',
      icono: 'fas fa-smile',
      color: '#ec4899',
      tintClass: 'kpi-tint-pink',
      calcular: (data) => {
        const trab = (data || []).filter(d => (d.empleabilidad_final || '').trim() === 'Sí');
        const conSat = trab.filter(d => d.satisfaccion_actividad && d.satisfaccion_actividad !== '#N/A');
        const pos = conSat.filter(d => {
          const s = (d.satisfaccion_actividad || '').toLowerCase();
          return s.includes('muy satisfecho') || s === 'satisfecho';
        }).length;
        const pct = conSat.length > 0 ? (pos / conSat.length) * 100 : 0;
        return {
          valor: `${pct.toFixed(1)}%`,
          descripcion: `${pos.toLocaleString()} muy satisfechos o satisfechos`,
          valorNumerico: pct
        };
      }
    },

    estudiantesNoTrabajan: {
      id: 'estudiantesNoTrabajan',
      titulo: 'No Trabajan Actualmente',
      icono: 'fas fa-user-clock',
      color: '#ef4444',
      tintClass: 'kpi-tint-rose',
      calcular: (data) => {
        const total = data ? data.length : 0;
        const noTrab = (data || []).filter(d => (d.empleabilidad_final || '').trim() === 'No').length;
        const pct = total > 0 ? (noTrab / total) * 100 : 0;
        return {
          valor: noTrab.toLocaleString(),
          descripcion: `${pct.toFixed(1)}% concentrados en estudios`,
          valorNumerico: noTrab
        };
      }
    }
  },

  getDefaultConfig() {
    return [
      { kpiId: 'encuestasValidas', posicion: 0 },
      { kpiId: 'coberturaMuestra', posicion: 1 },
      { kpiId: 'tasaEmpleabilidad', posicion: 2 },
      { kpiId: 'pertinenciaLaboral', posicion: 3 },
      { kpiId: 'satisfaccionLaboral', posicion: 4 },
      { kpiId: 'estudiantesNoTrabajan', posicion: 5 }
    ];
  },

  renderKPI(kpiId, data, posicion) {
    const kpi = this.kpis[kpiId];
    if (!kpi) return '';

    const resultado = kpi.calcular(data);
    const tintClass = kpi.tintClass || 'kpi-tint-white';

    return `
      <div class="kpi-card ${tintClass}" data-posicion="${posicion}" data-kpi-id="${kpiId}">
        <div class="kpi-icon-wrap" style="color: ${kpi.color};">
          <i class="${kpi.icono}"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-header-row">
            <span class="kpi-title">${kpi.titulo}</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" style="color: ${kpi.color};">${resultado.valor}</span>
          </div>
          <span class="kpi-desc">${resultado.descripcion}</span>
        </div>
      </div>
    `;
  }
};

window.KPICatalog = KPICatalog;
