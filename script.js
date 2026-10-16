/* =========================================================
   SAHP LEADER APPLICATION
   Stable JavaScript — repaired version
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================================
       LOADER — never block the website indefinitely
    ===================================================== */

    const loader = $("#loader");
    const loaderBar = $("#loaderBar");
    const loaderPercent = $("#loaderPercent");
    const loaderStatus = $("#loaderStatus");

    const loadingMessages = [
        "INITIALISIERE SYSTEM...",
        "LADE SAHP DATABASE...",
        "ÜBERPRÜFE PERSONNEL FILE...",
        "LADE ORGANISATIONSKONZEPT...",
        "INITIALISIERE APPLICATION...",
        "SYSTEM READY."
    ];

    let loaderFinished = false;
    let loaderTimer = null;

    function finishLoader() {
        if (loaderFinished) return;
        loaderFinished = true;

        if (loaderTimer) clearInterval(loaderTimer);

        if (loaderBar) loaderBar.style.width = "100%";
        if (loaderPercent) loaderPercent.textContent = "100%";
        if (loaderStatus) loaderStatus.textContent = "SYSTEM READY.";

        if (loader) {
            window.setTimeout(() => {
                loader.classList.add("loaded");
                document.body.classList.add("sahp-ready");
            }, reducedMotion ? 0 : 350);
        } else {
            document.body.classList.add("sahp-ready");
        }
    }

    if (loader) {
        let progress = 0;
        let messageIndex = 0;

        if (reducedMotion) {
            finishLoader();
        } else {
            loaderTimer = window.setInterval(() => {
                progress = Math.min(
                    progress + Math.floor(Math.random() * 7) + 2,
                    100
                );

                if (loaderBar) {
                    loaderBar.style.width = `${progress}%`;
                }

                if (loaderPercent) {
                    loaderPercent.textContent = `${progress}%`;
                }

                const nextMessage = Math.min(
                    Math.floor(progress / 20),
                    loadingMessages.length - 1
                );

                if (nextMessage > messageIndex) {
                    messageIndex = nextMessage;
                    if (loaderStatus) {
                        loaderStatus.textContent =
                            loadingMessages[messageIndex];
                    }
                }

                if (progress >= 100) finishLoader();
            }, 90);

            // Safety fallback in case something interrupts the timer.
            window.setTimeout(finishLoader, 8000);
        }
    } else {
        document.body.classList.add("sahp-ready");
    }

    /* =====================================================
       REVEAL ON SCROLL
    ===================================================== */

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element =>
            element.classList.add("visible")
        );
    }

    /* =====================================================
       SCROLL PROGRESS + BACK TO TOP
    ===================================================== */

    const progressBar = $("#scrollProgress");
    const backToTop = $("#backToTop");

    function updateScrollUI() {
        const scrollTop = window.scrollY || 0;
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = maxScroll > 0
            ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100))
            : 0;

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollTop > 600);
        }
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI);
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenu = $("#mobileMenu");
    const navMenu = $("#navMenu") || $("header nav");

    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove("open");
        if (mobileMenu) {
            mobileMenu.setAttribute("aria-expanded", "false");
        }
    }

    if (mobileMenu && navMenu) {
        mobileMenu.setAttribute("aria-controls", "navMenu");
        mobileMenu.setAttribute("aria-expanded", "false");

        mobileMenu.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            mobileMenu.setAttribute("aria-expanded", String(isOpen));
        });

        $$("a", navMenu).forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });
    }

    /* =====================================================
       RANK FILTER
    ===================================================== */

    const rankFilters = $$(".rank-filter");
    const rankCards = $$(".rank-card");

    rankFilters.forEach(button => {
        button.addEventListener("click", () => {
            rankFilters.forEach(filterButton => {
                filterButton.classList.toggle(
                    "active",
                    filterButton === button
                );
                filterButton.setAttribute(
                    "aria-pressed",
                    String(filterButton === button)
                );
            });

            const filter = button.dataset.filter || "all";

            rankCards.forEach(card => {
                const matches =
                    filter === "all" ||
                    card.dataset.category === filter;

                card.classList.toggle("hidden", !matches);
            });
        });
    });

    /* =====================================================
       TRAINING FILTER
    ===================================================== */

    const trainingFilters = $$(".training-filter");
    const trainingCards = $$(".training-card");

    trainingFilters.forEach(button => {
        button.addEventListener("click", () => {
            trainingFilters.forEach(filterButton => {
                filterButton.classList.toggle(
                    "active",
                    filterButton === button
                );
                filterButton.setAttribute(
                    "aria-pressed",
                    String(filterButton === button)
                );
            });

            const filter = button.dataset.trainingFilter || "all";

            trainingCards.forEach(card => {
                const matches =
                    filter === "all" ||
                    card.dataset.training === filter;

                card.classList.toggle("hidden", !matches);
            });
        });
    });

    /* =====================================================
       MOUSE GLOW
    ===================================================== */

    const mouseGlow = $("#mouseGlow");

    if (mouseGlow && !reducedMotion) {
        window.addEventListener("mousemove", event => {
            mouseGlow.style.left = `${event.clientX}px`;
            mouseGlow.style.top = `${event.clientY}px`;
        }, { passive: true });
    }

    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const hero = $(".hero");
    const heroContent = $(".hero-content");

    if (hero && heroContent && !reducedMotion) {
        hero.addEventListener("mousemove", event => {
            const rect = hero.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const moveX = (x - rect.width / 2) / 70;
            const moveY = (y - rect.height / 2) / 70;

            heroContent.style.transform =
                `translate(${moveX}px, ${moveY}px)`;
        });

        hero.addEventListener("mouseleave", () => {
            heroContent.style.transform = "translate(0, 0)";
        });
    }

    /* =====================================================
       TILT CARDS
    ===================================================== */

    if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
        $$(".tilt-card").forEach(card => {
            card.addEventListener("mousemove", event => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateX = (y - rect.height / 2) / 30;
                const rotateY = (rect.width / 2 - x) / 30;

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) ` +
                    `rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform =
                    "perspective(900px) rotateX(0deg) rotateY(0deg)";
            });
        });
    }

    /* =====================================================
       PARTICLES — only run when the canvas is available
    ===================================================== */

    const canvas = $("#particles");
    const ctx = canvas ? canvas.getContext("2d") : null;

    if (canvas && ctx && !reducedMotion) {
        let particles = [];
        let canvasWidth = 0;
        let canvasHeight = 0;
        let animationFrame = null;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;

            canvas.width = Math.floor(canvasWidth * dpr);
            canvas.height = Math.floor(canvasHeight * dpr);
            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            createParticles();
        }

        function createParticles() {
            const amount = Math.min(
                70,
                Math.max(15, Math.floor(canvasWidth / 18))
            );

            particles = Array.from({ length: amount }, () => ({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: Math.random() * 1.5 + 0.3,
                speed: Math.random() * 0.25 + 0.05,
                opacity: Math.random() * 0.45 + 0.1
            }));
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            particles.forEach(particle => {
                particle.y -= particle.speed;

                if (particle.y < -10) {
                    particle.y = canvasHeight + 10;
                    particle.x = Math.random() * canvasWidth;
                }

                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(120, 213, 255, ${particle.opacity})`;
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Pause animation in a hidden tab to save resources.
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (animationFrame) cancelAnimationFrame(animationFrame);
                animationFrame = null;
            } else if (!animationFrame) {
                animateParticles();
            }
        });

        animateParticles();
    }

    /* =====================================================
       COMMAND PALETTE — optional HTML component
    ===================================================== */

    const commandPalette = $("#commandPalette");
    const closeCommandButton = $("#closeCommand");

    function openCommandPalette() {
        if (!commandPalette) return;
        commandPalette.classList.add("open");
        commandPalette.setAttribute("aria-hidden", "false");
        if (commandSearch) commandSearch.focus();
        else if (closeCommandButton) closeCommandButton.focus();
    }

    function closeCommandPalette() {
        if (!commandPalette) return;
        commandPalette.classList.remove("open");
        commandPalette.setAttribute("aria-hidden", "true");
    }

    if (closeCommandButton) {
        closeCommandButton.addEventListener("click", closeCommandPalette);
    }

    if (commandPalette) {
        commandPalette.addEventListener("click", event => {
            if (event.target === commandPalette) {
                closeCommandPalette();
            }
        });

        $$(".command-items a", commandPalette).forEach(link => {
            link.addEventListener("click", closeCommandPalette);
        });
    }

    document.addEventListener("keydown", event => {
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k" &&
            commandPalette
        ) {
            event.preventDefault();
            openCommandPalette();
        }

        if (event.key === "Escape") {
            closeCommandPalette();
            closeMobileMenu();
        }
    });


    /* =====================================================
       QUICK ACTIONS + LIVE COMMAND SEARCH
    ===================================================== */
    const openCommandButton = $("#openCommand");
    const printButton = $("#printPage");
    const commandSearch = $("#commandSearch");

    if (openCommandButton) openCommandButton.addEventListener("click", openCommandPalette);
    if (printButton) printButton.addEventListener("click", () => window.print());

    if (commandSearch && commandPalette) {
        commandSearch.addEventListener("input", () => {
            const query = commandSearch.value.trim().toLocaleLowerCase("de");
            $$(".command-items a", commandPalette).forEach(link => {
                const matches = link.textContent.toLocaleLowerCase("de").includes(query);
                link.hidden = !matches;
            });
        });
    }

    /* =====================================================
       NEXT MEETING COUNTDOWN — Wednesday and Saturday 19:00
    ===================================================== */
    const nextMeetingTitle = $("#nextMeetingTitle");
    const nextMeetingCountdown = $("#nextMeetingCountdown");
    const meetingSchedule = [
        { day: 3, hour: 19, minute: 0, title: "Mid-Weekly · Mittwoch 19:00 Uhr" },
        { day: 5, hour: 19, minute: 30, title: "Abteilungsleiter-Meeting · Freitag 19:30 Uhr" },
        { day: 6, hour: 19, minute: 0, title: "Weekly Meeting · Samstag 19:00 Uhr" }
    ];

    function updateMeetingCountdown() {
        if (!nextMeetingTitle || !nextMeetingCountdown) return;
        const now = new Date();
        const candidates = meetingSchedule.map(meeting => {
            const target = new Date(now);
            let daysUntil = (meeting.day - now.getDay() + 7) % 7;
            target.setDate(now.getDate() + daysUntil);
            target.setHours(meeting.hour, meeting.minute, 0, 0);
            if (target <= now) {
                target.setDate(target.getDate() + 7);
                daysUntil += 7;
            }
            return { ...meeting, target };
        }).sort((a, b) => a.target - b.target);
        const next = candidates[0];
        const remaining = Math.max(0, next.target - now);
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        nextMeetingTitle.textContent = next.title;
        nextMeetingCountdown.textContent = days > 0
            ? `In ${days} Tag${days === 1 ? "" : "en"} · ${hours} Std. · ${minutes} Min.`
            : `In ${hours} Std. · ${minutes} Min. · ${seconds} Sek.`;
    }
    updateMeetingCountdown();
    window.setInterval(updateMeetingCountdown, 1000);

    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections = $$("main section[id]");
    const navLinks = navMenu ? $$("a[href^='#']", navMenu) : [];

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach(link => {
                        const active =
                            link.getAttribute("href") === `#${entry.target.id}`;

                        link.classList.toggle("active", active);

                        if (active) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            { rootMargin: "-35% 0px -55% 0px" }
        );

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* =====================================================
       COUNTER HELPER — available if needed later
    ===================================================== */

    function animateCounter(element, target, suffix = "") {
        if (!element) return;

        if (reducedMotion) {
            element.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            element.textContent =
                `${Math.floor(progress * target)}${suffix}`;

            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // Keep helper available for future counters without changing the layout.
    window.sahpAnimateCounter = animateCounter;

    document.body.classList.add("sahp-ready");
});