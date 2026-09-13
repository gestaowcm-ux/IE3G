/**
 * IE3G Institucional - Interações & Microanimações
 * Estilo Editorial Motion Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Efeito do Header ao rolar
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Animação de contadores de métricas
  const metricValues = document.querySelectorAll('.metric-value');
  let metricsAnimated = false;

  const animateMetrics = () => {
    metricValues.forEach(el => {
      const text = el.innerText.trim();
      // Extrair números
      const match = text.match(/[\d.]+/);
      if (match) {
        const targetNumber = parseFloat(match[0]);
        const prefix = text.startsWith('+') ? '+' : (text.startsWith('R$') ? 'R$ ' : '');
        const suffix = text.includes('B+') ? 'B+' : (text.includes('%') ? '%' : '');
        
        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing: easeOutExpo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = (targetNumber * easeProgress).toFixed(targetNumber % 1 !== 0 ? 1 : 0);
          
          el.innerText = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.innerText = text; // Garante o formato original exato ao final
          }
        };

        requestAnimationFrame(updateNumber);
      }
    });
  };

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateMetrics();
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // 3. Modal de Iniciar Projeto / Fale Conosco
  const modalOverlay = document.getElementById('projectModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Seleção de Chips no Formulário
  const chipButtons = document.querySelectorAll('.chip-btn');
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // 5. Envio do Formulário com Feedback
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Enviando proposta...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Mensagem Enviada com Sucesso!';
        submitBtn.style.backgroundColor = '#007d48'; // Success token do DESIGN.md
        
        setTimeout(() => {
          projectForm.reset();
          chipButtons.forEach(c => c.classList.remove('selected'));
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
          closeModal();
        }, 1500);
      }, 1000);
    });
  }

  // 6. Atualização dinâmica do índice do Hero ao navegar pelos cases
  const heroIndexNumber = document.querySelector('.hero-index-indicator .index-val');
  const caseCards = document.querySelectorAll('.case-featured-block');
  
  caseCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      if (heroIndexNumber) {
        heroIndexNumber.innerText = `0${index + 1}`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (heroIndexNumber) {
        heroIndexNumber.innerText = `01`;
      }
    });
  });

  // 7. Navegação suave ao clicar nos links do menu
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 8. Showcase Cinético dos 18 Ícones IE3G (Passagem 100% Automática e Dinâmica)
  const heroStage = document.getElementById('heroIconsStage');
  if (heroStage) {
    const slides = heroStage.querySelectorAll('.stage-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let styleIndex = 0;
    const INTERVAL_DURATION = 3500; // 3.5 segundos por ícone

    // 5 variações cinéticas suaves que alternam a cada passagem (nunca monótono)
    const transitionStyles = [
      { out: 'drift-out', inInitial: 'drift-in-initial' }, // 1. Deslocamento lateral cinético
      { out: 'rise-out', inInitial: 'rise-in-initial' },   // 2. Elevação vertical suave
      { out: 'tilt-out', inInitial: 'tilt-in-initial' },   // 3. Rotação 3D com escala
      { out: 'zoom-out', inInitial: 'zoom-in-initial' },   // 4. Revelação focal dimensional
      { out: 'glide-out', inInitial: 'glide-in-initial' }  // 5. Deslize reverso elegante
    ];

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      const targetIndex = (currentIndex + 1) % totalSlides;
      const currentSlide = slides[currentIndex];
      const nextSlideEl = slides[targetIndex];
      const anim = transitionStyles[styleIndex % transitionStyles.length];
      styleIndex++;

      // Prepara próximo slide
      nextSlideEl.classList.add(anim.inInitial);
      nextSlideEl.classList.add('active');

      // Força reflow no navegador
      void nextSlideEl.offsetWidth;

      // Executa saída do atual e entrada do próximo
      currentSlide.classList.add(anim.out);
      nextSlideEl.classList.remove(anim.inInitial);

      setTimeout(() => {
        currentSlide.classList.remove('active', anim.out);
        isTransitioning = false;
        currentIndex = targetIndex;
      }, 750);
    };

    // Passagem 100% contínua e automática
    setInterval(nextSlide, INTERVAL_DURATION);
  }
});
