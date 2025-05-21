class Portfolio {
  constructor() {
    this.tabs = document.querySelectorAll('.tab');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.mainContent = document.querySelector('.main-content');
    this.telegramLink = document.getElementById('telegram-link');
    this.experienceCounter = document.getElementById('experience-counter');
    this.init();
  }

  init() {
    if (!this.tabs.length || !this.tabContents.length || !this.mainContent) {
      console.error('Critical elements missing: tabs, tabContents, or mainContent');
      return;
    }
    try {
      this.setupEventListeners();
      this.animateElements();
      this.setupIntersectionObserver();
      this.setupParticles();
      this.setupTelegramCopy();
      this.setupPreloader();
      this.setupProjectFilters();
      this.setupInteractiveAnimations();
      this.updateExperience();
      this.setupParallax();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  setupEventListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.handleTabClick(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleTabClick(tab);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextTab = this.tabs[index + 1] || this.tabs[0];
          nextTab.focus();
          this.handleTabClick(nextTab);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevTab = this.tabs[index - 1] || this.tabs[this.tabs.length - 1];
          prevTab.focus();
          this.handleTabClick(prevTab);
        }
      });
    });
  }

  handleTabClick(clickedTab) {
    const targetTabId = clickedTab.dataset.tab;
    if (clickedTab.classList.contains('active')) return;

    this.animateTabSwitch(clickedTab, targetTabId);
  }

  animateTabSwitch(clickedTab, targetTabId) {
    const currentActiveTab = document.querySelector('.tab.active');
    const currentActiveContent = document.querySelector('.tab-content.active');

    if (currentActiveContent) {
      currentActiveContent.style.animation = 'fadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
      setTimeout(() => {
        currentActiveContent.classList.remove('active');
        currentActiveContent.style.animation = '';
      }, 400);
    }

    if (currentActiveTab) {
      currentActiveTab.classList.remove('active');
    }
    clickedTab.classList.add('active');
    clickedTab.setAttribute('aria-selected', 'true');
    this.tabs.forEach(tab => {
      if (tab !== clickedTab) tab.setAttribute('aria-selected', 'false');
    });

    const targetContent = document.getElementById(targetTabId);
    if (targetContent) {
      targetContent.classList.add('active');
      this.mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.animateTabElements(targetContent, targetTabId);
    } else {
      console.warn(`Target content for tab ${targetTabId} not found`);
    }
  }

  animateTabElements(tabContent, tabId) {
    if (!tabContent) return;

    if (tabId === 'profile') {
      const elementsToAnimate = tabContent.querySelectorAll('.skill-item, .tech-category, .profile-photo, .footer');
      elementsToAnimate.forEach((el, index) => {
        if (el) {
          el.style.animation = `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${100 + index * 100}ms forwards`;
        }
      });
    } else if (tabId === 'skills') {
      const elementsToAnimate = tabContent.querySelectorAll('.skill-item, .footer');
      elementsToAnimate.forEach((el, index) => {
        if (el) {
          el.style.animation = `bounceIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${120 + index * 120}ms forwards`;
        }
      });
    } else if (tabId === 'projects') {
      const elementsToAnimate = tabContent.querySelectorAll('.project-card, .footer');
      elementsToAnimate.forEach((el, index) => {
        if (el) {
          el.style.animation = `flipIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 150}ms forwards`;
        }
      });
    }
  }

  animateElements() {
    const heroElements = document.querySelectorAll('.tabs');
    heroElements.forEach((el, index) => {
      if (el) {
        el.style.animation = `scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${300 + index * 150}ms forwards`;
      }
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    document.querySelectorAll('.skill-item, .tech-category, .project-card, .footer').forEach((el) => {
      if (el) observer.observe(el);
    });
  }

  setupParticles() {
    const canvas = document.getElementById('particles-bg');
    if (!canvas || !canvas.getContext) {
      console.warn('Canvas or context not available');
      document.body.style.background = 'linear-gradient(135deg, #0f172a, #1e293b)';
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 150;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 2 : 4) + 2,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        color: `hsla(${Math.random() * 360}, 70%, 60%, ${Math.random() * 0.4 + 0.2})`,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 60%, ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.opacity = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.3 + 0.5;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      connectParticles();
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 100);
    });
  }

  setupTelegramCopy() {
    if (!this.telegramLink) {
      console.warn('Telegram link not found');
      return;
    }

    this.telegramLink.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      navigator.clipboard.writeText('@mad_XVCEN').then(() => {
        const originalText = this.telegramLink.querySelector('.telegram-text').textContent;
        this.telegramLink.querySelector('.telegram-text').textContent = 'Скопировано!';
        this.telegramLink.style.animation = 'pulseGlow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
          this.telegramLink.querySelector('.telegram-text').textContent = originalText;
          this.telegramLink.style.animation = '';
          window.open('https://t.me/mad_XVCEN', '_blank');
        }, 1500);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }

  setupPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.animation = 'fadeOutScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => {
          preloader.classList.add('hidden');
        }, 800);
      }, 1000);
    } else {
      console.warn('Preloader not found');
    }
  }

  setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) {
      console.warn('Filter buttons or project cards not found');
      return;
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = `popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
          } else {
            card.style.animation = `fadeOutRotate 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            setTimeout(() => {
              card.style.display = 'none';
              card.style.animation = '';
            }, 400);
          }
        });
      });
    });
  }

  setupInteractiveAnimations() {
    const techItems = document.querySelectorAll('.tech-list li');
    const skillItems = document.querySelectorAll('.skill-item');
    const projectCards = document.querySelectorAll('.project-card');

    if (!techItems.length || !skillItems.length || !projectCards.length) {
      console.warn('Interactive elements not found');
      return;
    }

    techItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        item.style.animation = 'pulseScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        item.addEventListener('animationend', () => {
          item.style.animation = '';
        }, { once: true });
      });
    });

    skillItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        item.style.animation = 'swing 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        item.addEventListener('animationend', () => {
          item.style.animation = '';
        }, { once: true });
      });
    });

    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        card.style.animation = 'flipUpGlow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.addEventListener('animationend', () => {
          card.style.animation = '';
        }, { once: true });
      });
    });
  }

  updateExperience() {
    const startDate = new Date('2023-11-01');
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    const totalMonths = years * 12 + months;

    let experienceText;
    if (totalMonths < 12) {
      experienceText = `${totalMonths} месяцев`;
    } else {
      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      experienceText = `${years} ${years === 1 ? 'год' : 'года'}${remainingMonths ? ` и ${remainingMonths} мес.` : ''}`;
    }

    if (this.experienceCounter) {
      this.experienceCounter.textContent = experienceText;
    } else {
      console.warn('Experience counter not found');
    }
  }

  setupParallax() {
    const canvas = document.getElementById('particles-bg');
    if (canvas) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        canvas.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`;
      });
    } else {
      console.warn('Particles canvas not found');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    new Portfolio();
    const body = document.body;
    if (body) {
      body.style.opacity = '1';
      body.style.animation = 'fadeInScale 1s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    } else {
      console.warn('Document body not found');
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(10px); }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes bounceIn {
        from { opacity: 0; transform: scale(0.8) translateX(-30px); }
        50% { transform: scale(1.05); }
        to { opacity: 1; transform: scale(1) translateX(0); }
      }
      @keyframes flipIn {
        from { opacity: 0; transform: perspective(800px) rotateX(-15deg); }
        to { opacity: 1; transform: perspective(800px) rotateX(0deg); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.85) translateY(15px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes pulseGlow {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
        50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
      }
      @keyframes fadeOutScale {
        to { opacity: 0; transform: scale(0.95); }
      }
      @keyframes fadeOutRotate {
        to { opacity: 0; transform: rotate(5deg) scale(0.9); }
      }
      @keyframes swing {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes flipUpGlow {
        0% { transform: perspective(800px) rotateX(0deg); box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
        50% { transform: perspective(800px) rotateX(15deg); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4); }
        100% { transform: perspective(800px) rotateX(0deg); box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
      }
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error('DOMContentLoaded error:', error);
  }
});