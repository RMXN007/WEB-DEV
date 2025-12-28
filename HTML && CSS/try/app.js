// Modern JavaScript for Sigma Web Development Express

class SigmaWebApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.initializeAnimations();
    this.initializeScrollEffects();
    this.initializeCounters();
    this.hideLoadingScreen();
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle?.addEventListener('click', () => this.toggleMobileNav());

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    scrollToTopBtn?.addEventListener('click', () => this.scrollToTop());

    // Contact form
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => this.handleContactForm(e));

    // Ripple effects for buttons
    document.querySelectorAll('.ripple-effect').forEach(btn => {
      btn.addEventListener('click', (e) => this.createRipple(e));
    });

    // Toast close button
    document.querySelector('.toast-close')?.addEventListener('click', () => {
      this.hideToast();
    });

    // Scroll events
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateScrollProgress();
    });

    // Resize events
    window.addEventListener('resize', () => this.handleResize());

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navMenu?.classList.contains('active')) {
            this.closeMobileNav();
        }
    }