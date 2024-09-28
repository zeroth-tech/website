document.addEventListener('DOMContentLoaded', function () {
  var typed = new Typed('#typed', {
    strings: ['interobjective autonomous worlds', 'confidential settlements', 'real world supply', 'authentic streaming', 'attested data'],
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
      navUl.classList.remove('visible');
    }
  }

  // Initial check for header visibility
  updateHeaderVisibility();

  window.addEventListener('scroll', function () {
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

  // Update bigLogoOffset on window resize
  window.addEventListener('resize', function () {
    bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;
  });
});