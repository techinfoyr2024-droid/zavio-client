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

    /* 3. Interactive Features Showcase Logic */
    const featureNavItems = document.querySelectorAll('.feature-nav-item');
    if (featureNavItems.length > 0) {
        const featuresData = {
            'unified-inbox': {
                title: "The Unified Inbox",
                catchphrase: "Stop Hunting for Messages.",
                hex: "#3B82F6",
                iconCls: "fa-inbox",
                desc: "Whether a customer messages you on Facebook, Instagram, Google, Email, or Text, it all lands in one single inbox. You can text them back right from your phone without switching apps.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "Eliminates the stress of missing a DM from a potential buyer because you forgot to check Instagram.",
                bullets: [
                    { icon: "fa-circle-nodes", title: "All channels in one place", desc: "Facebook, Instagram, Email, SMS & Google" },
                    { icon: "fa-mobile-screen-button", title: "Respond direct from phone", desc: "No switching between multiple apps" },
                    { icon: "fa-shield-halved", title: "Zero missed opportunities", desc: "Never lose another hot lead in your DMs" }
                ]
            },
            'missed-call': {
                title: "Missed-Call Text-Back",
                catchphrase: "Turn Missed Calls Into Done Deals.",
                hex: "#10B981",
                iconCls: "fa-phone-slash",
                desc: "When you're busy with a client and miss a phone call, our system instantly texts the caller back: 'Hey there, sorry we missed you! How can we help today?' This locks them in before they call your competitor.",
                badge: "Highest Converting",
                badgeCls: "bg-accent-soft text-accent",
                whyAttractive: "It literally rescues lost money.",
                bullets: [
                    { icon: "fa-bolt", title: "Instant automated responses", desc: "Replies within seconds of a missed call" },
                    { icon: "fa-users-viewfinder", title: "Locks in warm prospects", desc: "Engage them before they contact competitors" },
                    { icon: "fa-sack-dollar", title: "Rescues lost pipeline value", desc: "Turn missed interactions into revenue" }
                ]
            },
            'google-reviews': {
                title: "Automated Google Reviews",
                catchphrase: "Dominate Google on Autopilot.",
                hex: "#F59E0B",
                iconCls: "fa-star",
                desc: "The moment you finish a job or close a sale, our system automatically texts your client a friendly link asking for a review. Watch your 5-star rating skyrocket on Google while you sleep.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "More reviews = higher ranking on Google = more free traffic.",
                bullets: [
                    { icon: "fa-square-poll-vertical", title: "Automated review generation", desc: "Trigger reviews instantly at job completion" },
                    { icon: "fa-message", title: "Instant link texting", desc: "Frictionless 1-click review link sent to SMS" },
                    { icon: "fa-arrow-trend-up", title: "Elevate SEO rankings", desc: "Higher ratings lead to more free organic traffic" }
                ]
            },
            'smart-calendars': {
                title: "Smart Calendars & Booking",
                catchphrase: "Your Bookings, Fully Automated.",
                hex: "#8B5CF6",
                iconCls: "fa-calendar-check",
                desc: "Let clients book, reschedule, or pay for appointments online 24/7. The platform automatically sends them text reminders so they actually show up.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "No more tedious back-and-forth 'What time works for you?' emails.",
                bullets: [
                    { icon: "fa-clock", title: "24/7 self-service scheduling", desc: "Let clients book anytime with live availability" },
                    { icon: "fa-bell", title: "Automated text reminders", desc: "Drastically reduce appointment no-shows" },
                    { icon: "fa-rotate", title: "Direct calendar sync", desc: "Syncs flawlessly with Google Calendar & Outlook" }
                ]
            },
            'websites': {
                title: "Simple Websites & Funnels",
                catchphrase: "Websites That Actually Sell.",
                hex: "#EC4899",
                iconCls: "fa-laptop-code",
                desc: "Beautiful, fast, mobile-friendly pages designed to do one thing: get visitors to click, call, or buy. No coding required.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "Cuts out the need for expensive web developers.",
                bullets: [
                    { icon: "fa-wand-magic-sparkles", title: "High-converting designs", desc: "Built with psychological conversion frameworks" },
                    { icon: "fa-mobile", title: "Completely mobile-friendly", desc: "Looks stunning and loads fast on any device" },
                    { icon: "fa-code", title: "Zero coding required", desc: "Drag, drop, and publish in a matter of minutes" }
                ]
            },
            'sales-dashboard': {
                title: "The Simple Sales Dashboard",
                catchphrase: "Never Let a Deal Slip Through.",
                hex: "#14B8A6",
                iconCls: "fa-chart-pie",
                desc: "See exactly where every single lead stands in a clean, visual pipeline. Know who needs a follow-up, who is ready to buy, and exactly how much revenue is waiting for you this month—no messy spreadsheets required.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "Business owners love clarity. It gives them peace of mind knowing exactly how their sales numbers look at a single glance.",
                bullets: [
                    { icon: "fa-network-wired", title: "Visual pipeline tracking", desc: "Drag and drop leads as they move forward" },
                    { icon: "fa-file-excel", title: "Eliminate manual spreadsheets", desc: "Centralized clean system updated automatically" },
                    { icon: "fa-chart-line", title: "Real-time revenue forecast", desc: "See your numbers clearly at a single glance" }
                ]
            },
            'social-planner': {
                title: "The Social Planner",
                catchphrase: "1 Month of Content in 20 Minutes.",
                hex: "#EF4444",
                iconCls: "fa-share-nodes",
                desc: "Stop stressing about what to post every day. Create, schedule, and publish your content across Facebook, Instagram, LinkedIn, and TikTok all at once from a single dashboard. You can even use our built-in AI assistant to write your captions for you.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "It saves them hours of manual posting every week and keeps their brand looking active and professional on autopilot.",
                bullets: [
                    { icon: "fa-share-nodes", title: "Multi-channel publishing", desc: "Post to FB, IG, LinkedIn, & TikTok at once" },
                    { icon: "fa-calendar-days", title: "Visual content scheduler", desc: "Plan your entire month calendar in minutes" },
                    { icon: "fa-robot", title: "Built-in AI assistant", desc: "Let AI write optimized, creative captions for you" }
                ]
            },
            'custom-branding': {
                title: "Custom Branding & Domains",
                catchphrase: "Look Like a Fortune 500 overnight.",
                hex: "#6366F1",
                iconCls: "fa-hashtag",
                desc: "We give your business its own dedicated business phone number for professional calling and texting, complete with custom email routing matching your domain (e.g., info@yourcompany.com). No more running a professional business from a generic @gmail.com account or your personal cell phone.",
                badge: "Instant Authority",
                badgeCls: "bg-accent-soft text-accent",
                whyAttractive: "It instantly builds trust with customers. It protects the business owner's privacy by separating their personal phone number from their business.",
                bullets: [
                    { icon: "fa-phone", title: "Dedicated business number", desc: "Separate personal calls from professional ones" },
                    { icon: "fa-globe", title: "Professional domain routing", desc: "Custom emails matching your business website domain" },
                    { icon: "fa-shield-halved", title: "Customer trust & privacy", desc: "Instantly projects authority and high brand security" }
                ]
            }
        };

        const dynamicGlow = document.getElementById('dynamic-feature-glow');
        const dynamicIconBox = document.getElementById('dynamic-feature-icon');
        const dynamicIcon = dynamicIconBox.querySelector('i');
        const dynamicBadgeContainer = document.getElementById('dynamic-feature-badge-container');
        const dynamicTitle = document.getElementById('dynamic-feature-title');
        const dynamicCatchphrase = document.getElementById('dynamic-feature-catchphrase');
        const dynamicDesc = document.getElementById('dynamic-feature-desc');
        const dynamicBullets = document.getElementById('dynamic-feature-bullets');
        const dynamicWhyAttractive = document.getElementById('dynamic-feature-why-attractive');
        const dynamicBtn = document.getElementById('dynamic-feature-btn');

        featureNavItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                featureNavItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.classList.add('hover-lift');
                });
                
                // Add active to clicked
                item.classList.add('active');
                item.classList.remove('hover-lift');
                
                const featureKey = item.getAttribute('data-feature');
                const data = featuresData[featureKey];
                
                // Update Magnifying Glass & Glow
                dynamicIconBox.className = `social-icon-box bg-primary transition-all rounded-4 d-flex align-items-center justify-content-center text-white shadow-lg`;
                dynamicIconBox.style.backgroundColor = data.hex;
                dynamicIcon.className = `fa-solid ${data.iconCls}`;
                dynamicGlow.style.background = `radial-gradient(circle, ${data.hex} 0%, transparent 70%)`;
                
                // Update Badge
                dynamicBadgeContainer.innerHTML = `
                    <span id="dynamic-feature-badge" class="d-inline-flex align-items-center gap-2 px-3 py-1 ${data.badgeCls} fs-8 fw-bold rounded-pill">
                        <span class="dot" style="width:8px; height:8px; border-radius:50%; background-color: currentColor;"></span> ${data.badge}
                    </span>
                `;
                
                // Update Texts
                dynamicTitle.textContent = data.title;
                dynamicCatchphrase.textContent = data.catchphrase;
                dynamicCatchphrase.style.color = data.hex;
                dynamicDesc.textContent = data.desc;
                dynamicWhyAttractive.textContent = data.whyAttractive;
                
                // Update Highlights/Bullets
                let bulletsHtml = '';
                data.bullets.forEach((bullet, idx) => {
                    let borderClass = idx < 2 ? 'border-bottom border-light-alpha pb-3' : '';
                    bulletsHtml += `
                        <li class="d-flex align-items-center gap-3 ${borderClass} px-2">
                            <div class="icon-bg p-2 rounded bg-opacity-10 transition-all" style="background-color: ${data.hex}1A; color: ${data.hex};">
                                <i class="fa-solid ${bullet.icon}"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-7 text-main">${bullet.title}</div>
                                <div class="fs-8 text-muted-secondary">${bullet.desc}</div>
                            </div>
                        </li>
                    `;
                });
                dynamicBullets.innerHTML = bulletsHtml;
                
                // Update Action Button
                dynamicBtn.href = `#contact`;
                dynamicBtn.innerHTML = `<span>Get Started with ${data.title}</span> <i class="fa-solid fa-arrow-right"></i>`;
            });
        });
    }

});
