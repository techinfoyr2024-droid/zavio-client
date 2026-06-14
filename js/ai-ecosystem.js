/**
 * ZavioCRM - Futuristic Interactive AI Ecosystem Engine
 * Built with HTML5 Canvas (Custom 3D Projection), GSAP & Vanilla JS
 * Zero Heavy WebGL Dependencies - 60 FPS Guaranteed
 */

document.addEventListener('DOMContentLoaded', () => {
    // ─── DOM SELECTORS ──────────────────────────────────────────────────────────
    const section = document.getElementById('ai-ecosystem');
    if (!section) return;

    const canvas = document.getElementById('globe-canvas');
    const ctx = canvas.getContext('2d');
    const nodes = document.querySelectorAll('.satellite-node');
    const preview = document.getElementById('ecosystem-hover-preview');
    const activePop = document.getElementById('ecosystem-active-pop');
    const closePopBtn = document.getElementById('btn-close-active-pop');
    
    // Preview fields
    const previewTitle = preview ? preview.querySelector('.preview-title') : null;
    const previewSubtitle = preview ? preview.querySelector('.preview-subtitle') : null;
    const previewDesc = preview ? preview.querySelector('.preview-desc') : null;
    const previewStatusDot = preview ? (preview.querySelector('.preview-badge-status .pulse-dot') || preview.querySelector('.pulse-dot')) : null;
    
    // Active Pop fields
    const popTitle = activePop ? activePop.querySelector('.pop-title') : null;
    const popSubtitle = activePop ? activePop.querySelector('.pop-subtitle') : null;
    const popDesc = activePop ? activePop.querySelector('.pop-desc') : null;
    const popSpecsContainer = document.getElementById('pop-specs-container');

    // State Variables
    let width = 600;
    let height = 600;
    let isActivePopOpen = false;
    let activeNodeIndex = -1;
    let hoveredNodeIndex = -1;
    let time = 0;

    // ─── THEME OBSERVING & CANVAS COLOR ADAPTATION ────────────────────────────
    let isDark = document.body.getAttribute('data-theme') === 'dark';
    
    const themeColors = {
        particleBase: isDark ? "rgba(255, 255, 255," : "rgba(30, 41, 59,",
        neuralLine: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(30, 41, 59, 0.09)",
        lineIntensity: isDark ? 0.22 : 0.28
    };

    const themeObserver = new MutationObserver(() => {
        const activeDark = document.body.getAttribute('data-theme') === 'dark';
        if (activeDark !== isDark) {
            isDark = activeDark;
            themeColors.particleBase = isDark ? "rgba(255, 255, 255," : "rgba(30, 41, 59,";
            themeColors.neuralLine = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(30, 41, 59, 0.09)";
            themeColors.lineIntensity = isDark ? 0.22 : 0.28;
            initGlobe();
        }
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    // Node data structure
    const nodeData = [
        {
            title: "AI Lead Capture",
            subtitle: "Engagement Agent",
            desc: "Omnichannel customer engagement. Syncs SMS, Webchat, Instagram, Messenger, and WhatsApp with live calendars to book leads securely into ZavioCRM on autopilot.",
            color: "var(--clr-cyan)",
            colorRGB: "6, 182, 212",
            icon: "<i class='fa-solid fa-comments-dollar'></i>",
            specs: [
                "Omnichannel Deployment (SMS, WhatsApp, IG, FB DMs)",
                "Live Calendar Integration & CRM Widget Sync",
                "Auto Follow-Up Logic to capture lost leads"
            ]
        },
        {
            title: "AI Voice Executive",
            subtitle: "Telephony Agent",
            desc: "Ultra-low latency inbound & outbound phone calling. Features custom voice branding, sub-1-second audio synthesis, and automated call transcripts synced into CRM.",
            color: "var(--clr-purple)",
            colorRGB: "139, 92, 246",
            icon: "<i class='fa-solid fa-microphone-lines'></i>",
            specs: [
                "Ultra-Low Latency Calling (<1s response latency)",
                "Smart Routing & warm-transfers to human managers",
                "Custom Voice branding & automated call transcriptions"
            ]
        },
        {
            title: "AI Knowledge Core",
            subtitle: "Context Engine",
            desc: "中央知識ベース. Scrapes and processes public websites, FAQs, and company data. Integrates strict boundary controls to guarantee zero hallucination.",
            color: "var(--clr-pink)",
            colorRGB: "236, 72, 153",
            icon: "<i class='fa-solid fa-network-wired'></i>",
            specs: [
                "Scrape-and-Learn Website URL & File Crawler",
                "Strict Boundary Controls (Zero AI knowledge hallucinations)",
                "Encrypted SOC-2 Isolated Database Vectors"
            ]
        },
        {
            title: "AI Review Responder",
            subtitle: "Sentiment Engine",
            desc: "Autopilot review replies for Google Business Profiles and Facebook. Automatically writes context-aware responses with suggestive toggle modes for approvals.",
            color: "var(--clr-orange)",
            colorRGB: "245, 158, 11)",
            icon: "<i class='fa-solid fa-star-half-stroke'></i>",
            specs: [
                "Autopilot Review Responder (Google & Facebook Sync)",
                "Suggestive Mode Toggle (Human approval before public post)",
                "Sentiment Analysis & CRM negative review alerts"
            ]
        }
    ];

    // Symmetrical, balanced screen coordinate positions (percentages)
    const basePositions = [
        { left: 16, top: 22 },  // Node 1: Concierge (Top-Left)
        { left: 16, top: 68 },  // Node 2: Voice AI (Bottom-Left)
        { left: 84, top: 22 },  // Node 3: Knowledge Brain (Top-Right)
        { left: 84, top: 68 }   // Node 4: Reputation Guardian (Bottom-Right)
    ];

    // ─── PARTICLE GLOBE ENGINE (CUSTOM 3D PROJECTION) ───────────────────────────
    const particles = [];
    const numParticles = 1200;
    let globeRadius = 160;
    let projectionFov = 350;
    
    // Physics / Camera control
    let cameraZoom = { scale: 1.0, offsetX: 0, offsetY: 0 };
    let rotation = { x: 0.2, y: 0, targetX: 0.2, targetY: 0 };
    let rotationSpeed = 0.002;
    
    // Cursor Tracking
    let mouse = { x: null, y: null, targetX: null, targetY: null, isNear: false };
    const magneticRadius = 110;
    const magneticForce = 0.24;

    const streamParticles = [];

    // Initialize Fibonacci Sphere Points
    function initGlobe() {
        particles.length = 0;
        for (let i = 0; i < numParticles; i++) {
            const phi = Math.acos(-1 + (2 * i) / numParticles);
            const theta = Math.sqrt(numParticles * Math.PI) * phi;
            
            const x = globeRadius * Math.sin(phi) * Math.cos(theta);
            const y = globeRadius * Math.sin(phi) * Math.sin(theta);
            const z = globeRadius * Math.cos(phi);
            
            particles.push({
                x: x, y: y, z: z,
                ox: x, oy: y, oz: z,
                px: 0, py: 0,
                pz: 0,
                brightness: Math.random() * 0.4 + 0.6,
                colorType: i % 4,
                magneticOffset: { x: 0, y: 0, z: 0 }
            });
        }
    }

    // Set canvas dimensions with high-density device pixel scaling
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = Math.min(rect.width, 600);
        height = Math.min(rect.width, 600);
        
        if (window.innerWidth <= 768) {
            width = 300;
            height = 300;
            globeRadius = 85;
            projectionFov = 200;
        } else {
            globeRadius = 160;
            projectionFov = 350;
        }

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // Mathematical Rotation Matrices
    function rotatePoints() {
        let speed = rotationSpeed;
        
        if (hoveredNodeIndex === -1 && !isActivePopOpen) {
            rotation.targetY += speed;
        }
        
        rotation.x += (rotation.targetX - rotation.x) * 0.08;
        rotation.y += (rotation.targetY - rotation.y) * 0.08;

        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);

        let m3d = { x: 0, y: 0, z: 0 };
        if (mouse.x !== null && mouse.isNear) {
            m3d.x = (mouse.x - width / 2) / cameraZoom.scale;
            m3d.y = (mouse.y - height / 2) / cameraZoom.scale;
            m3d.z = 80;
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            let x = p.ox;
            let y = p.oy;
            let z = p.oz;

            // Interactive Snaps: Saturated active quadrant expands slightly
            const activeQuadrant = activeNodeIndex !== -1 ? activeNodeIndex : hoveredNodeIndex;
            if (activeQuadrant !== -1 && p.colorType === activeQuadrant) {
                const scaleVal = 1.08 + Math.sin(time * 0.08) * 0.02;
                x *= scaleVal;
                y *= scaleVal;
                z *= scaleVal;
            }

            // 3D Rotations
            let x1 = x * cosY - z * sinY;
            let z1 = x * sinY + z * cosY;

            let y2 = y * cosX - z1 * sinX;
            let z2 = y * sinX + z1 * cosX;

            // Cursor Magnetism
            if (mouse.x !== null && mouse.isNear) {
                const dx = m3d.x - x1;
                const dy = m3d.y - y2;
                const dz = m3d.z - z2;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < magneticRadius) {
                    const pull = (1 - dist / magneticRadius) * magneticForce;
                    p.magneticOffset.x += (dx * pull - p.magneticOffset.x) * 0.15;
                    p.magneticOffset.y += (dy * pull - p.magneticOffset.y) * 0.15;
                    p.magneticOffset.z += (dz * pull - p.magneticOffset.z) * 0.15;
                } else {
                    p.magneticOffset.x *= 0.85;
                    p.magneticOffset.y *= 0.85;
                    p.magneticOffset.z *= 0.85;
                }
            } else {
                p.magneticOffset.x *= 0.85;
                p.magneticOffset.y *= 0.85;
                p.magneticOffset.z *= 0.85;
            }

            x1 += p.magneticOffset.x;
            y2 += p.magneticOffset.y;
            z2 += p.magneticOffset.z;

            // Perspective division 3D-to-2D
            const factor = projectionFov / (projectionFov + z2);
            const zoomScale = factor * cameraZoom.scale;
            p.px = x1 * zoomScale + width / 2 + cameraZoom.offsetX;
            p.py = y2 * zoomScale + height / 2 + cameraZoom.offsetY;
            p.pz = z2;
        }
    }

    // Render Canvas neural wireframes and glowing points
    function drawGlobe() {
        ctx.clearRect(0, 0, width, height);
        time++;

        const maxDist = 38;
        ctx.lineWidth = 0.55;
        
        for (let i = 0; i < particles.length; i += 3) {
            const p1 = particles[i];
            if (p1.pz > 40) continue;

            for (let j = i + 1; j < particles.length; j += 15) {
                const p2 = particles[j];
                
                const dx = p1.ox - p2.ox;
                const dy = p1.oy - p2.oy;
                const dz = p1.oz - p2.oz;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (dist < maxDist) {
                    let opacity = (1 - dist / maxDist) * themeColors.lineIntensity;
                    
                    const activeQuadrant = activeNodeIndex !== -1 ? activeNodeIndex : hoveredNodeIndex;
                    if (activeQuadrant !== -1 && p1.colorType === activeQuadrant && p2.colorType === activeQuadrant) {
                        opacity *= 2.8;
                        ctx.strokeStyle = `rgba(${p1.colorType === 0 ? '6, 182, 212' : p1.colorType === 1 ? '139, 92, 246' : p1.colorType === 2 ? '236, 72, 153' : p1.colorType === 3 ? '245, 158, 11' : '16, 185, 129'}, ${opacity})`;
                    } else {
                        ctx.strokeStyle = themeColors.neuralLine;
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.stroke();
                }
            }
        }

        drawDataStreams();

        // Render vertices
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            const alpha = Math.max(0.08, (projectionFov - p.pz) / (projectionFov * 1.5));
            const size = Math.max(0.6, (1.8 * (projectionFov - p.pz)) / projectionFov);

            let clr = themeColors.particleBase;
            
            if (p.colorType === 0) clr = "rgba(6, 182, 212,";
            else if (p.colorType === 1) clr = "rgba(139, 92, 246,";
            else if (p.colorType === 2) clr = "rgba(236, 72, 153,";
            else if (p.colorType === 3) clr = "rgba(245, 158, 11,";
            else if (p.colorType === 4) clr = "rgba(16, 185, 129,";

            let mult = 1.0;
            const activeQuadrant = activeNodeIndex !== -1 ? activeNodeIndex : hoveredNodeIndex;
            if (activeQuadrant !== -1) {
                mult = p.colorType === activeQuadrant ? 1.9 : 0.20;
            }

            ctx.fillStyle = clr + (alpha * p.brightness * mult) + ")";
            
            ctx.beginPath();
            ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Dynamic data shooting stream animation
    function drawDataStreams() {
        if (streamParticles.length === 0) return;

        for (let i = streamParticles.length - 1; i >= 0; i--) {
            const sp = streamParticles[i];
            sp.progress += sp.speed;

            if (sp.progress >= 1.0) {
                streamParticles.splice(i, 1);
                continue;
            }

            const startX = sp.startX;
            const startY = sp.startY;
            
            const destX = width / 2 + cameraZoom.offsetX;
            const destY = height / 2 + cameraZoom.offsetY;

            const ctrlX = (startX + destX) / 2 + Math.sin(sp.progress * Math.PI + sp.seed) * 50;
            const ctrlY = (startY + destY) / 2 + Math.cos(sp.progress * Math.PI + sp.seed) * 50;

            const mt = 1 - sp.progress;
            const x = mt * mt * startX + 2 * mt * sp.progress * ctrlX + sp.progress * sp.progress * destX;
            const y = mt * mt * startY + 2 * mt * sp.progress * ctrlY + sp.progress * sp.progress * destY;

            ctx.fillStyle = sp.color;
            ctx.shadowColor = sp.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, sp.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }

    function spawnDataStream(startX, startY, color, count = 3) {
        for (let i = 0; i < count; i++) {
            streamParticles.push({
                startX: startX,
                startY: startY,
                progress: 0,
                speed: 0.025 + Math.random() * 0.02,
                size: 2.2 + Math.random() * 2,
                color: color,
                seed: Math.random() * Math.PI * 2
            });
        }
    }

    // Core Animation Tick
    function tick() {
        rotatePoints();
        drawGlobe();
        syncSatellitePositions();
        requestAnimationFrame(tick);
    }

    // Symmetrical positions surrounding the globe (never collide!)
    function syncSatellitePositions() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        if (window.innerWidth <= 768) {
            nodes.forEach(node => {
                node.style.left = "";
                node.style.top = "";
                node.style.transform = "";
                node.style.zIndex = "";
                node.style.opacity = "";
            });
            return;
        }

        nodes.forEach((node, index) => {
            const idx = parseInt(node.getAttribute('data-index'));
            const pos = basePositions[idx];
            
            const screenX = (pos.left / 100) * rect.width + cameraZoom.offsetX;
            const screenY = (pos.top / 100) * rect.height + cameraZoom.offsetY;
            
            const floatX = Math.sin(time * 0.02 + idx) * 4;
            const floatY = Math.cos(time * 0.02 + idx) * 4;

            node.style.left = `${screenX + floatX}px`;
            node.style.top = `${screenY + floatY}px`;
            
            // Satellites stay perfectly stationed and visible at all times!
            node.style.transform = "translate(-50%, -50%) scale(1.0)";
            node.style.zIndex = 10;
            
            // Dim other nodes slightly only if popup is open or hovered to direct focus
            const activeQuadrant = activeNodeIndex !== -1 ? activeNodeIndex : hoveredNodeIndex;
            if (activeQuadrant !== -1 && idx !== activeQuadrant) {
                node.style.opacity = 0.35;
            } else {
                node.style.opacity = 1.0;
            }
        });
    }

    // ─── INTERACTION TRIGGERS (HOVER / CLICK PERSISTENT POPUP) ─────────────────
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        
        const dx = mouse.x - width / 2;
        const dy = mouse.y - height / 2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        mouse.isNear = dist < 250;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        mouse.isNear = false;
    });

    nodes.forEach(node => {
        const idx = parseInt(node.getAttribute('data-index'));
        const inner = node.querySelector('.satellite-inner');

        node.classList.add('cursor-pointer');

        node.addEventListener('mouseenter', (e) => {
            if (window.innerWidth <= 768) return; // Skip hover on mobile
            if (isActivePopOpen) return; // Keep focus locked to active popup
            hoveredNodeIndex = idx;
            inner.classList.add(`sat-inner-bg-active-${idx}`);

            const angles = [Math.PI*0.75, Math.PI*1.25, Math.PI*0.25, Math.PI*1.75, Math.PI];
            rotation.targetY = -angles[idx] * 0.45;
            rotation.targetX = idx < 2 ? 0.35 : 0.15;

            // Update and position temporary hover tooltip next to satellite
            const activeData = nodeData[idx];
            if (previewTitle) previewTitle.textContent = activeData.title;
            if (previewSubtitle) {
                previewSubtitle.textContent = activeData.subtitle;
                previewSubtitle.style.color = activeData.color;
            }
            if (previewDesc) previewDesc.textContent = activeData.desc;
            if (previewStatusDot) {
                previewStatusDot.style.backgroundColor = activeData.color;
                previewStatusDot.style.boxShadow = `0 0 10px ${activeData.color}`;
            }
            
            if (preview) {
                const hint = preview.querySelector('.btn-command-hint');
                if (hint) hint.style.color = activeData.color;

                alignCardToNode(preview, node);
                preview.classList.remove('hide');
                preview.classList.add('show');
            }

            spawnDataStream(parseFloat(node.style.left) || 0, parseFloat(node.style.top) || 0, activeData.color, 4);
        });

        node.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return; // Skip hover on mobile
            if (isActivePopOpen) return;
            hoveredNodeIndex = -1;
            inner.classList.remove(`sat-inner-bg-active-${idx}`);
            if (preview) {
                preview.classList.remove('show');
                preview.classList.add('hide');
            }
        });

        // Mobile tap/click accordion toggling
        node.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const isAlreadyActive = (hoveredNodeIndex === idx && preview && !preview.classList.contains('hide'));
                
                if (isAlreadyActive) {
                    hoveredNodeIndex = -1;
                    inner.classList.remove(`sat-inner-bg-active-${idx}`);
                    if (preview) {
                        preview.classList.remove('show');
                        preview.classList.add('hide');
                    }
                } else {
                    // Reset all other highlighted states
                    nodes.forEach((n, i) => {
                        n.querySelector('.satellite-inner').classList.remove(`sat-inner-bg-active-${i}`);
                    });
                    
                    hoveredNodeIndex = idx;
                    inner.classList.add(`sat-inner-bg-active-${idx}`);
                    
                    const activeData = nodeData[idx];
                    if (previewTitle) previewTitle.textContent = activeData.title;
                    if (previewSubtitle) {
                        previewSubtitle.textContent = activeData.subtitle;
                        previewSubtitle.style.color = activeData.color;
                    }
                    if (previewDesc) previewDesc.textContent = activeData.desc;
                    if (previewStatusDot) {
                        previewStatusDot.style.backgroundColor = activeData.color;
                        previewStatusDot.style.boxShadow = `0 0 10px ${activeData.color}`;
                    }
                    
                    if (preview) {
                        const hint = preview.querySelector('.btn-command-hint');
                        if (hint) hint.style.color = activeData.color;

                        // Insert immediately after current node in stacked DOM flow
                        node.parentNode.insertBefore(preview, node.nextSibling);
                        
                        alignCardToNode(preview, node);
                        preview.classList.remove('hide');
                        preview.classList.add('show');
                    }
                }
            }
        });
    });

    // Positions floating cards cleanly to avoid blocking central view
    function alignCardToNode(cardEl, nodeEl) {
        if (window.innerWidth <= 768) {
            cardEl.style.left = "";
            cardEl.style.top = "";
            return;
        }

        const nodeRect = nodeEl.getBoundingClientRect();
        const wrapRect = document.getElementById('ecosystem-view-wrapper').getBoundingClientRect();
        const nodeIndex = parseInt(nodeEl.getAttribute('data-index'));
        
        let posX = 0;
        let posY = (nodeRect.top - wrapRect.top) - 30; // slightly above vertical center for clean alignment

        if (nodeIndex === 0 || nodeIndex === 1) {
            // Left side nodes: show preview card on the RIGHT side of the node
            posX = (nodeRect.left - wrapRect.left) + nodeRect.width + 20;
        } else {
            // Right side nodes: show preview card on the LEFT side of the node
            posX = (nodeRect.left - wrapRect.left) - 310 - 20;
        }

        // Side constraints to prevent viewport overflow
        if (posX < 10) posX = 10;
        if (posX > wrapRect.width - 320) posX = wrapRect.width - 320;

        cardEl.style.left = `${posX}px`;
        cardEl.style.top = `${posY}px`;
    }

    // Trigger persistent active popup next to satellite
    function triggerActivePopup(idx, nodeEl) {
        if (!activePop) return;
        // Close hover preview
        if (preview) {
            preview.classList.remove('show');
            preview.classList.add('hide');
        }

        isActivePopOpen = true;
        activeNodeIndex = idx;
        const activeData = nodeData[idx];

        // Active node border highlight
        nodes.forEach(n => n.querySelector('.satellite-inner').classList.remove('active'));
        nodeEl.querySelector('.satellite-inner').classList.add('active');

        // Capture element screen coordinates (safeguarded)
        const startX = parseFloat(nodeEl.style.left) || (width / 2);
        const startY = parseFloat(nodeEl.style.top) || (height / 2);

        // Explode massive particle burst directly from card into globe core! (Shockwave cursor effect)
        spawnDataStream(startX, startY, activeData.color, 16);

        // Fade out the globe and other satellite nodes, then set display none to collapse layout space
        gsap.to([canvas, ...nodes], {
            opacity: 0,
            scale: 0.9,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
                canvas.style.display = "none";
                nodes.forEach(n => {
                    n.style.display = "none";
                });
            }
        });

        // Set Active Pop Content
        popTitle.textContent = activeData.title;
        popSubtitle.textContent = activeData.subtitle;
        popSubtitle.style.color = activeData.color;
        popDesc.textContent = activeData.desc;

        // Custom action CTA button coloring
        const actBtn = activePop.querySelector('.btn-pop-action');
        actBtn.style.background = `linear-gradient(135deg, ${activeData.color}, var(--clr-purple))`;
        actBtn.style.boxShadow = `0 4px 15px rgba(${activeData.colorRGB}, 0.25)`;

        // Populate specs container list
        popSpecsContainer.innerHTML = "";
        activeData.specs.forEach(spec => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle-check" style="color:${activeData.color};"></i> <span>${spec}</span>`;
            popSpecsContainer.appendChild(li);
        });

        // Position active popup exactly over the clicked satellite node
        if (window.innerWidth <= 768) {
            activePop.style.position = "relative";
            activePop.style.left = "";
            activePop.style.top = "";
            activePop.style.transform = "";
        } else {
            activePop.style.position = "absolute";
            activePop.style.left = nodeEl.style.left;
            activePop.style.top = nodeEl.style.top;
        }

        activePop.classList.add('overlay-node');
        activePop.classList.remove('hide');
        activePop.classList.add('show');
        
        // Add active-mode tag to section container to control glows
        section.classList.add('active-mode');
    }

    // Dismiss active popup
    function closeActivePopup() {
        if (!activePop) return;
        isActivePopOpen = false;
        activeNodeIndex = -1;
        hoveredNodeIndex = -1;

        // Hide Pop
        activePop.classList.remove('show');
        activePop.classList.remove('overlay-node');
        activePop.classList.add('hide');
        
        // Clear layout placement overrides
        activePop.style.position = "";
        activePop.style.left = "";
        activePop.style.top = "";
        activePop.style.transform = "";
        
        // Remove active-mode tag to restore normal glows
        section.classList.remove('active-mode');

        // Reset active node indicators
        nodes.forEach(n => {
            const inner = n.querySelector('.satellite-inner');
            inner.classList.remove('active');
            inner.classList.remove('sat-inner-bg-active-0', 'sat-inner-bg-active-1', 'sat-inner-bg-active-2', 'sat-inner-bg-active-3', 'sat-inner-bg-active-4');
        });

        // Restore canvas and nodes displays
        canvas.style.display = "";
        nodes.forEach(n => {
            n.style.display = "";
        });

        // Animate them back in beautifully
        gsap.fromTo([canvas, ...nodes], 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );

        // Restore camera coordinates to center defaults smoothly
        gsap.to(cameraZoom, {
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        // Restore standard baseline rotations
        rotationSpeed = 0.002;
    }

    // Bind popup close action button click
    if (closePopBtn) {
        closePopBtn.onclick = () => {
            closeActivePopup();
        };
    }

    // ─── INITIALIZE & ANIMATION TICK START ──────────────────────────────────────
    initGlobe();
    resizeCanvas();
    tick();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initGlobe();
        if (isActivePopOpen) closeActivePopup();
    });
});
