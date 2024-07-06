document.addEventListener('DOMContentLoaded', function() {
  var typed = new Typed('#typed', {
    strings: ['interobjective autonomous worlds', 'confidential settlements', 'real world supply', 'authentic streaming', 'attested data'],
    typeSpeed: 50,
    backSpeed: 60,
    loop: true
  });
});

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  const bigLogo = document.querySelector('.hero-content img');
  const bigLogoOffset = bigLogo.offsetTop + bigLogo.offsetHeight;

  if (window.pageYOffset > bigLogoOffset) {
    logo.classList.add('show');
  } else {
    logo.classList.remove('show');
  }

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