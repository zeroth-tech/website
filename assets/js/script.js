document.addEventListener('DOMContentLoaded', function () {
  var typed = new Typed('#typed', {
    strings: ['interobjective autonomous worlds', 'confidential settlements', 'real world supply', 'authentic streaming', 'attested data'],
    typeSpeed: 50,
    backSpeed: 60,
    loop: true
  });

  const logo = document.querySelector('.logo');
  const bigLogo = document.querySelector('.hero-content img');
  let bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;

  function updateLogoVisibility() {
    if (window.pageYOffset > bigLogoOffset) {
      logo.classList.add('visible');
    } else {
      logo.classList.remove('visible');
    }
  }

  // Initial check for logo visibility
  updateLogoVisibility();

  const header = document.querySelector('header');
  const navUl = document.querySelector('nav ul');
  let lastScrollTop = 0;

  function updateHeaderVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > bigLogoOffset) {
      header.style.transform = 'translateY(-100%)';
      navUl.classList.remove('show');
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  }

  function toggleMobileMenu() {
    if (window.innerWidth <= 768) {
      navUl.classList.toggle('show');
    }
  }

  // Update visibility on scroll
  window.addEventListener('scroll', function () {
    updateLogoVisibility();
    updateHeaderVisibility();

    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
      if (index === 0) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.pageYOffset;

      if (scrollPosition > sectionTop - window.innerHeight + sectionHeight / 2) {
        section.classList.add('animate');
      }
    });
  });

  // Toggle mobile menu when logo is clicked
  logo.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  navUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navUl.classList.remove('show');
      }
    });
  });

  // Update bigLogoOffset on window resize
  window.addEventListener('resize', function () {
    bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;
  });
});