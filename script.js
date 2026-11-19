document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Reading Progress Bar
    const progressContainer = document.createElement('div');
    progressContainer.id = 'reading-progress';
    document.body.prepend(progressContainer);

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressContainer.style.width = `${progress}%`;
    });

    // 3. Header Scroll Effect
    const header = document.getElementById('header');
    const updateHeader = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (!document.body.classList.contains('page-header-offset')) {
                header.classList.remove('scrolled');
            }
        }
    };
    if (header) {
        window.addEventListener('scroll', updateHeader);
        updateHeader();
    }

    // 4. Mobile Navigation Drawer & Dropdown Logic
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks') || document.getElementById('navMenu') || document.querySelector('.nav-menu');
    const navBackdrop = document.getElementById('navBackdrop');
    const navCloseBtn = document.getElementById('navCloseBtn') || document.getElementById('drawerClose') || document.querySelector('.drawer-close');

    const closeMobileMenu = () => {
        if (navLinks) {
            navLinks.classList.remove('active', 'open');
            if (navBackdrop) navBackdrop.classList.remove('active', 'open');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.querySelectorAll('.cgdrop, .nav-item.dropdown').forEach(d => d.classList.remove('open'));
        }
    };

    const openMobileMenu = () => {
        if (navLinks) {
            navLinks.classList.add('active', 'open');
            if (navBackdrop) navBackdrop.classList.add('active', 'open');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
                mobileToggle.setAttribute('aria-expanded', 'true');
            }
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active') || navLinks.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu when tapping in-page anchor links (hashes)
    document.querySelectorAll('.nav-menu a, #navLinks a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href !== '#') {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // Dropdown Toggling for .cgdrop
    document.querySelectorAll('.cgdrop-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = trigger.closest('.cgdrop');
            if (!parent) return;
            const isOpen = parent.classList.contains('open');

            // Close other dropdowns
            document.querySelectorAll('.cgdrop').forEach(d => {
                if (d !== parent) d.classList.remove('open');
            });

            if (!isOpen) {
                parent.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            } else {
                parent.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Allow subnav links inside .cgdrop-menu to be clicked cleanly without parent interference
    document.querySelectorAll('.cgdrop-menu a').forEach(subLink => {
        subLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cgdrop') && !e.target.closest('.nav-item.dropdown')) {
            document.querySelectorAll('.cgdrop, .nav-item.dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            document.querySelectorAll('.cgdrop, .nav-item.dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // 5. Advanced Reveal System (IntersectionObserver)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 7. Interactive Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close other items in the same accordion
            const accordion = item.parentElement;
            accordion.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Auto Play Services in Hero
    const autoPlayElement = document.getElementById('autoPlayServices');
    if (autoPlayElement) {
        const services = [
            "AI Products for Business",
            "Smart AI Automations",
            "AI for Education & Youth",
            "Healthcare AI Systems",
            "Scalable Custom Software"
        ];
        let serviceIndex = 0;

        setInterval(() => {
            // Fade out up
            autoPlayElement.classList.add('fade-out');

            setTimeout(() => {
                // Change text and prepare to fade in from bottom
                serviceIndex = (serviceIndex + 1) % services.length;
                autoPlayElement.textContent = services[serviceIndex];

                // Swap classes instantly
                autoPlayElement.classList.remove('fade-out');
                autoPlayElement.classList.add('fade-in');

                // Allow browser to register the 'fade-in' state
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Remove 'fade-in' to trigger transition to original position
                        autoPlayElement.classList.remove('fade-in');
                    });
                });
            }, 500); // Wait for fade-out to finish
        }, 3000); // Change every 3 seconds
    }

    // 6. EmailJS Form Handling
    const EMAILJS_PUBLIC_KEY = "VIgUDPahfPdZmEG5V";
    const EMAILJS_SERVICE_ID = "service_324q5pn";
    const EMAILJS_TEMPLATE_ID = "template_7sj8ni2";

    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        } catch (e) {
            try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e2) {}
        }
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
            const originalText = btn ? btn.textContent : "Send Message / पठाउनुस्";

            if (btn) {
                btn.textContent = "Sending / पठाउँदैछ...";
                btn.disabled = true;
            }

            // Safety timeout to prevent getting permanently stuck
            const safetyTimeout = setTimeout(() => {
                if (btn && btn.disabled) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert("Request timed out. Please check your network connection or email us directly at nepalcodeghar@gmail.com.");
                }
            }, 15000);

            try {
                if (typeof emailjs === 'undefined') {
                    clearTimeout(safetyTimeout);
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                    alert("Email service is temporarily unavailable. Please email us directly at nepalcodeghar@gmail.com or call +977-9842378928.");
                    return;
                }

                // Get form values
                const nameEl = document.getElementById('name');
                const emailEl = document.getElementById('email');
                const phoneEl = document.getElementById('phone');
                const serviceEl = document.getElementById('service');
                const messageEl = document.getElementById('message');

                const templateParams = {
                    from_name: nameEl ? nameEl.value.trim() : "",
                    name: nameEl ? nameEl.value.trim() : "",
                    user_name: nameEl ? nameEl.value.trim() : "",
                    from_email: emailEl ? emailEl.value.trim() : "",
                    email: emailEl ? emailEl.value.trim() : "",
                    user_email: emailEl ? emailEl.value.trim() : "",
                    phone: phoneEl ? phoneEl.value.trim() : "",
                    user_phone: phoneEl ? phoneEl.value.trim() : "",
                    service: serviceEl ? serviceEl.value : "",
                    service_interest: serviceEl ? serviceEl.value : "",
                    message: messageEl ? messageEl.value.trim() : "",
                    to_email: "nepalcodeghar@gmail.com"
                };

                // Send email using EmailJS
                emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                ).then((response) => {
                    clearTimeout(safetyTimeout);
                    alert("धन्यवाद! तपाईंको सन्देश सफलतापूर्वक पठाइयो। (Message sent successfully! We will contact you soon.)");
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                    contactForm.reset();
                }).catch((error) => {
                    clearTimeout(safetyTimeout);
                    console.error('Failed to send email via EmailJS:', error);
                    alert("सन्देश पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोला वा सिधै nepalcodeghar@gmail.com मा सम्पर्क गर्नुहोस्।\n(Failed to send message: " + (error?.text || error?.message || "Unknown error") + ")");
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                });
            } catch (err) {
                clearTimeout(safetyTimeout);
                console.error('Unexpected form submission error:', err);
                if (btn) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
                alert("सन्देश पठाउँदा समस्या आयो। कृपया nepalcodeghar@gmail.com मा इमेल गर्नुहोस्।");
            }
        });
    }
});
