document.addEventListener('mousemove', function(e) {
    var cursor = document.querySelector('.cursor');
    gsap.to(cursor, {
        duration: 0.8,
        x: e.clientX - cursor.offsetWidth / 2 + 40,
        y: e.clientY - cursor.offsetHeight / 2 + 40,
        ease: 'power6.out'
    });
    cursor.style.visibility = 'visible';
});