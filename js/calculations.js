// js/calculations.js — Métodos estadísticos y lógicas de cálculo para Encuesta Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

const Calculations = {
  cols: {
    id: 'id',
    carrera: 'carrera',
    ciclo: 'ciclo',
    edad: 'edad',
    sexo: 'sexo',
    sede: 'sede',
    empleabilidadFinal: 'empleabilidad_final',
    actividadRemunerada: 'actividad_remunerada',
    actividadPrincipal: 'actividad_principal',
    modalidadVinculacion: 'modalidad_vinculacion',
    trabajoIndependiente: 'trabajo_independiente',
    formalizacionNegocio: 'formalizacion_negocio',
    empresa: 'empresa',
    sectorEconomico: 'sector_economico',
    modalidadTrabajo: 'modalidad_trabajo',
    ajusteHorario: 'ajuste_horario',
    ingresoMensual: 'ingreso_mensual',
    primeraExperiencia: 'primera_experiencia',
    pertinenciaCarrera: 'pertinencia_carrera',
    satisfaccionActividad: 'satisfaccion_actividad',
    plan12MesesTrabaja: 'plan_12_meses_trabaja',
    intencionBusqueda: 'intencion_busqueda',
    tiempoBusqueda: 'tiempo_busqueda',
    participadoEntrevista: 'participado_entrevista',
    factoresDificultan: 'factores_dificultan',
    experienciaPrevia: 'experiencia_previa',
    elementosEmpleabilidad: 'elementos_empleabilidad',
    competenciasFortalecer: 'competencias_fortalecer',
    tipoOportunidadInteres: 'tipo_oportunidad_interes',
    capazIdentificarTrabajo: 'capaz_identificar_trabajo',
    capazPostularEmpleo: 'capaz_postular_empleo',
    capazExplicarHabilidades: 'capaz_explicar_habilidades',
    servicioBolsaLaboral: 'servicio_bolsa_laboral',
    servicioFeriasLaborales: 'servicio_ferias_laborales',
    servicioJornadasCharlas: 'servicio_jornadas_charlas',
    servicioTalleresProgramas: 'servicio_talleres_programas',
    servicioAsesorias: 'servicio_asesorias',
    servicioCursosActualizacion: 'servicio_cursos_actualizacion',
    serviciosInteres12m: 'servicios_interes_12m'
  },

  wrapLabel(str, maxChars = 28) {
    if (!str) return '';
    if (str.length <= maxChars) return str;
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    words.forEach(w => {
      if ((cur + ' ' + w).trim().length <= maxChars) {
        cur = (cur + ' ' + w).trim();
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    });
    if (cur) lines.push(cur);
    return lines.length > 1 ? lines : lines[0];
  },

  margenErrorFinito(n, N, p = 0.5) {
    if (!n || !N || n <= 0 || N <= 1 || n >= N) return 0;
    const Z = 1.96; // 95% de confianza
    const varianza = (p * (1 - p) / n) * ((N - n) / (N - 1));
    return Z * Math.sqrt(varianza) * 100;
  },

  getStats(data = []) {
    const totalMuestra = data.length;
    if (totalMuestra === 0) {
      return {
        totalMuestra: 0,
        totalPEA: 0,
        totalTrabajadores: 0,
        totalDesocupados: 0,
        totalNoPEA: 0,
        totalNoTrabajan: 0,
        tasaEmpleabilidad: 0,
        tasaOcupacionTotal: 0,
        tasaPertinencia: 0,
        tasaSatisfaccion: 0
      };
    }

    const trabajadores = data.filter(d => (d.empleabilidad_final || '').trim() === 'Sí');
    const desocupados = data.filter(d => (d.empleabilidad_final || '').trim() === 'No');
    const inactivos = data.filter(d => !(d.empleabilidad_final || '').trim() || (d.condicion_pea || '').trim() === 'NO PEA');

    const totalTrabajadores = trabajadores.length; // 4,400 (PEA Ocupada)
    const totalDesocupados = desocupados.length; // 1,326 (PEA Desocupada / En búsqueda)
    const totalPEA = totalTrabajadores + totalDesocupados; // 5,726 (excluye los 1,507 vacíos de la columna central)
    const totalNoPEA = inactivos.length; // 1,507 (Vacíos en la columna central / Inactivos)
    const totalNoTrabajan = totalDesocupados + totalNoPEA; // 2,833 total que no trabajan

    // Nivel de Empleabilidad Oficial sobre la PEA (excluyendo vacíos / No PEA): 4400 / 5726 = 76.8%
    const tasaEmpleabilidad = totalPEA > 0 ? (totalTrabajadores / totalPEA) * 100 : 0;

    // Tasa Bruta de Ocupación Estudiantil sobre el total de la muestra: 4400 / 7233 = 60.8%
    const tasaOcupacionTotal = totalMuestra > 0 ? (totalTrabajadores / totalMuestra) * 100 : 0;

    // Pertinencia sobre trabajadores con respuesta válida
    const conPertinencia = trabajadores.filter(d => d.pertinencia_carrera && d.pertinencia_carrera !== '#N/A');
    const relacionadas = conPertinencia.filter(d => {
      const val = (d.pertinencia_carrera || '').toLowerCase();
      return val.includes('totalmente') || val.includes('parcialmente');
    }).length;
    const tasaPertinencia = conPertinencia.length > 0 ? (relacionadas / conPertinencia.length) * 100 : 0;

    // Satisfacción alta
    const conSat = trabajadores.filter(d => d.satisfaccion_actividad && d.satisfaccion_actividad !== '#N/A');
    const satPositiva = conSat.filter(d => {
      const s = (d.satisfaccion_actividad || '').toLowerCase();
      return s.includes('muy satisfecho') || s === 'satisfecho';
    }).length;
    const tasaSatisfaccion = conSat.length > 0 ? (satPositiva / conSat.length) * 100 : 0;

    return {
      totalMuestra,
      totalPEA,
      totalTrabajadores,
      totalDesocupados,
      totalNoPEA,
      totalNoTrabajan,
      tasaEmpleabilidad,
      tasaOcupacionTotal,
      tasaPertinencia,
      tasaSatisfaccion
    };
  },

  getRespuestasTrabajadores(data = []) {
    return data.filter(d => (d.empleabilidad_final || '').trim() === 'Sí');
  },

  getRespuestasNoTrabajadores(data = []) {
    return data.filter(d => (d.empleabilidad_final || '').trim() !== 'Sí');
  },

  getRespuestasPeaDesocupados(data = []) {
    return data.filter(d => (d.empleabilidad_final || '').trim() === 'No');
  },

  getRespuestasNoPEA(data = []) {
    return data.filter(d => !(d.empleabilidad_final || '').trim() || (d.condicion_pea || '').trim() === 'NO PEA');
  },

  countDistribution(data = [], field) {
    const counts = {};
    let totalValidos = 0;

    data.forEach(d => {
      const val = (d[field] || '').trim();
      if (val && val !== '#N/A' && val !== 'null' && val !== 'undefined') {
        counts[val] = (counts[val] || 0) + 1;
        totalValidos++;
      }
    });

    const entries = Object.entries(counts)
      .map(([label, count]) => ({
        label,
        count,
        percent: totalValidos > 0 ? (count / totalValidos) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalValidos,
      entries,
      labels: entries.map(e => e.label),
      counts: entries.map(e => e.count),
      percents: entries.map(e => Math.round(e.percent * 10) / 10)
    };
  },

  countMultiSelect(data = [], field, separator = '|') {
    const counts = {};
    let totalMenciones = 0;
    const respondentsWithAnswers = new Set();

    data.forEach((d, idx) => {
      const raw = (d[field] || '').trim();
      if (raw && raw !== '#N/A' && raw !== 'null') {
        const parts = raw.split(separator).map(s => s.trim()).filter(Boolean);
        if (parts.length > 0) {
          respondentsWithAnswers.add(idx);
          parts.forEach(p => {
            counts[p] = (counts[p] || 0) + 1;
            totalMenciones++;
          });
        }
      }
    });

    const totalEncuestados = respondentsWithAnswers.size || data.length || 1;

    const entries = Object.entries(counts)
      .map(([label, count]) => ({
        label,
        count,
        percentMuestra: (count / totalEncuestados) * 100,
        percentMenciones: totalMenciones > 0 ? (count / totalMenciones) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalEncuestados,
      totalMenciones,
      entries,
      labels: entries.map(e => e.label),
      counts: entries.map(e => e.count),
      percents: entries.map(e => Math.round(e.percentMuestra * 10) / 10)
    };
  },

  getEmpleabilidadPorCarrera(data = []) {
    const map = {};

    data.forEach(d => {
      const c = (d.carrera || 'Sin carrera').trim();
      if (!map[c]) {
        map[c] = {
          carrera: c,
          facultad: (window.DataLoader?.getFacultadForCarrera ? window.DataLoader.getFacultadForCarrera(c) : 'Ciencias de la Salud'),
          total: 0,
          pea: 0,
          trabajan: 0,
          desocupados: 0,
          noPea: 0
        };
      }
      map[c].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[c].trabajan++;
        map[c].pea++;
      } else if (ef === 'No') {
        map[c].desocupados++;
        map[c].pea++;
      } else {
        map[c].noPea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        tasaEmpleabilidad: item.pea > 0 ? Math.round((item.trabajan / item.pea) * 1000) / 10 : 0,
        tasaOcupacionTotal: item.total > 0 ? Math.round((item.trabajan / item.total) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.tasaEmpleabilidad - a.tasaEmpleabilidad);
  },

  getEmpleabilidadPorFacultad(data = []) {
    const map = {};

    data.forEach(d => {
      const fac = (window.DataLoader?.getFacultadForCarrera ? window.DataLoader.getFacultadForCarrera(d.carrera) : 'Ciencias de la Salud');
      if (!map[fac]) {
        map[fac] = {
          facultad: fac,
          total: 0,
          pea: 0,
          trabajan: 0,
          desocupados: 0,
          noPea: 0
        };
      }
      map[fac].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[fac].trabajan++;
        map[fac].pea++;
      } else if (ef === 'No') {
        map[fac].desocupados++;
        map[fac].pea++;
      } else {
        map[fac].noPea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        tasaEmpleabilidad: item.pea > 0 ? Math.round((item.trabajan / item.pea) * 1000) / 10 : 0,
        tasaOcupacionTotal: item.total > 0 ? Math.round((item.trabajan / item.total) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.tasaEmpleabilidad - a.tasaEmpleabilidad);
  },

  getEmpleabilidadPorCiclo(data = []) {
    const map = {};

    data.forEach(d => {
      const ciclo = parseInt(d.ciclo, 10);
      if (isNaN(ciclo)) return;
      if (!map[ciclo]) {
        map[ciclo] = {
          ciclo,
          cicloLabel: `Ciclo ${ciclo}`,
          total: 0,
          pea: 0,
          trabajan: 0,
          desocupados: 0,
          noPea: 0
        };
      }
      map[ciclo].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[ciclo].trabajan++;
        map[ciclo].pea++;
      } else if (ef === 'No') {
        map[ciclo].desocupados++;
        map[ciclo].pea++;
      } else {
        map[ciclo].noPea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        tasaEmpleabilidad: item.pea > 0 ? Math.round((item.trabajan / item.pea) * 1000) / 10 : 0,
        tasaOcupacionTotal: item.total > 0 ? Math.round((item.trabajan / item.total) * 1000) / 10 : 0
      }))
      .sort((a, b) => a.ciclo - b.ciclo);
  },

  getEmpleabilidadPorSede(data = []) {
    const map = {};

    data.forEach(d => {
      const sede = (d.sede || 'Sin sede').trim();
      if (!map[sede]) {
        map[sede] = {
          sede,
          total: 0,
          pea: 0,
          trabajan: 0,
          desocupados: 0,
          noPea: 0
        };
      }
      map[sede].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[sede].trabajan++;
        map[sede].pea++;
      } else if (ef === 'No') {
        map[sede].desocupados++;
        map[sede].pea++;
      } else {
        map[sede].noPea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        tasaEmpleabilidad: item.pea > 0 ? Math.round((item.trabajan / item.pea) * 1000) / 10 : 0,
        tasaOcupacionTotal: item.total > 0 ? Math.round((item.trabajan / item.total) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.tasaEmpleabilidad - a.tasaEmpleabilidad);
  },

  getServiciosWienerMatrix(data = []) {
    const servicios = [
      { key: 'servicio_bolsa_laboral', nombre: 'Bolsa Laboral Wiener' },
      { key: 'servicio_ferias_laborales', nombre: 'Ferias laborales' },
      { key: 'servicio_jornadas_charlas', nombre: 'Jornadas y charlas con empresas' },
      { key: 'servicio_talleres_programas', nombre: 'Talleres de empleabilidad' },
      { key: 'servicio_asesorias', nombre: 'Asesorías personalizadas' },
      { key: 'servicio_cursos_actualizacion', nombre: 'Cursos de actualización' }
    ];

    const results = [];

    servicios.forEach(s => {
      let noConoce = 0;
      let conoceNoUso = 0;
      let uso = 0;
      let total = 0;

      data.forEach(d => {
        const val = (d[s.key] || '').trim();
        if (val) {
          total++;
          if (val.includes('No lo conozco')) noConoce++;
          else if (val.includes('Lo conozco, no lo he usado')) conoceNoUso++;
          else if (val.includes('Lo he usado')) uso++;
        }
      });

      if (total === 0) total = 1;

      results.push({
        nombre: s.nombre,
        servicio: s.nombre,
        noConoce,
        conoceNoUso,
        uso,
        total,
        pctNoConoce: Math.round((noConoce / total) * 1000) / 10,
        pctConoceNoUso: Math.round((conoceNoUso / total) * 1000) / 10,
        pctConoce: Math.round((conoceNoUso / total) * 1000) / 10,
        pctUso: Math.round((uso / total) * 1000) / 10,
        pctUtilizado: Math.round((uso / total) * 1000) / 10
      });
    });

    return results;
  },

  getAutoeficaciaScores(data = []) {
    const items = [
      { key: 'capaz_identificar_trabajo', label: 'Identificar tipo de trabajo o área deseada' },
      { key: 'capaz_postular_empleo', label: 'Buscar y postular a práctica o empleo' },
      { key: 'capaz_explicar_habilidades', label: 'Explicar habilidades en entrevista' }
    ];

    return items.map(item => {
      const dist = this.countDistribution(data, item.key);
      const total = dist.totalValidos || 1;

      let muyCapaz = 0;
      let bastanteCapaz = 0;
      let medianamente = 0;
      let pocoNada = 0;

      data.forEach(d => {
        const v = (d[item.key] || '').trim().toLowerCase();
        if (v.includes('muy')) muyCapaz++;
        else if (v.includes('bastante')) bastanteCapaz++;
        else if (v.includes('medianamente')) medianamente++;
        else if (v.includes('poco') || v.includes('nada')) pocoNada++;
      });

      const altaEficacia = muyCapaz + bastanteCapaz;

      return {
        label: item.label,
        aspecto: item.label,
        total,
        muyCapaz,
        bastanteCapaz,
        medianamente,
        pocoNada,
        altaEficacia,
        pctAltaEficacia: Math.round((altaEficacia / total) * 1000) / 10
      };
    });
  },

  getActividadRemuneradaPorCarrera(data = []) {
    const map = {};

    data.forEach(d => {
      const c = (d.carrera || 'Sin carrera').trim();
      if (!map[c]) {
        map[c] = {
          carrera: c,
          facultad: (window.DataLoader?.getFacultadForCarrera ? window.DataLoader.getFacultadForCarrera(c) : 'Ciencias de la Salud'),
          total: 0,
          pea: 0,
          ocupados: 0,
          remunerados: 0,
          noRemunerados: 0,
          noEspecifica: 0
        };
      }
      map[c].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[c].ocupados++;
        map[c].pea++;
        const act = (d.actividad_remunerada || '').trim();
        if (act === 'Sí') map[c].remunerados++;
        else if (act === 'No') map[c].noRemunerados++;
        else map[c].noEspecifica++;
      } else if (ef === 'No') {
        map[c].pea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        sinRemuneracionOFormativa: item.ocupados - item.remunerados,
        tasaRemuneradaOcupados: item.ocupados > 0 ? Math.round((item.remunerados / item.ocupados) * 1000) / 10 : 0,
        tasaRemuneradaPea: item.pea > 0 ? Math.round((item.remunerados / item.pea) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.tasaRemuneradaOcupados - a.tasaRemuneradaOcupados);
  },

  getActividadRemuneradaPorFacultad(data = []) {
    const map = {};

    data.forEach(d => {
      const fac = (window.DataLoader?.getFacultadForCarrera ? window.DataLoader.getFacultadForCarrera(d.carrera) : 'Ciencias de la Salud');
      if (!map[fac]) {
        map[fac] = {
          facultad: fac,
          total: 0,
          pea: 0,
          ocupados: 0,
          remunerados: 0,
          noRemunerados: 0,
          noEspecifica: 0
        };
      }
      map[fac].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[fac].ocupados++;
        map[fac].pea++;
        const act = (d.actividad_remunerada || '').trim();
        if (act === 'Sí') map[fac].remunerados++;
        else if (act === 'No') map[fac].noRemunerados++;
        else map[fac].noEspecifica++;
      } else if (ef === 'No') {
        map[fac].pea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        sinRemuneracionOFormativa: item.ocupados - item.remunerados,
        tasaRemuneradaOcupados: item.ocupados > 0 ? Math.round((item.remunerados / item.ocupados) * 1000) / 10 : 0,
        tasaRemuneradaPea: item.pea > 0 ? Math.round((item.remunerados / item.pea) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.tasaRemuneradaOcupados - a.tasaRemuneradaOcupados);
  },

  getActividadRemuneradaPorCiclo(data = []) {
    const map = {};

    data.forEach(d => {
      const ciclo = parseInt(d.ciclo, 10);
      if (isNaN(ciclo)) return;
      if (!map[ciclo]) {
        map[ciclo] = {
          ciclo,
          cicloLabel: `Ciclo ${ciclo}`,
          total: 0,
          pea: 0,
          ocupados: 0,
          remunerados: 0,
          noRemunerados: 0,
          noEspecifica: 0
        };
      }
      map[ciclo].total++;
      const ef = (d.empleabilidad_final || '').trim();
      if (ef === 'Sí') {
        map[ciclo].ocupados++;
        map[ciclo].pea++;
        const act = (d.actividad_remunerada || '').trim();
        if (act === 'Sí') map[ciclo].remunerados++;
        else if (act === 'No') map[ciclo].noRemunerados++;
        else map[ciclo].noEspecifica++;
      } else if (ef === 'No') {
        map[ciclo].pea++;
      }
    });

    return Object.values(map)
      .map(item => ({
        ...item,
        sinRemuneracionOFormativa: item.ocupados - item.remunerados,
        tasaRemuneradaOcupados: item.ocupados > 0 ? Math.round((item.remunerados / item.ocupados) * 1000) / 10 : 0,
        tasaRemuneradaPea: item.pea > 0 ? Math.round((item.remunerados / item.pea) * 1000) / 10 : 0
      }))
      .sort((a, b) => a.ciclo - b.ciclo);
  }
};

window.Calculations = Calculations;
