// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#navMenu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.breadcrumb-item').forEach((item) => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ===== Theme Toggle =====
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  if (isDark) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.style.animation = 'themeToggle 0.4s ease-in-out';
  setTimeout(() => {
    themeToggle.style.animation = '';
  }, 400);
});

initTheme();

// ===== Breadcrumb Navigation =====
const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
const sections = document.querySelectorAll('section');

function updateBreadcrumb() {
  let currentSection = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 200) {
      currentSection = section.id;
    }
  });

  breadcrumbItems.forEach((item) => {
    const section = item.getAttribute('data-section');
    if (section === currentSection) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Click to navigate
breadcrumbItems.forEach((item) => {
  item.addEventListener('click', () => {
    const section = item.getAttribute('data-section');
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

window.addEventListener('scroll', updateBreadcrumb);
updateBreadcrumb(); // Initial call

// ===== Project Gallery =====
class ProjectGallery {
  constructor(card) {
    this.card = card;
    this.container = card.querySelector('.gallery-container');
    this.allImages = Array.from(this.container.querySelectorAll('.gallery-image'));
    this.currentIndex = 0;
    this.imageElement = this.container.querySelector('.gallery-image');
    this.prevBtn = this.card.querySelector('.gallery-prev');
    this.nextBtn = this.card.querySelector('.gallery-next');
    this.dotsContainer = this.card.querySelector('.gallery-dots');

    this.initGallery();
  }

  initGallery() {
    if (!this.imageElement || this.allImages.length === 0) return;

    // Create dots
    this.allImages.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Image ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });

    // Show first image
    this.showImage(this.currentIndex);

    // Button listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  showImage(index) {
    // Hide all images
    this.allImages.forEach((img) => {
      img.style.display = 'none';
    });
    // Show current image
    if (this.allImages[index]) {
      this.allImages[index].style.display = 'block';
    }

    // Update dots
    document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.allImages.length;
    this.showImage(this.currentIndex);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.allImages.length) % this.allImages.length;
    this.showImage(this.currentIndex);
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.showImage(this.currentIndex);
  }
}

// Initialize galleries for all project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
  if (card.querySelector('.gallery-container')) {
    new ProjectGallery(card);
  }
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formError = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Simple validation
    if (!name || !email || !message) {
      showError('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear form
      contactForm.reset();
      submitBtn.textContent = 'Message envoyé ✓';
      submitBtn.disabled = true;

      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);

      formError.classList.remove('show');
    } catch (error) {
      showError('Erreur lors de l\'envoi du message');
    }
  });
}

function showError(message) {
  formError.textContent = message;
  formError.classList.add('show');
  setTimeout(() => {
    formError.classList.remove('show');
  }, 3000);
}

// ===== Smooth Scroll for Hash Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-fadeInUp').forEach((el) => {
  observer.observe(el);
});
