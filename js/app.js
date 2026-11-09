// js/app.js — Router y controlador principal para Encuesta a Estudiantes 2026
// Universidad Norbert Wiener — Dirección de Desarrollo Profesional y Alumni

import { loadResumenPage } from './pages/resumen.js?v=20261109_rg_remun_v4';
import { loadEmpleabilidadPage } from './pages/empleabilidad.js?v=20261109_rg_remun_v4';
import { loadPerfilNoTrabajaPage } from './pages/perfil-no-trabaja.js?v=20261109_rg_remun_v4';
import { loadResultadosGeneralesPage } from './pages/resultados-generales.js?v=20261109_rg_remun_v4';
import { loadResultadosEncuestaPage } from './pages/resultados-encuesta.js?v=20261109_rg_remun_v4';
import { loadRepresentatividadPage } from './pages/representatividad.js?v=20261109_rg_remun_v4';
import { loadVisorDatosPage } from './pages/visor-datos.js?v=20261109_rg_remun_v4';

const App = {
  currentPage: 'resumen',
  filters: {
    facultad: 'Todas',
    carrera: 'Todas',
    ciclo: 'Todos',
    sede: 'Todas'
  },
  encFile: null,
  uniFile: null,

  init() {
    this.setupSidebarToggle();
    this.setupNavigation();
    this.setupFilters();
    this.tryLoadDefaultData();
  },

  setupSidebarToggle() {
    const appContainer = document.querySelector('.app-container') || document.body;
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const expandBtn = document.getElementById('sidebar-expand-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = (forceState) => {
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');
        return;
      }

      const shouldCollapse = forceState !== undefined
        ? forceState
        : !appContainer.classList.contains('sidebar-collapsed');

      if (shouldCollapse) {
        appContainer.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', 'true');
      } else {
        appContainer.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', 'false');
      }

      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
    };

    collapseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar(true);
    });

    expandBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar(false);
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        const activeEl = document.activeElement;
        if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) return;
        e.preventDefault();
        toggleSidebar();
      }
    });

    const mobileToggle = document.getElementById('mobile-btn-menu');
    const bottomMenuToggle = document.getElementById('bottom-menu-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-mobile-close-btn');

    const openSidebar = () => {
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
    };

    const closeSidebar = () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
    };

    mobileToggle?.addEventListener('click', () => sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
    bottomMenuToggle?.addEventListener('click', () => sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
    sidebarCloseBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    // Modal Instrumento
    const mobileBtnInstrumento = document.getElementById('mobile-btn-instrumento');
    const btnCerrarInstrumento = document.getElementById('btn-cerrar-instrumento-global');
    const btnCerrarInstrumentoFooter = document.getElementById('btn-cerrar-instrumento-global-footer');
    const backdropInstrumento = document.getElementById('instrumento-modal-backdrop');
    const modalInstrumento = document.getElementById('global-modal-instrumento');

    window.abrirModalInstrumento = () => {
      if (modalInstrumento) {
        modalInstrumento.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    };

    window.cerrarModalInstrumento = () => {
      if (modalInstrumento) {
        modalInstrumento.style.display = 'none';
        document.body.style.overflow = '';
      }
    };

    mobileBtnInstrumento?.addEventListener('click', window.abrirModalInstrumento);
    btnCerrarInstrumento?.addEventListener('click', window.cerrarModalInstrumento);
    btnCerrarInstrumentoFooter?.addEventListener('click', window.cerrarModalInstrumento);
    backdropInstrumento?.addEventListener('click', window.cerrarModalInstrumento);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalInstrumento && modalInstrumento.style.display !== 'none') {
        window.cerrarModalInstrumento();
      }
    });
  },

  async tryLoadDefaultData() {
    const loadError = document.getElementById('load-error');
    const loading = document.getElementById('loading');
    const filtersBar = document.getElementById('filters-bar');

    if (loadError) loadError.classList.add('hidden');
    if (loading) loading.classList.remove('hidden');

    try {
      await DataLoader.loadDefaultData();
      this.populateFilters();
      if (loadError) loadError.classList.add('hidden');
      if (loading) loading.classList.add('hidden');
      if (filtersBar) filtersBar.classList.add('hidden');
      this.navigateTo(this.currentPage);
    } catch (error) {
      console.error('No se pudieron cargar los datos por defecto:', error);
      if (loading) loading.classList.add('hidden');
      if (loadError) loadError.classList.remove('hidden');
    }
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page && DataLoader.isLoaded) this.navigateTo(page);
      });
    });

    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page && DataLoader.isLoaded) this.navigateTo(page);
      });
    });
  },

  setupFilters() {
    const facultadSelect = document.getElementById('filter-facultad');
    const carreraSelect = document.getElementById('filter-carrera');
    const cicloSelect = document.getElementById('filter-ciclo');
    const sedeSelect = document.getElementById('filter-sede');

    facultadSelect?.addEventListener('change', (e) => {
      this.filters.facultad = e.target.value;
      this.updateCarreras();
      this.applyFilters();
    });

    carreraSelect?.addEventListener('change', (e) => {
      this.filters.carrera = e.target.value;
      this.applyFilters();
    });

    cicloSelect?.addEventListener('change', (e) => {
      this.filters.ciclo = e.target.value;
      this.applyFilters();
    });

    sedeSelect?.addEventListener('change', (e) => {
      this.filters.sede = e.target.value;
      this.applyFilters();
    });
  },

  populateFilters() {
    const facultades = DataLoader.getFacultades();
    const ciclos = DataLoader.getCiclos();
    const sedes = DataLoader.getSedes();

    const facultadSelect = document.getElementById('filter-facultad');
    const carreraSelect = document.getElementById('filter-carrera');
    const cicloSelect = document.getElementById('filter-ciclo');
    const sedeSelect = document.getElementById('filter-sede');

    if (facultadSelect) {
      facultadSelect.innerHTML = '<option value="Todas">Todas las facultades</option>';
      facultades.forEach(f => {
        facultadSelect.innerHTML += `<option value="${f}">${f}</option>`;
      });
    }

    if (carreraSelect) this.updateCarreras();

    if (cicloSelect) {
      cicloSelect.innerHTML = '<option value="Todos">Todos los ciclos</option>';
      ciclos.forEach(c => {
        cicloSelect.innerHTML += `<option value="${c}">Ciclo ${c}</option>`;
      });
    }

    if (sedeSelect) {
      sedeSelect.innerHTML = '<option value="Todas">Todas las sedes</option>';
      sedes.forEach(s => {
        sedeSelect.innerHTML += `<option value="${s}">${s}</option>`;
      });
    }
  },

  updateCarreras() {
    const carreraSelect = document.getElementById('filter-carrera');
    if (!carreraSelect) return;

    const carreras = DataLoader.getCarreras(this.filters.facultad);
    carreraSelect.innerHTML = '<option value="Todas">Todas las carreras</option>';
    carreras.forEach(c => {
      const display = window.toTitleCase ? window.toTitleCase(c) : c;
      carreraSelect.innerHTML += `<option value="${c}">${display}</option>`;
    });
  },

  applyFilters() {
    this.navigateTo(this.currentPage);
  },

  getFilteredData() {
    return DataLoader.getFilteredData(this.filters);
  },

  navigateTo(page) {
    this.currentPage = page;

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === page) item.classList.add('active');
    });

    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === page) item.classList.add('active');
    });

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');

    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Cargando datos...</p></div>';
    }

    setTimeout(() => this.loadPage(page), 80);
  },

  async loadPage(page) {
    const filtersBar = document.getElementById('filters-bar');
    if (filtersBar) {
      filtersBar.classList.add('hidden');
      filtersBar.style.display = 'none';
    }

    const data = this.getFilteredData();
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    try {
      switch (page) {
        case 'resumen':
          await loadResumenPage(pageContent, data, this.filters);
          break;
        case 'empleabilidad':
          await loadEmpleabilidadPage(pageContent, data, this.filters);
          break;
        case 'perfil-no-trabaja':
          await loadPerfilNoTrabajaPage(pageContent, data, this.filters);
          break;
        case 'resultados-generales':
          await loadResultadosGeneralesPage(pageContent, data, this.filters);
          break;
        case 'resultados-encuesta':
          await loadResultadosEncuestaPage(pageContent, data, this.filters);
          break;
        case 'representatividad':
          await loadRepresentatividadPage(pageContent, data, this.filters);
          break;
        case 'visor-datos':
          await loadVisorDatosPage(pageContent, data, this.filters);
          break;
        default:
          pageContent.innerHTML = '<div class="empty-state"><i class="fas fa-file-alt"></i><h3>Página no encontrada</h3></div>';
      }

      window.scrollTo({ top: 0, behavior: 'instant' });

      if (window.Charts && typeof window.Charts.attachFullscreenButtons === 'function') {
        setTimeout(() => window.Charts.attachFullscreenButtons(), 120);
        setTimeout(() => window.Charts.attachFullscreenButtons(), 500);
      }

      if (window.Editor) {
        window.Editor.onPageChange(page);
      }
    } catch (error) {
      console.error('Error cargando página:', error);
      pageContent.innerHTML = `
        <div class="empty-state" style="padding: 40px; text-align: center;">
          <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #ef4444; margin-bottom: 12px;"></i>
          <h3>Error al cargar los datos</h3>
          <p style="color: #64748b;">${error.message || 'Ocurrió un error inesperado al procesar la vista.'}</p>
        </div>
      `;
    }
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
