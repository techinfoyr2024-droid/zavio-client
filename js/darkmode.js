document.addEventListener('DOMContentLoaded', () => {

    // 1. Theme state check and initialization
    const toggleBtn = document.getElementById('darkModeToggle');
    const icon = toggleBtn.querySelector('i');
    const body = document.body;

    // Check localStorage. Default to "light" if unset, but support "dark"
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = 'light';
        localStorage.setItem('theme', currentTheme);
    }

    applyTheme(currentTheme, false); // false = no animation on load

    // 2. Toggle listener
    toggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme, true);
    });

    function applyTheme(theme, animate) {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Update all theme-aware logos
        const logoSrc = theme === 'dark' ? 'image/logo_dark.png' : 'image/logo_light.png';
        const logos = document.querySelectorAll('.logo-theme-aware');
        logos.forEach(logo => {
            logo.src = logoSrc;
        });

        if (animate) {
            icon.classList.remove('spin-anim');
            // Trigger reflow to restart CSS animation
            void icon.offsetWidth;
            icon.classList.add('spin-anim');
        }
    }
});
