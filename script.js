/* =========================================================================
   MESTRE DOS KITS — script.js
   JavaScript puro (sem bibliotecas). Organizado por funcionalidade:
   1. Links de contato (editar aqui)
   2. Menu mobile
   3. Header: efeito ao rolar
   4. Scroll suave (fallback)
   5. Animações de entrada (reveal on scroll)
   6. Fallback de imagens de produto (placeholder amigável)
   7. Modal de produto
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. LINKS DE CONTATO ----------
     Substitua pelos links reais quando estiverem disponíveis. */
  const WHATSAPP_URL = "#";
  const INSTAGRAM_URL = "#";

  const whatsappLinks = document.querySelectorAll('#whatsappBtn, #footerWhatsapp');
  const instagramLinks = document.querySelectorAll('#instagramBtn, #footerInstagram');
  const contactBtn = document.getElementById('contactBtn');

  whatsappLinks.forEach(function (link) { link.href = WHATSAPP_URL; });
  instagramLinks.forEach(function (link) { link.href = INSTAGRAM_URL; });
  if (contactBtn) {
    contactBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const contatoSection = document.getElementById('contato');
      if (contatoSection) contatoSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- 2. MENU MOBILE ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileMenu() {
    mobileNav.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    mobileNav.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  }

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  /* ---------- 3. HEADER: EFEITO AO ROLAR ---------- */
  const siteHeader = document.getElementById('siteHeader');
  const SCROLL_THRESHOLD = 24;

  function updateHeaderState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }

  if (siteHeader) {
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* ---------- 4. SCROLL SUAVE (fallback para navegadores antigos) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 5. ANIMAÇÕES DE ENTRADA (reveal on scroll) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 6. FALLBACK DE IMAGENS DE PRODUTO ----------
     Enquanto as imagens reais não são adicionadas à pasta do projeto,
     mostramos um placeholder elegante com o nome do arquivo esperado
     em vez do ícone de imagem quebrada. Quando o arquivo real existir,
     ele carrega normalmente e o placeholder some sozinho. */
  document.querySelectorAll('.product-media img, .offer-card-media img').forEach(function (img) {
    img.addEventListener('error', function () {
      const wrapper = img.closest('.product-media, .offer-card-media');
      if (wrapper) wrapper.classList.add('img-fallback');
    }, { once: true });
  });

  /* ---------- 7. MODAL DE PRODUTO ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
  const modalMedia = document.getElementById('modalMedia');
  const modalName = document.getElementById('modalName');
  const modalDesc = document.getElementById('modalDesc');
  const modalOldPrice = document.getElementById('modalOldPrice');
  const modalNewPrice = document.getElementById('modalNewPrice');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalInterest = document.getElementById('modalInterest');

  let lastFocusedElement = null;

  function openProductModal(card) {
    const name = card.dataset.name || '';
    const desc = card.dataset.desc || '';
    const price = card.dataset.price || '';
    const oldPrice = card.dataset.oldPrice || '';
    const image = card.dataset.image || '';

    modalName.textContent = name;
    modalDesc.textContent = desc;
    modalNewPrice.textContent = price;

    if (oldPrice) {
      modalOldPrice.textContent = oldPrice;
      modalOldPrice.style.display = '';
    } else {
      modalOldPrice.textContent = '';
      modalOldPrice.style.display = 'none';
    }

    modalMedia.classList.remove('img-fallback');
    modalMedia.setAttribute('data-fallback-label', image);
    modalImage.src = image;
    modalImage.alt = name;
    modalImage.style.display = '';
    modalImage.onerror = function () {
      modalMedia.classList.add('img-fallback');
    };

    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();

    document.addEventListener('keydown', handleModalKeydown);
  }

  function closeProductModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeydown);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function handleModalKeydown(e) {
    if (e.key === 'Escape') {
      closeProductModal();
    }
  }

  document.querySelectorAll('.product-card').forEach(function (card) {
    const detailsBtn = card.querySelector('.btn-details');
    const interestBtn = card.querySelector('.btn-interest');

    if (detailsBtn) {
      detailsBtn.addEventListener('click', function () { openProductModal(card); });
    }
    if (interestBtn) {
      interestBtn.addEventListener('click', function () {
        const contatoSection = document.getElementById('contato');
        if (contatoSection) contatoSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (modalInterest) {
    modalInterest.addEventListener('click', function () {
      closeProductModal();
      const contatoSection = document.getElementById('contato');
      if (contatoSection) contatoSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeProductModal();
    });
  }

});