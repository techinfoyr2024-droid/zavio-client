document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // 2. CountUp Initializer
    const countUpElements = document.querySelectorAll('.count-up');
    if (countUpElements.length > 0) {
        const countUpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetValue = parseFloat(el.getAttribute('data-target'));
                    
                    let anim;
                    if(window.countUp) {
                        anim = new countUp.CountUp(el, targetValue, { duration: 2.5, separator: ',' });
                    } else if(window.CountUp) {
                        anim = new CountUp(el, targetValue, { duration: 2.5, separator: ',' });
                    }

                    if (anim && !anim.error) anim.start();
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        countUpElements.forEach(el => countUpObserver.observe(el));
    }
});
