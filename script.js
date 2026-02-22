document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');

    // Only activate custom cursor on non-touch devices to avoid issues
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.display = 'block';
        });
    }

    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('a, button, .project-card, .btn');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '2px solid var(--secondary-color)';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 13, 18, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(13, 13, 18, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu - Close on click
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Check if bootstrap is defined (it should be loaded)
    if (typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Active Scroll Spy Logic
    const sections = document.querySelectorAll('section');

    // Helper to update active state
    const updateActiveState = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // trigger slightly before the section hits top (150px offset)
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === '#' + current) {
                li.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveState);
    // Call once on load to set initial state
    updateActiveState();

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Manually set active class immediately for better UX
                navLinks.forEach(li => li.classList.remove('active'));
                this.classList.add('active');

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate numbers if it's the stats section
                if (entry.target.classList.contains('stat-number')) {
                    if (!entry.target.dataset.animated) {
                        animateValue(entry.target, 0, parseInt(entry.target.getAttribute('data-target')), 2000);
                        entry.target.dataset.animated = "true";
                        observer.unobserve(entry.target);
                    }
                }
            }
        });
    }, observerOptions);

    // Fade-in sections - Select all animating elements
    const fadeElements = document.querySelectorAll('.hero-text, .hero-visual, .section-header, .about-text, .skills-wrapper, .timeline-item, .project-card, .contact-wrapper');
    fadeElements.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // Explicit reveal trigger function
    const revealSections = () => {
        fadeElements.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', revealSections);
    revealSections();

    // Number Counter Animation
    function animateValue(obj, start, end, duration) {
        const suffix = obj.getAttribute('data-suffix') || "+";
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });

    // Form Submission (Mock)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#00ff9d';
                btn.style.color = '#000';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // reset to CSS default
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }
});
