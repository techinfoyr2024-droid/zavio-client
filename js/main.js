document.addEventListener('DOMContentLoaded', () => {

    /* 1. Active Link Highlighting (Intersection Observer) */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is cleanly in middle
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    /* 2. Footer Year */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* 3. Social Dashboard Logic */
    const socialNavItems = document.querySelectorAll('.social-nav-item');
    if (socialNavItems.length > 0) {
        const socialData = {
            instagram: {
                title: "Instagram",
                hex: "#E1306C",
                iconCls: "fa-instagram",
                bgCls: "instagram-gradient",
                desc: "Sync DMs, comments, and mentions. Capture leads and engage with your audience — all in one place.",
                btn: "View Instagram Insights"
            },
            facebook: {
                title: "Facebook",
                hex: "#1877F2",
                iconCls: "fa-facebook-f",
                bgCls: "bg-facebook",
                desc: "Manage group comments, timeline posts, and Messenger chats automatically from your centralized hub.",
                btn: "View Facebook Analytics"
            },
            linkedin: {
                title: "LinkedIn",
                hex: "#0A66C2",
                iconCls: "fa-linkedin-in",
                bgCls: "bg-linkedin",
                desc: "Target B2B professionals. Automate connection requests and sync InMail conversations instantly.",
                btn: "View LinkedIn Reports"
            },
            twitter: {
                title: "Twitter / X",
                hex: "#1A1A1A",
                iconCls: "fa-x-twitter",
                bgCls: "bg-dark",
                desc: "Monitor brand mentions in real-time, auto-schedule thread posts, and jump into viral conversations.",
                btn: "View X Engagement"
            },
            whatsapp: {
                title: "WhatsApp",
                hex: "#25D366",
                iconCls: "fa-whatsapp",
                bgCls: "bg-success",
                desc: "Automate conversations and capture leads instantly 24/7. Use official WhatsApp Business API integration.",
                btn: "View WhatsApp Campaigns"
            },
            telegram: {
                title: "Telegram",
                hex: "#0088cc",
                iconCls: "fa-telegram",
                bgCls: "bg-info",
                desc: "Broadcast massive high-deliverability messages to your channels securely. Integrate chatbots easily.",
                btn: "Open Telegram Settings"
            }
        };

        const dynamicIconBox = document.getElementById('dynamic-social-icon');
        const dynamicIcon = dynamicIconBox.querySelector('i');
        const dynamicTitle = document.getElementById('dynamic-social-title');
        const dynamicSubtitle = document.getElementById('dynamic-social-subtitle');
        const dynamicDesc = document.getElementById('dynamic-social-desc');
        const dynamicBtn = document.getElementById('dynamic-social-btn');
        const dynamicGlow = document.getElementById('dynamic-glow');
        const featureIcons = document.querySelectorAll('#dynamic-social-features .icon-bg');
        const featureBtnsContent = document.querySelectorAll('#dynamic-social-features .icon-bg');

        socialNavItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                socialNavItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.classList.add('hover-lift');
                });
                
                // Add active to clicked
                item.classList.add('active');
                item.classList.remove('hover-lift');
                
                const platformKey = item.getAttribute('data-platform');
                const data = socialData[platformKey];
                
                // Update Magnifying Glass
                dynamicIconBox.className = `social-icon-box ${data.bgCls} transition-all rounded-4 d-flex align-items-center justify-content-center text-white shadow-lg`;
                dynamicIcon.className = `fa-brands ${data.iconCls}`;
                
                // Update Ambient Glow
                dynamicGlow.style.background = `radial-gradient(circle, ${data.hex} 0%, transparent 70%)`;
                
                // Update Texts & Colors
                dynamicTitle.textContent = data.title;
                dynamicSubtitle.style.color = data.hex;
                dynamicDesc.textContent = data.desc;
                
                // Update Button
                dynamicBtn.innerHTML = `${data.btn} <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
                dynamicBtn.style.color = data.hex;
                
                // Update Feature Icons
                featureIcons.forEach(iconBg => {
                    iconBg.style.color = data.hex;
                    iconBg.style.backgroundColor = `${data.hex}1A`; // Append 10% opacity hex
                });
            });
        });
    }
});
