/* ============================================================
   Alex Rivera — Portfolio JavaScript
   Vanilla JS · Zero dependencies · Fast, accessible, refined
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Sticky Nav on Scroll ────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ─── 2. Mobile Navigation Toggle ───────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ─── 3. Scroll Reveal Animations ───────────────────────── */
  const revealElements = document.querySelectorAll(
    '.project-card, .skill-category-card, .timeline-item, .post-item, .about-grid > div, .deploy-banner, .contact-grid > div'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    const delay = Math.min((index % 3) + 1, 3);
    el.setAttribute('data-delay', delay);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  /* ─── 4. Active Nav Section Tracker ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchorLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -50% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─── 5. Hero Typewriter Animation ──────────────────────── */
  const sequences = [
    'npx create-next-app@latest ./web-app',
    'go test ./... -race -cover',
    'git commit -m "feat: distributed cache pipeline"',
    'kubectl rollout status deployment/nexus-api',
    'psql -c "EXPLAIN ANALYZE SELECT * FROM telemetry;"',
    'terraform apply -auto-approve'
  ];

  let seqIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typed-text');

  function type() {
    if (!typedEl) return;
    const current = sequences[seqIndex];

    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        seqIndex = (seqIndex + 1) % sequences.length;
      }
    }

    const delay = isDeleting ? 30 : 60 + Math.random() * 30;
    setTimeout(type, delay);
  }

  setTimeout(type, 800);


  /* ─── 6. Project Filter Tabs ────────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Hero tech pills filter projects
  const stackPills = document.querySelectorAll('.stack-pill');
  stackPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const tech = pill.getAttribute('data-filter').toLowerCase();
      stackPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Jump to projects
      const workSec = document.getElementById('work');
      if (workSec) workSec.scrollIntoView({ behavior: 'smooth' });

      projectCards.forEach(card => {
        const cardTech = (card.getAttribute('data-tech') || '').toLowerCase();
        if (cardTech.includes(tech)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ─── 7. Command Palette (Cmd+K / Ctrl+K) ───────────────── */
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdTriggerBtn = document.getElementById('cmdTriggerBtn');
  const navCmdBtn = document.getElementById('navCmdBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.removeAttribute('hidden');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    filterCmdResults('');
  }

  function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.setAttribute('hidden', '');
  }

  if (cmdTriggerBtn) cmdTriggerBtn.addEventListener('click', openCmdPalette);
  if (navCmdBtn) navCmdBtn.addEventListener('click', openCmdPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.hasAttribute('hidden')) {
        openCmdPalette();
      } else {
        closeCmdPalette();
      }
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      closeResumeModal();
    }
  });

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closeCmdPalette();
    });
  }

  function filterCmdResults(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCmdResults(e.target.value);
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      closeCmdPalette();
    });
  });

  const cmdOpenResume = document.getElementById('cmdOpenResume');
  if (cmdOpenResume) {
    cmdOpenResume.addEventListener('click', () => {
      closeCmdPalette();
      openResumeModal();
    });
  }

  const cmdCopyEmail = document.getElementById('cmdCopyEmail');
  if (cmdCopyEmail) {
    cmdCopyEmail.addEventListener('click', () => {
      closeCmdPalette();
      copyEmailAction();
    });
  }

  const cmdPrintResume = document.getElementById('cmdPrintResume');
  if (cmdPrintResume) {
    cmdPrintResume.addEventListener('click', () => {
      closeCmdPalette();
      window.print();
    });
  }


  /* ─── 8. Resume Modal Controls ─────────────────────────── */
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeResumeModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }


  /* ─── 9. Email Copy to Clipboard ────────────────────────── */
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailLink = document.getElementById('emailLink');

  async function copyEmailAction() {
    const email = (emailLink ? emailLink.textContent : 'alex@alexrivera.dev').trim();
    try {
      await navigator.clipboard.writeText(email);
      if (copyFeedback) copyFeedback.classList.add('active');
      if (copyBtn) copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        if (copyFeedback) copyFeedback.classList.remove('active');
        if (copyBtn) copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy';
      }, 2500);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  }

  if (copyBtn) copyBtn.addEventListener('click', copyEmailAction);


  /* ─── 10. Contact Form Presets & Validation ─────────────── */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const messageInput = document.getElementById('message');
  const presetButtons = document.querySelectorAll('.btn-preset');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      if (messageInput) {
        messageInput.value = `Hi Alex,\n\nRegarding: ${topic}\n\n`;
        messageInput.focus();
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('formSubmitBtn');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = '✓ Thank you! Your message has been received.';
        }
        contactForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.textContent = '';
        }, 5000);
      }, 700);
    });
  }

});
