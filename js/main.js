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
                desc: "When you're busy with a customer and miss a phone call, our system instantly texts the caller back: 'Hey there, sorry we missed you! How can we help today?' This locks them in before they call your competitor.",
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
                desc: "The moment you finish a job or close a sale, our system automatically texts your customer a friendly link asking for a review. Watch your 5-star rating skyrocket on Google while you sleep.",
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
                desc: "Let customers book, reschedule, or pay for appointments online 24/7. The platform automatically sends them text reminders so they actually show up.",
                badge: "Active Engine",
                badgeCls: "bg-success-soft text-success",
                whyAttractive: "No more tedious back-and-forth 'What time works for you?' emails.",
                bullets: [
                    { icon: "fa-clock", title: "24/7 self-service scheduling", desc: "Let customers book anytime with live availability" },
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

    // ─── PAGE LOADER & TRANSITION SYSTEM ──────────────────────────────────
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Minimum 2.2-second intro transition while loading the page start
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 2200);
    }

    // Intercept clicks to perform loading overlay transitions
    const transitionLinks = document.querySelectorAll('a');
    transitionLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Check if it is a real page transition link
        if (href && (href.includes('.html') || href === 'index.html' || (href.startsWith('index.html#') && !window.location.pathname.includes('index.html')))) {
            link.addEventListener('click', (e) => {
                // If opening in new tab or keyboard modifiers, don't intercept
                if (link.getAttribute('target') === '_blank' || e.ctrlKey || e.metaKey) return;
                
                e.preventDefault();
                if (loader) {
                    loader.classList.remove('fade-out');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500); // Allow fade-in duration before redirect
                } else {
                    window.location.href = href;
                }
            });
        } else if (href && href.startsWith('#') && href !== '#') {
            // Anchor links: show a quick premium loader transition when clicking navbar links
            link.addEventListener('click', (e) => {
                if (link.closest('.premium-nav')) {
                    e.preventDefault();
                    if (loader) {
                        loader.classList.remove('fade-out');
                        setTimeout(() => {
                            loader.classList.add('fade-out');
                            const targetEl = document.querySelector(href);
                            if (targetEl) {
                                targetEl.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 700); // Sleek transition visual flash
                    }
                }
            });
        }
    });

    /* 4. Mockup Dashboard Tab Switcher */
    const mockSidebarMenu = document.getElementById('mockup-sidebar-menu');
    if (mockSidebarMenu) {
        const menuItems = mockSidebarMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetTab = item.getAttribute('data-tab');
                if (!targetTab) return;
                
                // Update active sidebar item
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active-item', 'bg-light-alpha', 'text-main', 'fw-semibold');
                    menuItem.classList.add('hover-bg');
                });
                item.classList.add('active-item', 'bg-light-alpha', 'text-main', 'fw-semibold');
                item.classList.remove('hover-bg');
                
                // Switch tab content views
                const tabContents = document.querySelectorAll('.mockup-tab-content');
                tabContents.forEach(tab => {
                    tab.classList.add('d-none');
                });
                
                const activeTabEl = document.getElementById(`tab-${targetTab}`);
                if (activeTabEl) {
                    activeTabEl.classList.remove('d-none');
                }
            });
        });
    }

    /* 5. Interactive Showcase Dashboard Simulator */
    const showcaseSidebar = document.getElementById('showcase-sidebar-menu');
    const showcaseMobileNav = document.querySelector('.showcase-mobile-nav');
    
    if (showcaseSidebar || showcaseMobileNav) {
        // Tab switching logic
        const sidebarItems = showcaseSidebar ? showcaseSidebar.querySelectorAll('.showcase-nav-item') : [];
        const mobileNavBtns = showcaseMobileNav ? showcaseMobileNav.querySelectorAll('.showcase-mobile-nav-btn') : [];
        const showcaseTabs = document.querySelectorAll('.showcase-tab-content');

        function switchShowcaseTab(tabName) {
            // Update sidebar
            sidebarItems.forEach(item => {
                if (item.getAttribute('data-showcase-tab') === tabName) {
                    item.classList.add('active-item', 'bg-light-alpha', 'text-main', 'fw-semibold');
                    item.classList.remove('hover-bg');
                } else {
                    item.classList.remove('active-item', 'bg-light-alpha', 'text-main', 'fw-semibold');
                    item.classList.add('hover-bg');
                }
            });

            // Update mobile buttons
            mobileNavBtns.forEach(btn => {
                if (btn.getAttribute('data-showcase-tab') === tabName) {
                    btn.classList.add('active-btn');
                } else {
                    btn.classList.remove('active-btn');
                }
            });

            // Switch content panes
            showcaseTabs.forEach(tab => {
                if (tab.id === `showcase-tab-${tabName}`) {
                    tab.classList.remove('d-none');
                } else {
                    tab.classList.add('d-none');
                }
            });
        }

        // Add listeners
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-showcase-tab');
                switchShowcaseTab(tab);
            });
        });

        mobileNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-showcase-tab');
                switchShowcaseTab(tab);
            });
        });

        // ─── CHAT INBOX SYSTEM ───
        const chatsData = {
            'john': {
                name: "John Doe",
                avatar: "JD",
                badge: "SMS",
                badgeCls: "bg-success-soft text-success",
                messages: [
                    { sender: 'received', text: "Hey, is the job scheduled for tomorrow?" },
                    { sender: 'sent', text: "Yes John! Our technician Amit is scheduled to arrive at your location at 10:00 AM." },
                    { sender: 'received', text: "Perfect, thanks for the update!" }
                ],
                autoReplies: [
                    "No problem at all! Let us know if you need anything else.",
                    "Rahul (Zavio AI): You're very welcome! Have a great evening.",
                    "If you need to reschedule, just reply with 'reschedule'!"
                ],
                replyIndex: 0
            },
            'sarah': {
                name: "Sarah Jenkins",
                avatar: "SJ",
                badge: "IG",
                badgeCls: "bg-primary-soft text-primary",
                messages: [
                    { sender: 'received', text: "Loved the service, thank you!" },
                    { sender: 'sent', text: "Thank you so much Sarah! We appreciate your business. Would you mind sharing a quick review?" },
                    { sender: 'received', text: "Yes, sure! Send me the link." }
                ],
                autoReplies: [
                    "Awesome! Here is the link to review us: g.page/zaviocrm/review - Thanks!",
                    "Sarah (Zavio AI): Thank you for your support, it helps other local businesses find us!",
                    "Let us know if we can assist you with anything else in the future!"
                ],
                replyIndex: 0
            },
            'amit': {
                name: "Amit Sharma",
                avatar: "AS",
                badge: "Web",
                badgeCls: "bg-accent-soft text-accent",
                messages: [
                    { sender: 'received', text: "Can I get a quote?" },
                    { sender: 'sent', text: "Hi Amit! We'd love to help. What services are you looking for?" },
                    { sender: 'received', text: "Need the premium CRM onboarding for my team." }
                ],
                autoReplies: [
                    "Got it! Our onboarding agent will call you shortly to discuss your custom setup details.",
                    "Amit (Zavio AI): I've flagged this thread for our sales manager, Rahul.",
                    "We'll send a custom quote proposal to your email amit.sharma@yahoo.com."
                ],
                replyIndex: 0
            }
        };

        let activeChatId = 'john';
        const chatMessagesContainer = document.getElementById('showcase-chat-messages');
        const chatForm = document.getElementById('showcase-chat-form');
        const chatInput = document.getElementById('showcase-chat-input');
        const chatTitle = document.getElementById('showcase-chat-title');
        const chatAvatar = document.getElementById('showcase-chat-avatar');
        const chatItems = document.querySelectorAll('#showcase-chat-list .chat-list-item');

        function renderActiveChat() {
            if (!chatMessagesContainer) return;
            const data = chatsData[activeChatId];
            chatTitle.textContent = data.name;
            chatAvatar.textContent = data.avatar;
            
            // Build chat history html
            let html = '';
            data.messages.forEach(msg => {
                const isSent = msg.sender === 'sent';
                const bubbleCls = isSent ? 'bg-gradient-premium text-white align-self-end text-end' : 'bg-card border border-light-alpha align-self-start text-start';
                const alignStyle = isSent ? 'align-self: flex-end;' : 'align-self: flex-start;';
                html += `
                    <div class="chat-msg p-2 rounded-3 fs-9 ${bubbleCls}" style="width: fit-content; ${alignStyle}">
                        ${msg.text}
                    </div>
                `;
            });
            chatMessagesContainer.innerHTML = html;
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }

        // Initialize John Doe chat
        renderActiveChat();

        // Chat list selection
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                chatItems.forEach(i => i.classList.remove('active-chat'));
                item.classList.add('active-chat');
                
                activeChatId = item.getAttribute('data-chat');
                renderActiveChat();
            });
        });

        // Chat submit response
        if (chatForm && chatInput) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;

                const data = chatsData[activeChatId];
                
                // Add sent message
                data.messages.push({ sender: 'sent', text: text });
                renderActiveChat();
                chatInput.value = '';

                // Update preview text on list
                const previewEl = document.getElementById(`showcase-chat-prev-${activeChatId}`);
                if (previewEl) {
                    previewEl.textContent = text;
                    previewEl.style.fontWeight = 'normal';
                }

                // Simulate AI Auto-Agent response
                setTimeout(() => {
                    const autoReplyText = data.autoReplies[data.replyIndex % data.autoReplies.length];
                    data.replyIndex++;
                    data.messages.push({ sender: 'received', text: autoReplyText });
                    renderActiveChat();
                    
                    if (previewEl) {
                        previewEl.textContent = autoReplyText;
                    }
                }, 1200);
            });
        }

        // ─── CALENDAR BOOKING SYSTEM ───
        const bookBtn = document.getElementById('showcase-book-btn');
        const calendarGrid = document.getElementById('showcase-calendar-grid');

        if (bookBtn && calendarGrid) {
            let bookedCount = 0;
            bookBtn.addEventListener('click', () => {
                const clientName = prompt("Enter Client Name for Booking:", bookedCount === 0 ? "Rahul K." : "Deepak S.");
                if (!clientName) return;

                // Find fourth day (Thursday) or fifth day (Friday) to insert booking
                const cols = calendarGrid.querySelectorAll('.col');
                // Let's add to Thursday (index 3) first, then Friday (index 4) if Thursday is filled
                const targetCol = cols[3];
                if (targetCol) {
                    const container = targetCol.querySelector('.bg-glass-ui');
                    if (container) {
                        const newEvent = document.createElement('div');
                        newEvent.className = "bg-accent-soft text-accent rounded p-1 text-truncate mt-1";
                        newEvent.style.fontSize = "0.55rem";
                        newEvent.style.fontWeight = "600";
                        newEvent.style.animation = "chatMsgAppear 0.3s ease-out";
                        newEvent.title = `Meeting - ${clientName}`;
                        newEvent.textContent = `Meet ${clientName}`;
                        container.appendChild(newEvent);
                        
                        bookedCount++;
                        
                        // Pulse the button green as confirmation
                        const origHtml = bookBtn.innerHTML;
                        bookBtn.className = "btn btn-success btn-sm rounded fs-8 shadow-sm px-3 py-1";
                        bookBtn.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Booked!`;
                        setTimeout(() => {
                            bookBtn.className = "btn btn-accent btn-sm rounded fs-8 shadow-sm px-3 py-1";
                            bookBtn.innerHTML = origHtml;
                        }, 1500);
                    }
                }
            });
        }

        // ─── MARKETING CAMPAIGN LAUNCHER ───
        const campaignBtn = document.getElementById('showcase-campaign-btn');
        const marketingStatus = document.getElementById('showcase-marketing-status');
        const marketingIcon = document.getElementById('showcase-marketing-icon');
        const marketingText = document.getElementById('showcase-marketing-text');
        const marketingSubtext = document.getElementById('showcase-marketing-subtext');

        if (campaignBtn && marketingStatus) {
            campaignBtn.addEventListener('click', () => {
                if (campaignBtn.disabled) return;
                
                campaignBtn.disabled = true;
                campaignBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Starting...`;
                
                // Active Radar Pulse CSS class
                if (marketingIcon) {
                    marketingIcon.className = "fa-solid fa-satellite-dish text-accent fs-3 shadow-sm p-3 bg-accent-soft rounded-circle mb-2 radar-active-accent";
                }
                
                // Simulation sequence
                setTimeout(() => {
                    campaignBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Broadcasting...`;
                    if (marketingText) marketingText.textContent = "Broadcasting SMS & Emails...";
                    if (marketingSubtext) marketingSubtext.textContent = "Sending autonomous outreach to 35 leads in sales funnel.";
                }, 1000);

                setTimeout(() => {
                    campaignBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i> Campaign Sent`;
                    campaignBtn.className = "btn btn-success btn-sm rounded fs-8 shadow-sm px-3 py-1";
                    
                    if (marketingText) marketingText.textContent = "Campaign Completed!";
                    if (marketingSubtext) marketingSubtext.textContent = "Broadcast delivered. 12 automated replies caught by Zavio AI.";
                    
                    if (marketingIcon) {
                        marketingIcon.className = "fa-solid fa-circle-check text-success fs-3 shadow-sm p-3 bg-success-soft rounded-circle mb-2";
                    }
                }, 2800);

                setTimeout(() => {
                    // Reset button after completed state
                    campaignBtn.disabled = false;
                    campaignBtn.className = "btn btn-premium btn-sm rounded fs-8 shadow-sm px-3 py-1";
                    campaignBtn.innerHTML = `<i class="fa-solid fa-paper-plane me-1"></i> Launch Campaign`;
                    
                    if (marketingText) marketingText.textContent = "System Ready";
                    if (marketingSubtext) marketingSubtext.textContent = "Click the launch button above to broadcast messages to all leads.";
                    
                    if (marketingIcon) {
                        marketingIcon.className = "fa-solid fa-satellite-dish text-primary fs-3 shadow-sm p-3 bg-primary-soft rounded-circle mb-2";
                    }
                }, 6000);
            });
        }

        // ─── INVOICE GENERATOR ───
        const invoiceBtn = document.getElementById('showcase-invoice-btn');
        const invoiceTbody = document.getElementById('showcase-invoice-tbody');

        if (invoiceBtn && invoiceTbody) {
            const clients = ["Rahul Kapoor", "Devendra Sen", "Neha Mehta", "Ananya Rao", "Vikram Malhotra"];
            const amounts = ["₹18,500.00", "₹12,400.00", "₹45,000.00", "₹22,000.00", "₹8,500.00"];
            let invIdSeq = 9286;

            invoiceBtn.addEventListener('click', () => {
                const randomClient = clients[Math.floor(Math.random() * clients.length)];
                const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
                const currentInvId = `#INV-${invIdSeq++}`;

                const newRow = document.createElement('tr');
                newRow.className = "border-bottom border-light-alpha new-invoice-row";
                newRow.innerHTML = `
                    <td class="p-2 text-start text-main text-nowrap fw-bold">${currentInvId}</td>
                    <td class="p-2 text-start text-muted-secondary text-nowrap">${randomClient}</td>
                    <td class="p-2 text-end text-main text-nowrap fw-bold">${randomAmount}</td>
                    <td class="p-2 text-end text-nowrap"><span class="badge bg-success-soft text-success rounded-pill px-2 py-1" style="font-size: 0.6rem;">Paid</span></td>
                `;

                invoiceTbody.insertBefore(newRow, invoiceTbody.firstChild);

                // Quick flash animation reset
                setTimeout(() => {
                    newRow.classList.remove('new-invoice-row');
                }, 1000);
            });
        }
    }

    // ─── PRICING INTERACTIVE SYSTEM ───
    const billingMonthly = document.getElementById('billing-monthly');
    const billingYearly = document.getElementById('billing-yearly');
    
    const priceBasicEl = document.getElementById('price-basic');
    const periodBasicEl = document.getElementById('billing-period-basic');

    function animatePriceChange(el, newPrice) {
        if (!el) return;
        el.style.transition = 'opacity 0.15s ease-in-out';
        el.style.opacity = 0;
        setTimeout(() => {
            el.textContent = newPrice;
            el.style.opacity = 1;
        }, 150);
    }

    function updatePricingDisplay() {
        if (!billingYearly) return;
        const isYearly = billingYearly.classList.contains('active');
        
        const priceBasic = isYearly ? '$239' : '$299';
        const periodText = isYearly 
            ? '/mo ($2,868/yr) Billed yearly - Save 20%' 
            : '/mo Billed monthly';

        animatePriceChange(priceBasicEl, priceBasic);
        if (periodBasicEl) periodBasicEl.textContent = periodText;
    }

    if (billingMonthly && billingYearly) {
        billingMonthly.addEventListener('click', () => {
            billingMonthly.classList.add('active');
            billingYearly.classList.remove('active');
            updatePricingDisplay();
        });

        billingYearly.addEventListener('click', () => {
            billingYearly.classList.add('active');
            billingMonthly.classList.remove('active');
            updatePricingDisplay();
        });
    }

    // Action button handlers with form pre-population
    const btnBasic = document.getElementById('btn-select-basic');
    const btnAdvanced = document.getElementById('btn-select-advanced');
    const btnCustom = document.getElementById('btn-select-custom');
    const btnCustomSales = document.getElementById('pricing-custom-sales-link');
    const contactMessage = document.getElementById('contact-message');

    function handlePlanSelection(planName, customMsg) {
        if (contactMessage) {
            contactMessage.value = customMsg;
        }
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            // Trigger loader transition flash for nice premium UI feedback
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.remove('fade-out');
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    if (contactMessage) {
                        contactMessage.focus();
                    }
                }, 700);
            } else {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                contactMessage.focus();
            }
        }
    }

    if (btnBasic) {
        btnBasic.addEventListener('click', (e) => {
            e.preventDefault();
            const billingPeriod = billingYearly && billingYearly.classList.contains('active') ? 'Yearly' : 'Monthly';
            const price = billingPeriod === 'Yearly' ? '$239/mo (Billed Yearly)' : '$299/mo (Billed Monthly)';
            const msg = `Hi ZavioCRM Team,\n\nI would like to get started with the Basic Plan at ${price}. Please guide me through the onboarding and account creation process.\n\nThank you!`;
            handlePlanSelection('Basic', msg);
        });
    }

    if (btnAdvanced) {
        btnAdvanced.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi ZavioCRM Team,\n\nI would like to book a demo to discuss the Advanced Plan. We are interested in setting up automated workflows, Review & Resolution AI, and custom dashboard features for our business.\n\nBest regards,`;
            handlePlanSelection('Advanced', msg);
        });
    }

    if (btnCustom) {
        btnCustom.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi ZavioCRM Team,\n\nI'm interested in the Custom Enterprise Plan. Please contact me with a formal quote and details about custom onboarding, integrations, and enterprise feature options.\n\nThank you!`;
            handlePlanSelection('Custom Enterprise', msg);
        });
    }

    if (btnCustomSales) {
        btnCustomSales.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi ZavioCRM Team,\n\nI am interested in a Custom Enterprise Plan. I'd love to chat with a sales representative to design a tailor-made AI package for our scale.\n\nBest regards,`;
            handlePlanSelection('Custom Sales', msg);
        });
    }
});

