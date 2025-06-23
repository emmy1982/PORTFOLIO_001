gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects',
        start: 'top center',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2
});
