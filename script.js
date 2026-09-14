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

  // 3. Controle Dinâmico das Abas e Carrosséis Horizontais dos 4 Pilares
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const horizontalCarouselInstances = {};

  const initHorizontalSolutionsCarousels = () => {
    tabPanes.forEach(pane => {
      const carousel = pane.querySelector('.horizontal-carousel');
      if (!carousel) return;

      const track = carousel.querySelector('.horizontal-carousel-track');
      if (!track) return;

      const cards = Array.from(track.querySelectorAll('.solution-card'));
      const prevBtn = pane.querySelector('.horizontal-nav-btn.prev-btn');
      const nextBtn = pane.querySelector('.horizontal-nav-btn.next-btn');

      if (cards.length === 0) return;

      let currentIndex = 0;
      let isPointerDown = false;
      let hasDragged = false;
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let activePointerId = null;
      let dragStartTranslate = 0;

      const getGap = () => 24;

      const getMaxIndex = () => {
        const cardW = cards[0].offsetWidth || 360;
        const gap = getGap();
        const containerW = carousel.offsetWidth;
        const visibleCount = Math.max(1, Math.floor((containerW + gap * 0.5) / (cardW + gap)));
        return Math.max(0, cards.length - visibleCount);
      };

      const update = (animate = true) => {
        if (cards.length === 0) return;
        const cardW = cards[0].offsetWidth || 360;
        const gap = getGap();
        const maxIndex = getMaxIndex();

        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        const offset = currentIndex * (cardW + gap);

        track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;

        if (prevBtn) {
          const isAtStart = currentIndex <= 0;
          prevBtn.disabled = isAtStart;
          prevBtn.classList.toggle('is-disabled', isAtStart);
        }
        if (nextBtn) {
          const isAtEnd = currentIndex >= maxIndex;
          nextBtn.disabled = isAtEnd;
          nextBtn.classList.toggle('is-disabled', isAtEnd);
        }
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentIndex > 0) {
            currentIndex--;
            update(true);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const maxIndex = getMaxIndex();
          if (currentIndex < maxIndex) {
            currentIndex++;
            update(true);
          }
        });
      }

      // Prevenir drag nativo do navegador e seleção de texto
      carousel.addEventListener('dragstart', (e) => e.preventDefault());
      carousel.addEventListener('selectstart', (e) => e.preventDefault());

      // Gestos de Ponteiro com Pointer Events (elimina grude no cursor)
      const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isPointerDown = true;
        hasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        currentX = e.clientX;
        activePointerId = e.pointerId;

        const cardW = cards[0].offsetWidth || 360;
        const gap = getGap();
        dragStartTranslate = -currentIndex * (cardW + gap);

        try {
          carousel.setPointerCapture(e.pointerId);
        } catch (err) {}
      };

      const onPointerMove = (e) => {
        if (!isPointerDown || (activePointerId !== null && e.pointerId !== activePointerId)) return;

        currentX = e.clientX;
        const deltaX = currentX - startX;
        const deltaY = e.clientY - startY;

        if (!hasDragged) {
          if (Math.hypot(deltaX, deltaY) > 8) {
            hasDragged = true;
            carousel.classList.add('is-dragging');
          }
        }

        if (hasDragged) {
          if (e.cancelable) e.preventDefault();
          const cardW = cards[0].offsetWidth || 360;
          const gap = getGap();
          const maxIndex = getMaxIndex();
          const maxNegativeOffset = -maxIndex * (cardW + gap);

          let currentTranslate = dragStartTranslate + deltaX;

          // Efeito de amortecimento elástico nas extremidades
          if (currentTranslate > 0) {
            currentTranslate = deltaX * 0.25;
          } else if (currentTranslate < maxNegativeOffset) {
            const overScroll = currentTranslate - maxNegativeOffset;
            currentTranslate = maxNegativeOffset + overScroll * 0.25;
          }

          track.style.transition = 'none';
          track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        }
      };

      const onPointerUp = (e) => {
        if (!isPointerDown) return;
        if (activePointerId !== null && e.pointerId !== activePointerId) return;

        isPointerDown = false;
        carousel.classList.remove('is-dragging');

        try {
          if (carousel.hasPointerCapture(e.pointerId)) {
            carousel.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}

        activePointerId = null;

        if (hasDragged) {
          const deltaX = currentX - startX;
          const maxIndex = getMaxIndex();

          if (deltaX < -45) {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
          } else if (deltaX > 45) {
            currentIndex = Math.max(0, currentIndex - 1);
          }
          update(true);
        }
      };

      const onPointerCancel = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        carousel.classList.remove('is-dragging');
        activePointerId = null;
        update(true);
      };

      carousel.addEventListener('pointerdown', onPointerDown);
      carousel.addEventListener('pointermove', onPointerMove);
      carousel.addEventListener('pointerup', onPointerUp);
      carousel.addEventListener('pointercancel', onPointerCancel);
      carousel.addEventListener('lostpointercapture', onPointerCancel);

      // Prevenir disparo acidental de cliques ao arrastar
      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
      });

      // Salva referência do carrossel da aba
      const tabKey = pane.id.replace('panel-', '');
      horizontalCarouselInstances[tabKey] = {
        update,
        reset: () => {
          currentIndex = 0;
          update(false);
        }
      };

      // Se a aba estiver inicialmente visível, atualiza
      if (pane.classList.contains('active')) {
        update(false);
      }
    });
  };

  const switchTab = (targetKey) => {
    if (!targetKey) return;

    tabButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-target') === targetKey;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      const isMatch = pane.id === `panel-${targetKey}`;
      pane.classList.toggle('active', isMatch);
    });

    // Quando a aba se torna visível, recalcula as dimensões do carrossel dela
    requestAnimationFrame(() => {
      if (horizontalCarouselInstances[targetKey]) {
        horizontalCarouselInstances[targetKey].update(false);
      }
    });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchTab(target);
    });
  });

  initHorizontalSolutionsCarousels();

  // Recalcular carrosséis horizontais ao redimensionar a janela
  let horizResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(horizResizeTimer);
    horizResizeTimer = setTimeout(() => {
      Object.values(horizontalCarouselInstances).forEach(inst => inst.update(false));
    }, 100);
  });

  // Interceptar cliques em links que apontam para #softwares ou #solucoes
  document.querySelectorAll('a[href="#softwares"]').forEach(link => {
    link.addEventListener('click', () => {
      switchTab('tecnologia');
    });
  });

  document.querySelectorAll('a[href="#solucoes"]').forEach(link => {
    link.addEventListener('click', () => {
      // Se já estiver em tecnologia, pode manter ou alternar conforme clique
    });
  });

  // Ativação baseada no hash da URL
  const handleHashChange = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#softwares' || hash === '#tecnologia') {
      switchTab('tecnologia');
    } else if (hash === '#educacao') {
      switchTab('educacao');
    } else if (hash === '#consultoria') {
      switchTab('consultoria');
    } else if (hash === '#mentoria') {
      switchTab('mentoria');
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  // 4. Modal de Iniciar Projeto / Solicitar Trial
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

  // 5. Seleção de Chips no Formulário (Seleção única focada)
  const chipButtons = document.querySelectorAll('.chip-btn');
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      chipButtons.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // 6. Envio do Formulário com Feedback
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Enviando proposta...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Solicitação Enviada com Sucesso!';
        submitBtn.style.backgroundColor = '#007d48'; // Success token do DESIGN.md
        
        setTimeout(() => {
          projectForm.reset();
          chipButtons.forEach((c, idx) => c.classList.toggle('selected', idx === 0));
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
          closeModal();
        }, 1500);
      }, 1000);
    });
  }

  // 7. Carrossel em Arco Cinético Estilo Google Labs (Seção Cases)
  const initCasesArcCarousel = () => {
    const carousel = document.getElementById('casesLabsCarousel');
    if (!carousel) return;

    const viewport = document.getElementById('casesArcViewport');
    const track = document.getElementById('casesArcTrack');
    const cards = Array.from(track.querySelectorAll('.case-arc-card'));
    const prevBtn = document.getElementById('casesPrevBtn');
    const nextBtn = document.getElementById('casesNextBtn');
    const dotsContainer = document.getElementById('casesDots');
    const heroIndexNumber = document.querySelector('.hero-index-indicator .index-val');

    const total = cards.length;
    if (total === 0) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    // Criar os indicadores (dots)
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir para o case ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToIndex(idx);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Parâmetros responsivos do arco
    const getArcConfig = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        return {
          cardSpacing: 250,
          angleMultiplier: 6.2,
          curveDrop: 22,
          rotYMultiplier: 2.5
        };
      } else if (width <= 768) {
        return {
          cardSpacing: 280,
          angleMultiplier: 6.8,
          curveDrop: 25,
          rotYMultiplier: 3.0
        };
      } else if (width <= 1100) {
        return {
          cardSpacing: 320,
          angleMultiplier: 7.2,
          curveDrop: 26,
          rotYMultiplier: 3.5
        };
      } else {
        return {
          cardSpacing: 350,
          angleMultiplier: 7.5,
          curveDrop: 28,
          rotYMultiplier: 4.0
        };
      }
    };

    // Renderizar posições de cada card ao longo do arco
    const renderCards = (positionFloat) => {
      const config = getArcConfig();

      cards.forEach((card, idx) => {
        // Distância circular do card em relação ao centro (com menor caminho em loop)
        let diff = idx - positionFloat;
        let d = ((diff % total) + total) % total;
        if (d > total / 2) {
          d -= total;
        }

        const absD = Math.abs(d);

        // Coordenadas matemáticas do arco
        const x = d * config.cardSpacing;
        const y = Math.pow(absD, 1.85) * config.curveDrop;
        const rotZ = d * config.angleMultiplier;
        const rotY = -d * config.rotYMultiplier;
        const scale = Math.max(0.72, 1 - absD * 0.055);
        
        // Opacidade e visibilidade progressiva
        let opacity = 1;
        if (absD > 1.8) {
          opacity = Math.max(0, 1 - (absD - 1.8) * 0.9);
        }

        // Z-Index hierárquico
        const zIndex = Math.round(50 - absD * 10);

        // Aplicação das transformações aceleradas por GPU
        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.visibility = opacity <= 0.02 ? 'hidden' : 'visible';
        card.style.pointerEvents = opacity <= 0.2 ? 'none' : 'auto';

        const isActive = Math.round(positionFloat) === idx;
        card.classList.toggle('is-active', isActive);
      });

      // Atualizar dots
      const activeIntIndex = ((Math.round(positionFloat) % total) + total) % total;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIntIndex);
        });
      }

      // Atualizar indicador dinâmico no Hero se existir
      if (heroIndexNumber) {
        heroIndexNumber.innerText = `0${activeIntIndex + 1}`;
      }
    };

    // Transição suave para um índice específico
    const goToIndex = (targetIdx) => {
      currentIndex = ((targetIdx % total) + total) % total;
      renderCards(currentIndex);
    };

    const nextCard = () => {
      goToIndex(currentIndex + 1);
    };

    const prevCard = () => {
      goToIndex(currentIndex - 1);
    };

    // Listeners dos botões de navegação
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevCard();
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextCard();
        resetAutoPlay();
      });
    }

    // Prevenir comportamento padrão de arrasto de imagens e seleção de texto do navegador
    viewport.addEventListener('dragstart', (e) => e.preventDefault());
    viewport.addEventListener('selectstart', (e) => e.preventDefault());
    carousel.addEventListener('dragstart', (e) => e.preventDefault());

    let isPointerDown = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let startTime = 0;
    let activePointerId = null;

    // Gestos Unificados de Alta Precisão (Pointer Events)
    const onPointerDown = (e) => {
      // Aceita apenas o botão principal do mouse (botão esquerdo) ou touch
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      currentX = e.clientX;
      startTime = performance.now();
      activePointerId = e.pointerId;

      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}

      clearInterval(autoPlayTimer);
    };

    const onPointerMove = (e) => {
      if (!isPointerDown) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      currentX = e.clientX;
      const deltaX = currentX - startX;
      const deltaY = e.clientY - startY;

      // Limite mínimo de 7px para diferenciar clique sutil de intenção real de arrastar
      if (!hasDragged) {
        if (Math.hypot(deltaX, deltaY) > 7) {
          hasDragged = true;
          viewport.classList.add('is-dragging');
        }
      }

      if (hasDragged) {
        if (e.cancelable) e.preventDefault();
        const config = getArcConfig();
        const dragOffsetIndex = -deltaX / config.cardSpacing;
        renderCards(currentIndex + dragOffsetIndex);
      }
    };

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      isPointerDown = false;
      viewport.classList.remove('is-dragging');

      try {
        if (viewport.hasPointerCapture(e.pointerId)) {
          viewport.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      activePointerId = null;

      if (hasDragged) {
        const deltaX = currentX - startX;
        const config = getArcConfig();
        const elapsed = Math.max(1, performance.now() - startTime);
        const velocity = deltaX / elapsed; // px por milissegundo

        let steps = 0;
        // Resposta a flick (movimento rápido)
        if (Math.abs(velocity) > 0.38) {
          steps = velocity > 0 ? -1 : 1;
        } else {
          // Deslocamento proporcional à distância
          steps = Math.round(-deltaX / (config.cardSpacing * 0.42));
        }

        if (steps !== 0) {
          goToIndex(currentIndex + steps);
        } else {
          goToIndex(currentIndex);
        }
      }

      resetAutoPlay();
    };

    const onPointerCancel = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      viewport.classList.remove('is-dragging');
      activePointerId = null;
      goToIndex(currentIndex);
      resetAutoPlay();
    };

    // Listeners diretos de Pointer Events no viewport
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerCancel);
    viewport.addEventListener('lostpointercapture', onPointerCancel);

    // Salvaguarda total: caso a janela perca foco (ex: Alt+Tab, sair da tela)
    window.addEventListener('blur', () => {
      if (isPointerDown) {
        isPointerDown = false;
        viewport.classList.remove('is-dragging');
        activePointerId = null;
        goToIndex(currentIndex);
      }
    });

    // Clique em cards para centralizar se não for o ativo
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        // Se houve arraste, cancela o clique para não abrir modal acidentalmente
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        let diff = idx - currentIndex;
        let d = ((diff % total) + total) % total;
        if (d > total / 2) d -= total;

        // Se o card clicado não estiver no centro, foca nele
        if (Math.abs(d) > 0.3) {
          e.preventDefault();
          e.stopPropagation();
          goToIndex(currentIndex + Math.sign(d));
          resetAutoPlay();
        }
      });
    });

    // Navegação por Teclado (Acessibilidade)
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
        resetAutoPlay();
      }
    });

    // Ajuste dinâmico ao redimensionar a janela
    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        renderCards(currentIndex);
      }, 100);
    });

    // Autoplay dinâmico que pausa em hover
    const startAutoPlay = () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        nextCard();
      }, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carousel.addEventListener('mouseleave', () => startAutoPlay());

    // Inicialização do Carrossel
    renderCards(0);
    startAutoPlay();
  };

  initCasesArcCarousel();

  // 8. Navegação suave ao clicar nos links do menu
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
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
