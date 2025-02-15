document.addEventListener('DOMContentLoaded', function () {
  var typed = new Typed('#typed', {
    strings: ['trust', 'transparency', 'privacy', 'identity', 'knowledge'],
    typeSpeed: 50,
    backSpeed: 60,
    loop: true
  });

  const logo = document.querySelector('.logo');
  const bigLogo = document.querySelector('.hero-content img');
  const navUl = document.querySelector('nav ul');
  let bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;

  function updateHeaderVisibility() {
    if (window.pageYOffset > bigLogoOffset) {
      logo.classList.add('visible');
      navUl.classList.add('visible');
    } else {
      logo.classList.remove('visible');
      navUl.classList.add('visible');
    }
  }

  // Initial check for header visibility
  updateHeaderVisibility();

  window.addEventListener('scroll', function () {
    updateHeaderVisibility();

    // Get the hero section and first content section
    const heroSection = document.querySelector('#home');
    const firstContentSection = document.querySelector('#first-content');

    if (heroSection && firstContentSection) {
      const triggerPoint = window.innerHeight * 0.5; // 50% from top = 50% scrolled
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      
      if (heroBottom <= triggerPoint) {
        firstContentSection.classList.add('animate');
      } else {
        firstContentSection.classList.remove('animate');
      }
    }

    // Get the hero section and all sections
    const sections = document.querySelectorAll('section');

    // For all sections following the first non-hero section, use your original logic.
    sections.forEach((section, index) => {
      if (index < 2) return; // Skip hero and first section (handled above)

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.pageYOffset;

      if (scrollPosition > sectionTop - window.innerHeight + sectionHeight / 2) {
        section.classList.add('animate');
      }
    });
  });

  // Update bigLogoOffset on window resize
  window.addEventListener('resize', function () {
    bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;
  });

  // Custom smooth scroll function
  function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Smooth scroll event listener
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScroll(target, 1250); // You can adjust the duration as needed.
    });
  });

  // Removed the Intersection Observer for the first section-text to allow the scroll event
  // listener above to control the fade-in timing when scrolling past 75% of the home section.
  /*
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px 0px 0px', // Old setting triggered too early
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const firstSection = document.querySelector('.section-text');
  if (firstSection) {
    observer.observe(firstSection);
  }
  */
});