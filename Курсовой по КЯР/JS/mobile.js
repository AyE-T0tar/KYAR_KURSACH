document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.overlay-header .menu-toggle');
    const navMenu = document.querySelector('.overlay-header nav');
    
    toggleBtn.addEventListener('click', function() {
      navMenu.classList.toggle('expanded');
      toggleBtn.classList.toggle('collapsed');
    });
  });