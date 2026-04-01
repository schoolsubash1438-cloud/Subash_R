document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navigation & Active Links
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. SPA Tab Navigation & Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-links');
    const pages = document.querySelectorAll('.page-section');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Helper function for switching pages
    function switchPage(targetId) {
        // Remove active class from all links
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        // Find and highlight matching nav link
        const targetLink = document.querySelector(`.nav-item[href="#${targetId === 'home' || targetId === 'about' || targetId === 'what-i-do' ? (targetId === 'home' ? 'home' : 'about') : targetId}"]`);
        // For special mapping (projects/certificates -> portfolio)
        let mappedId = targetId;
        if (targetId === 'projects' || targetId === 'certificates') mappedId = 'portfolio';
        
        const activeLink = document.querySelector(`.nav-item[href="#${mappedId}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        // Switch active page
        pages.forEach(page => {
            if (page.id === mappedId) {
                page.classList.add('active-page');
                // Trigger animations for the new page
                const reveals = page.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
                reveals.forEach(el => {
                    el.classList.remove('active');
                    // Small delay to re-trigger
                    setTimeout(() => {
                        el.classList.add('active');
                    }, 50);
                });
            } else {
                page.classList.remove('active-page');
            }
        });

        // Close mobile menu
        navMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Logo Click Navigation
    const navLogo = document.getElementById('nav-logo');
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage('home');
    });

    // SPA Tab Switching Logic for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchPage(targetId);
        });
    });

    // SPA logic for buttons inside hero (View Work, Contact)
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href').substring(1);
            switchPage(targetId);
        });
    });

    // 3. Typing Animation
    const textElement = document.getElementById('typing-text');
    const words = ["C++ Programmer", "Problem Solver","Web Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Normal typing
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 1500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing animation
    setTimeout(typeEffect, 1000);

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Certificate Modal Logic
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalDate = document.getElementById('modal-date');
    const closeModal = document.getElementById('close-modal');
    const certTriggers = document.querySelectorAll('.cert-trigger');

    certTriggers.forEach(cert => {
        cert.addEventListener('click', () => {
            const imgSrc = cert.getAttribute('data-img');
            const title = cert.getAttribute('data-title');
            const issuer = cert.getAttribute('data-issuer');
            const date = cert.getAttribute('data-date');

            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalIssuer.textContent = issuer;
            modalDate.textContent = date;

            modal.classList.add('show');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 6. Form Validation & Submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        let isValid = true;
        const inputs = ['name', 'email', 'message'];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            const group = input.parentElement;
            
            if (!input.value.trim()) {
                input.classList.add('input-error');
                group.querySelector('.error-msg').style.display = 'block';
                isValid = false;
            } else {
                // Basic email regex
                if (id === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input.value)) {
                    input.classList.add('input-error');
                    group.querySelector('.error-msg').style.display = 'block';
                    isValid = false;
                } else {
                    input.classList.remove('input-error');
                    group.querySelector('.error-msg').style.display = 'none';
                }
            }
        });

        if (isValid) {
            // Simulate button loading state
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.background = '#4ade80'; // Success green
                btn.style.color = '#fff';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        }
    });

    // Clear error dynamically on input formatting
    const inputs = ['name', 'email', 'message'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
            input.parentElement.querySelector('.error-msg').style.display = 'none';
        });
    });
});
