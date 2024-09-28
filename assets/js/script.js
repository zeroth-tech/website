document.addEventListener('DOMContentLoaded', function () {
  // Cache DOM elements
  const logo = document.querySelector('.logo');
  const bigLogo = document.querySelector('.hero-content img');
  const header = document.querySelector('header');
  const navUl = document.querySelector('nav ul');
  const sections = document.querySelectorAll('section');

  let lastScrollTop = 0;
  let bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;

  // Typed.js initialization
  new Typed('#typed', {
    strings: ['interobjective autonomous worlds', 'confidential settlements', 'real world supply', 'authentic streaming', 'attested data'],
    typeSpeed: 50,
    backSpeed: 60,
    loop: true
  });

  // Throttle scroll event
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    updateLogoVisibility(scrollTop);
    updateHeaderVisibility(scrollTop);
    animateSections(scrollTop);
  }

  function updateLogoVisibility(scrollTop) {
    logo.classList.toggle('visible', scrollTop > bigLogoOffset);
  }

  function updateHeaderVisibility(scrollTop) {
    if (scrollTop > lastScrollTop && scrollTop > bigLogoOffset) {
      header.style.transform = 'translateY(-100%)';
      navUl.classList.remove('show');
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  }

  function animateSections(scrollTop) {
    sections.forEach((section, index) => {
      if (index === 0) return;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollTop > sectionTop - window.innerHeight + sectionHeight / 2) {
        section.classList.add('animate');
      }
    });
  }

  function toggleMobileMenu() {
    if (window.innerWidth <= 768) {
      navUl.classList.toggle('show');
    }
  }

  // Event listeners
  logo.addEventListener('click', toggleMobileMenu);
  navUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navUl.classList.remove('show');
      }
    });
  });

  // Debounce resize event
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;
    }, 250);
  });
});