
document.addEventListener('DOMContentLoaded', function() {
  fetch('/assets/components/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
    });
});
