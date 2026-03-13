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
    this.currentIndex = 0;
    this.imageElements = Array.from(this.card.querySelectorAll('.gallery-image'));
    this.prevBtn = this.card.querySelector('.gallery-prev');
    this.nextBtn = this.card.querySelector('.gallery-next');
    this.dotsContainer = this.card.querySelector('.gallery-dots');

    if (this.imageElements.length > 0) {
      this.initGallery();
    }
  }

  initGallery() {
    // Create dots
    this.imageElements.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Image ${index + 1}`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(index);
      });
      this.dotsContainer.appendChild(dot);
    });

    // Event listeners with preventDefault
    this.prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.prevSlide();
    });
    this.nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.nextSlide();
    });

    // Hide all images except first one
    this.imageElements.forEach((img, index) => {
      img.style.display = index === 0 ? 'block' : 'none';
    });
  }

  updateGallery() {
    // Show/hide images
    this.imageElements.forEach((img, index) => {
      img.style.display = index === this.currentIndex ? 'block' : 'none';
    });

    // Update dots
    const dots = this.card.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.imageElements.length - 1 : this.currentIndex - 1;
    this.updateGallery();
  }

  nextSlide() {
    this.currentIndex = this.currentIndex === this.imageElements.length - 1 ? 0 : this.currentIndex + 1;
    this.updateGallery();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateGallery();
  }
}

// Initialize galleries for all projects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
  new ProjectGallery(card);
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
