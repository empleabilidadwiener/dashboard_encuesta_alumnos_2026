// js/dataLoader.js — Cargador y procesador de datos para Encuesta a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

window.toTitleCase = function(str) {
  if (!str || typeof str !== 'string') return str || '';
  const lowerWords = new Set(['de', 'del', 'y', 'en', 'e', 'a', 'con', 'por', 'o', 'u', 'para', 'al', 'la', 'el', 'los', 'las']);
  const acronyms = new Set(['unw', 'sunedu', 'pea', 'nps', 'ti', 'qa', 'dba', 'cas', 'serums', 'acbsp', 'ocde', 'nid', 'atc', 'rrhh']);

  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      const cleanWord = word.replace(/[^\wáéíóúüñ]/gi, '');
      if (acronyms.has(cleanWord)) return word.toUpperCase();
      if (index > 0 && lowerWords.has(cleanWord)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

const DataLoader = {
  toTitleCase: window.toTitleCase,
  encuestas: null,
  universo: null,
  isLoaded: false,

  async loadDataFromFiles(encFile, uniFile) {
    try {
      const [encBuffer, uniBuffer] = await Promise.all([
        this.readFileAsArrayBuffer(encFile),
        this.readFileAsArrayBuffer(uniFile)
      ]);

      const encWorkbook = XLSX.read(encBuffer, { type: 'array', raw: true, FS: ';' });
      const uniWorkbook = XLSX.read(uniBuffer, { type: 'array', raw: true, FS: ';' });

      const rawEncuestas = XLSX.utils.sheet_to_json(encWorkbook.Sheets[encWorkbook.SheetNames[0]]);
      const rawUniverso = XLSX.utils.sheet_to_json(uniWorkbook.Sheets[uniWorkbook.SheetNames[0]]);

      this.encuestas = this.sanitizeNullBytes(rawEncuestas);
      this.universo = rawUniverso;
      this.isLoaded = true;

      return { encuestas: this.encuestas, universo: this.universo };
    } catch (error) {
      console.error('Error procesando archivos:', error);
      throw error;
    }
  },

  async loadDefaultData() {
    try {
      const [encResp, uniResp] = await Promise.all([
        fetch('data/encuesta_alumnos.csv?v=' + Date.now()),
        fetch('data/universo_alumnos.csv?v=' + Date.now())
      ]);

      if (!encResp.ok || !uniResp.ok) {
        throw new Error('No se encontraron los archivos CSV en data/');
      }

      const [encBuf, uniBuf] = await Promise.all([
        encResp.arrayBuffer(),
        uniResp.arrayBuffer()
      ]);

      const encWb = XLSX.read(encBuf, { type: 'array', raw: true, FS: ';' });
      const uniWb = XLSX.read(uniBuf, { type: 'array', raw: true, FS: ';' });

      const rawEnc = XLSX.utils.sheet_to_json(encWb.Sheets[encWb.SheetNames[0]]);
      const rawUni = XLSX.utils.sheet_to_json(uniWb.Sheets[uniWb.SheetNames[0]]);

      this.encuestas = this.sanitizeNullBytes(rawEnc);
      this.universo = this.sanitizeUniverso(rawUni);
      this.isLoaded = true;

      return { encuestas: this.encuestas, universo: this.universo };
    } catch (error) {
      console.error('Error cargando datos por defecto:', error);
      throw error;
    }
  },

  sanitizeNullBytes(data) {
    return data.map(row => {
      const cleaned = {};
      for (const [key, value] of Object.entries(row)) {
        const cleanKey = key.replace(/^\uFEFF/, '').trim();
        cleaned[cleanKey] = typeof value === 'string'
          ? value.replace(/_x0000_/g, '').replace(/\u0000/g, '').trim()
          : value;
      }
      return cleaned;
    });
  },

  sanitizeUniverso(data) {
    return data.map(row => {
      const cleaned = {};
      for (const [key, value] of Object.entries(row)) {
        const cleanKey = key.replace(/^\uFEFF/, '').trim();
        cleaned[cleanKey] = typeof value === 'string'
          ? value.replace(/_x0000_/g, '').replace(/\u0000/g, '').trim()
          : value;
      }
      cleaned.universo = parseInt(cleaned.universo, 10) || 0;
      cleaned.muestra = parseInt(cleaned.muestra, 10) || 0;
      let rep = parseFloat(cleaned.representatividad) || 0;
      if (rep > 0 && rep <= 1) rep = rep * 100;
      cleaned.representatividad = Math.round(rep * 10) / 10;
      return cleaned;
    });
  },

  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Error leyendo archivo: ' + file.name));
      reader.readAsArrayBuffer(file);
    });
  },

  getEncuestas() {
    return this.encuestas || [];
  },

  getUniverso() {
    return this.universo || [];
  },

  getFilteredData(filters = {}) {
    let data = this.encuestas || [];

    if (filters.facultad && filters.facultad !== 'Todas') {
      data = data.filter(r => this.getFacultadForCarrera(r.carrera) === filters.facultad);
    }
    if (filters.carrera && filters.carrera !== 'Todas') {
      const target = (filters.carrera || '').toUpperCase().trim();
      data = data.filter(r => (r.carrera || '').toUpperCase().trim() === target);
    }
    if (filters.ciclo && filters.ciclo !== 'Todos') {
      const targetCiclo = String(filters.ciclo).trim();
      data = data.filter(r => String(r.ciclo).trim() === targetCiclo);
    }
    if (filters.sede && filters.sede !== 'Todas') {
      const targetSede = (filters.sede || '').toUpperCase().trim();
      data = data.filter(r => (r.sede || '').toUpperCase().trim() === targetSede);
    }

    return data;
  },

  getFilteredUniverso(filters = {}) {
    let data = this.universo || [];
    return data;
  },

  getFacultades() {
    return [
      'Ciencias de la Salud',
      'Negocios',
      'Ingeniería',
      'Derecho y Ciencia Política'
    ];
  },

  getCarreras(facultad = 'Todas') {
    if (!this.encuestas) return [];
    let list = [...new Set(this.encuestas.map(e => e.carrera).filter(Boolean))];
    if (facultad && facultad !== 'Todas') {
      list = list.filter(c => this.getFacultadForCarrera(c) === facultad);
    }
    return list.sort((a, b) => a.localeCompare(b, 'es'));
  },

  getCiclos() {
    if (!this.encuestas) return [];
    const ciclos = new Set();
    this.encuestas.forEach(e => {
      if (e.ciclo !== undefined && e.ciclo !== null && String(e.ciclo).trim() !== '') {
        const num = parseInt(e.ciclo, 10);
        if (!isNaN(num)) ciclos.add(num);
      }
    });
    return [...ciclos].sort((a, b) => a - b).map(String);
  },

  getSedes() {
    if (!this.encuestas) return ['Lima Centro', 'Lima Norte', 'Virtual'];
    const sedes = [...new Set(this.encuestas.map(e => e.sede).filter(Boolean))];
    return sedes.sort();
  },

  getFacultadForCarrera(carrera) {
    const upper = String(carrera || '').toUpperCase().trim();

    // Ciencias de la Salud
    if (
      upper.includes('MEDICINA') ||
      upper.includes('ENFERMERÍA') || upper.includes('ENFERMERIA') ||
      upper.includes('ODONTOLOGÍA') || upper.includes('ODONTOLOGIA') ||
      upper.includes('PSICOLOGÍA') || upper.includes('PSICOLOGIA') ||
      upper.includes('FARMACIA') || upper.includes('BIOQUÍMICA') || upper.includes('BIOQUIMICA') ||
      upper.includes('OBSTETRICIA') ||
      upper.includes('NUTRICIÓN') || upper.includes('NUTRICION') ||
      upper.includes('TERAPIA') ||
      upper.includes('LABORATORIO') ||
      upper.includes('VETERINARIA')
    ) {
      return 'Ciencias de la Salud';
    }

    // Negocios / Ciencias Empresariales
    if (
      upper.includes('ADMINISTRACIÓN') || upper.includes('ADMINISTRACION') ||
      upper.includes('CONTABILIDAD') ||
      upper.includes('TURISMO') ||
      upper.includes('MARKETING')
    ) {
      return 'Negocios';
    }

    // Ingeniería y Arquitectura
    if (
      upper.includes('INGENIERÍA') || upper.includes('INGENIERIA') ||
      upper.includes('ARQUITECTURA')
    ) {
      return 'Ingeniería';
    }

    // Derecho y Humanidades / Comunicación
    if (
      upper.includes('DERECHO') ||
      upper.includes('COMUNICACIÓN') || upper.includes('COMUNICACION')
    ) {
      return 'Derecho y Ciencia Política';
    }

    return 'Ciencias de la Salud';
  }
};

window.DataLoader = DataLoader;
