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
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (!document.body.classList.contains('page-header-offset')) {
                header.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // 4. Mobile Navigation
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
                document.querySelectorAll('.nav-item.dropdown').forEach(d => d.classList.remove('open'));
            }
        });
    }

    // Click-to-open Dropdowns (Desktop & Mobile)
    document.querySelectorAll('.nav-item.dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            const isOpen = parent.classList.contains('open');
            
            // Close all others
            document.querySelectorAll('.nav-item.dropdown').forEach(d => d.classList.remove('open'));
            
            if (!isOpen) {
                parent.classList.add('open');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.dropdown')) {
            document.querySelectorAll('.nav-item.dropdown').forEach(d => d.classList.remove('open'));
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
            "Web Applications",
            "Mobile Platforms",
            "Custom Software",
            "AI Solutions",
            "SaaS Products"
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
    // Initialize EmailJS with your Public Key
    emailjs.init("VIgUDPahfPdZmEG5V");
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            console.log('Form Data:', formData);
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = "Sending...";
            btn.disabled = true;

            // Send email using EmailJS
            emailjs.send(
                "service_05j4wnp",  // Your Service ID
                "template_rcgrwzk", // Your Template ID
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: "nepalcodegahr@gmail.com" // Your email
                }
            ).then(() => {
                alert("Message sent successfully! We'll contact you soon.");
                console.log('Email sent:', formData);
                btn.textContent = originalText;
                btn.disabled = false;
                contactForm.reset();
            }).catch(error => {
                console.error('Failed to send email:', error);
                alert("Failed to send message. Please try again.");
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }
});
