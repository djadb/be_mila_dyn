document.addEventListener("DOMContentLoaded", () => {
    applyLang();
    applyTranslations();

    // Run after theme.js has initialized all Slick carousels
    setTimeout(async () => {
        applyTranslations();
        forceTranslateSlick();
        await loadCompany();
        await loadFeaturedProjects();
    }, 600);
});

// ─── LANGUAGE ────────────────────────────────────────────────────

function applyLang() {
    const lang = getLang();
    const isRTL = lang === "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isRTL);
    document.querySelectorAll(".lang-link").forEach(el => {
        el.classList.toggle("active", el.dataset.lang === lang);
    });
}

function applyTranslations() {
    document.querySelectorAll("[data-t]").forEach(el => {
        el.innerHTML = t(el.dataset.t);
    });
    document.querySelectorAll("[data-tp]").forEach(el => {
        el.placeholder = t(el.dataset.tp);
    });
}

// Slick clones slides — must translate cloned items too
function forceTranslateSlick() {
    document.querySelectorAll(".slick-cloned [data-t]").forEach(el => {
        el.innerHTML = t(el.dataset.t);
    });
    document.querySelectorAll(".slick-cloned [data-tp]").forEach(el => {
        el.placeholder = t(el.dataset.tp);
    });
}

// ─── COMPANY ─────────────────────────────────────────────────────

async function loadCompany() {
    try {
        const res = await fetch(`${API_BASE}/company/main/`);
        if (!res.ok) { console.warn("No main company configured."); return; }
        const company = await res.json();

        // ── About description
        const descEl = document.getElementById("company-description");
        if (descEl) {
            const text = field(company, "description");
            if (text) descEl.innerHTML = text;  // ← innerHTML renders the HTML tags
        }

        // ── Qualities → feature cards
        if (company.qualities?.length) {
            renderQualities(company.qualities);
        }
        if (company.domains?.length) { renderDomains(company.domains); }

        // ── Footer contact info
        renderFooterContact(company);

        // ── Partners brand carousel
        renderPartners(company.partners || []);

    } catch (err) {
        console.error("Failed to load company:", err);
    }
}

// ─── QUALITIES ───────────────────────────────────────────────────

function renderQualities(qualities) {
    const container = document.getElementById("qualities-cards");
    if (!container) return;

    const icons = [
        "flaticon-file", "flaticon-book", "flaticon-shield",
        "flaticon-pen", "flaticon-plane", "flaticon-fingerprint"
    ];
    const numbers = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

    // unslick first if already initialized
    const $carousel = $(container);
    if ($carousel.hasClass("slick-initialized")) {
        $carousel.slick("unslick");
    }

    container.innerHTML = qualities.map((q, i) => {
        const iconEl = q.icon?.image_url
            ? `<img src="${q.icon.image_url}" alt="${field(q, 'name')}"
                    style="height:50px;object-fit:contain;">`
            : `<i class="flaticon ${icons[i % icons.length]}"></i>`;

        return `
        <div>
            <div class="txbdsva allcostyle boxsh boxpsv text-center sselect"
                 style="margin: 0 10px;">
                <span class="thbdspanposi">${numbers[i] || String(i + 1).padStart(2, '0')}</span>
                <div class="txbdsi">
                    <div class="txbdicon iconalltf iconall iconallactive">${iconEl}</div>
                    <div class="txbdcon">
                        <h2 class="txbdsvtitle txstcolor hlight">${field(q, "name")}</h2>
                       <!-- <p>${t("step_desc")}</p>
                        <div class="txbdsvbtn txbdbtnicon">
                            <a class="btnallt btnall" href="contact.html">
                                ${t("read_more")} <i class="ti ti-angle-double-right"></i>
                            </a>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>`;
    }).join("");

    const total = qualities.length;

    setTimeout(() => {
        $carousel.slick({
            infinite: false,      // ← no round robin
            autoplay: false,
            slidesToShow: Math.min(total, 3),
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: { slidesToShow: Math.min(total, 3), slidesToScroll: 1 }
                },
                {
                    breakpoint: 992,
                    settings: { slidesToShow: Math.min(total, 2), slidesToScroll: 1 }
                },
                {
                    breakpoint: 767,
                    settings: { slidesToShow: 1, slidesToScroll: 1 }
                }
            ]
        });
    }, 100);
}

// ─── DOMAINS  ──────
function renderDomains(domains) {
    const container = document.getElementById("domains-container");
    if (!container || !domains.length) return;

    const fallbackIcons = [
        "flaticon-pen", "flaticon-book", "flaticon-shield",
        "flaticon-plane", "flaticon-fingerprint", "flaticon-cloud-computing-1",
        "flaticon-file", "flaticon-phone-call"
    ];

    container.innerHTML = domains.map((d, i) => {
        const name = field(d, "name");
        const desc = field(d, "description");
        const iconEl = d.icon?.image_url
            ? `<img src="${d.icon.image_url}" alt="${name}"
                    style="height:50px;object-fit:contain;">`
            : `<i class="flaticon ${fallbackIcons[i % fallbackIcons.length]}"></i>`;

        return `
        <div class="col-lg-4 col-md-6">
            <div class="txbdsva allcostyle boxsh boxpsv text-center txbdbfall txbdbfltrb100 txbdboxallhover opacitybfh1">
                <div class="txbdsi">
                    <div class="txbdicon iconalltf iconall iconallactive">${iconEl}</div>
                    <div class="txbdcon">
                        <h2 class="txbdsvtitle txstcolor hlight">${name}</h2>
                        ${desc ? `<p>${desc}</p>` : ""}
                        <div class="txbdsvbtn txbdbtnicon">
                            <a class="btnallt btnall" href="contact.html">
                                ${t("read_more")} <i class="ti ti-angle-double-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join("");
}

// ─── PARTNERS  ──────

function renderPartners(partners) {
    const container = document.getElementById("partners-container");
    if (!container || !partners.length) return;

    const $carousel = $(container);

    // Step 1 — unslick (Slick's own destroy method)
    if ($carousel.hasClass("slick-initialized")) {
        $carousel.slick("unslick");
    }

    // Step 2 — inject fresh HTML (no leftover Slick wrappers now)
    container.innerHTML = partners.map(p => {
        const name = field(p, "name") || p.name_en || p.name_fr || "";
        const logoHtml = p.logo
            ? `<img src="${p.logo}" alt="${name}"
                    style="max-height:60px;object-fit:contain;display:block;margin:auto;">`
            : `<span style="display:block;padding:10px 20px;font-weight:700;
                            text-align:center;">${name}</span>`;
        return `<div class="slide_items"><a class="txbdbfoverlay" href="#">${logoHtml}</a></div>`;
    }).join("");

    // Step 3 — reinit with same Slick config as theme.js brand_active
    setTimeout(() => {
        $carousel.slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 1000,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            responsive: [
                { breakpoint: 1200, settings: { slidesToShow: 5, slidesToScroll: 1 } },
                { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 1 } },
                { breakpoint: 767, settings: { slidesToShow: 2, slidesToScroll: 1 } }
            ]
        });
    }, 100);
}

// ─── FEATURED PROJECTS  ─────────────
/*
async function loadFeaturedProjects() {
    const container = document.getElementById("featured-projects-container");
    if (!container) return;

    try {
        const res  = await fetch(`${API_BASE}/projects/?featured=true`);
        const data = await res.json();
        const projects = data.results || data || [];

        if (!Array.isArray(projects) || projects.length === 0) return;

        const $carousel = $(container);
        if ($carousel.hasClass("slick-initialized")) {
            $carousel.slick("unslick");
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return d.toLocaleDateString(
                getLang() === "ar" ? "ar-DZ" :
                getLang() === "fr" ? "fr-FR" : "en-GB",
                { year: "numeric", month: "long" }
            );
        };

        container.innerHTML = projects.map(project => {
            const img    = project.images?.[0]?.image_url || "assets/images/pot01.jpg";
            const title  = field(project, "title");
            const status = project.status ? field(project.status, "status") : null;

            const endDate   = project.end_date        ? formatDate(project.end_date)        : null;
            const startDate = project.start_date      ? formatDate(project.start_date)      : null;
            const estDate   = project.estimated_date  ? formatDate(project.estimated_date)  : null;

            // use status_en for reliable condition matching regardless of selected language
            const statusEn  = project.status?.status_en?.toLowerCase() || "";
            let dateLabel   = "";

            if (statusEn === "finished") {
                dateLabel = endDate || "";
            } else if (statusEn === "in progress") {
                dateLabel = estDate || startDate || "";
            } else if (statusEn === "paused" || statusEn === "delayed") {
                dateLabel = startDate || "";
            } else if (statusEn === "pending") {
                dateLabel = startDate || "";
            } else if (statusEn === "cancelled") {
                dateLabel = "";
            }

            const statusHtml = status ? `
                <p class="proj-status">
                    ${status}
                    ${dateLabel ? `<span class="proj-date">${dateLabel}</span>` : ""}
                </p>` : "";

            return `
            <div class="item_pos col-lg-12">
                <div class="witr_single_pslide proj-hover-card">
                    <div class="witr_pslide_image">
                        <img src="${img}" alt="${title}"
                             style="width:100%;height:300px;object-fit:cover;display:block;">
                    </div>
                    <div class="proj-overlay">
                        <div class="proj-overlay-content">
                            <h2><a href="project.html?id=${project.id}">${title}</a></h2>
                            ${statusHtml}
                        </div>
                    </div>
                    <div class="witr_pslide_custom">
                        <a href="project.html?id=${project.id}" tabindex="-1">
                            <span class="txbdbrac ti-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>`;
        }).join("");

        setTimeout(() => {
            $carousel.slick({
                infinite:      true,
                autoplay:      true,
                autoplaySpeed: 6000,
                speed:         2000,
                slidesToShow:  3,
                slidesToScroll:1,
                arrows:        true,
                dots:          false,
                responsive: [
                    { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
                    { breakpoint: 992,  settings: { slidesToShow: 2, slidesToScroll: 1 } },
                    { breakpoint: 767,  settings: { slidesToShow: 1, slidesToScroll: 1 } }
                ]
            });
        }, 100);

    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}
*/
async function loadFeaturedProjects() {
    const container = document.getElementById("featured-projects-container");
    if (!container) return;

    try {
        const res  = await fetch(`${API_BASE}/projects/?featured=true`);
        const data = await res.json();
        const projects = data.results || data || [];

        if (!Array.isArray(projects) || projects.length === 0) return;

        const $carousel = $(container);
        if ($carousel.hasClass("slick-initialized")) {
            $carousel.slick("unslick");
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return d.toLocaleDateString(
                getLang() === "ar" ? "ar-DZ" :
                getLang() === "fr" ? "fr-FR" : "en-GB",
                { year: "numeric", month: "long" }
            );
        };

        container.innerHTML = projects.map(project => {
            const img      = project.images?.[0]?.image_url || "assets/images/pot01.jpg";
            const title    = field(project, "title");
            const status   = project.status ? field(project.status, "status") : null;
            const statusEn = project.status?.status_en?.toLowerCase() || "";

            const endDate   = project.end_date       ? formatDate(project.end_date)       : null;
            const startDate = project.start_date     ? formatDate(project.start_date)     : null;
            const estDate   = project.estimated_date ? formatDate(project.estimated_date) : null;

            let dateLabel = "";
            if      (statusEn === "finished")                        dateLabel = endDate   || "";
            else if (statusEn === "in progress")                     dateLabel = estDate   || startDate || "";
            else if (statusEn === "paused" || statusEn === "delayed") dateLabel = startDate || "";
            else if (statusEn === "pending")                         dateLabel = startDate || "";

            // status line — same style as static "En Pause" / "En Cours Realise"
            const statusLine = status
                ? `${status}${dateLabel ? " — " + dateLabel : ""}`
                : "";

            return `
            <div class="item_pos col-lg-12">
                <div class="witr_single_pslide">
                    <div class="witr_pslide_image">
                        <img src="${img}" alt="${title}">
                    </div>
                    <div class="witr_content_pslide_text">
                        <div class="witr_content_pslide">
                            <h2><a href="project.html?id=${project.id}">${title}</a></h2>
                            ${statusLine ? `<p>${statusLine}</p>` : ""}
                        </div>
                    </div>
                    <div class="witr_pslide_custom">
                        <a href="project.html?id=${project.id}" tabindex="-1">
                            <span class="txbdbrac ti-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>`;
        }).join("");

        setTimeout(() => {
            $carousel.slick({
                infinite:      true,
                autoplay:      true,
                autoplaySpeed: 6000,
                speed:         2000,
                slidesToShow:  3,
                slidesToScroll:1,
                arrows:        true,
                dots:          false,
                responsive: [
                    { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
                    { breakpoint: 992,  settings: { slidesToShow: 2, slidesToScroll: 1 } },
                    { breakpoint: 767,  settings: { slidesToShow: 1, slidesToScroll: 1 } }
                ]
            });
        }, 100);

    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

// ─── FOOTER CONTACT ───────────────────────────────────────────────

function renderFooterContact(company) {
    // emails — always LTR so they never flip in Arabic
    const emailsEl = document.getElementById("footer-emails");
    if (emailsEl && company.emails?.length) {
        emailsEl.innerHTML = company.emails.map(e =>
            `<li class="icon-list-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-mail"></i></span>
                <span class="icon-list-text" style="direction:ltr;unicode-bidi:embed;">
                    <a href="mailto:${e.email}" style="color:inherit;">${e.email}</a>
                </span>
            </li>`
        ).join("");
    }

    // phones — always LTR
    const phonesEl = document.getElementById("footer-phones");
    if (phonesEl && company.phones?.length) {
        phonesEl.innerHTML = company.phones.map(p =>
            `<li class="icon-list-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-phone-call"></i></span>
                <span class="icon-list-text ltr-always" style="direction:ltr;unicode-bidi:embed;">${p.phone_number}</span>
            </li>`
        ).join("");
    }

    // address — translated
    const addressEl = document.getElementById("footer-address");
    if (addressEl && company.addresses?.length) {
        const primary = company.addresses.find(a => a.is_primary) || company.addresses[0];
        const parts = [
            field(primary, "address_line1"),
            field(primary, "city"),
            field(primary, "country")
        ].filter(Boolean);
        addressEl.innerHTML = `
            <li class="icon-list-item">
                <span class="icon-list-icon"><i class="ti ti-map-alt"></i></span>
                <span class="icon-list-text ltr-always">${parts.join(", ")}</span>
            </li>`;
    }

    // primary phone in contact section box
    const contPhoneEl = document.getElementById("contact-phone");
    if (contPhoneEl && company.phones?.length) {
        const primary = company.phones.find(p => p.is_primary) || company.phones[0];
        contPhoneEl.textContent = primary.phone_number;
    }
}

// ─── CONTACT FORM ────────────────────────────────────────────────

const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const get = n => contactForm.querySelector(`[name="${n}"]`)?.value.trim() || "";
        const name = get("name"), email = get("email"),
            phone = get("number"), subject = get("subject"),
            message = get("comment");
        const msgEl = contactForm.querySelector(".form-messege");
        const btn = contactForm.querySelector("button[type='submit']");

        if (!name || !email || !message) {
            msgEl.textContent = t("error_fields");
            msgEl.style.color = "red";
            return;
        }

        btn.disabled = true;
        btn.innerHTML = `${t("sending")} <span><i class="icofont-thin-double-right"></i></span>`;
        msgEl.textContent = "";

        try {
            const res = await fetch(`${API_BASE}/contact/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, subject, message })
            });
            if (res.ok) {
                msgEl.textContent = t("success_msg");
                msgEl.style.color = "green";
                contactForm.reset();
            } else {
                const d = await res.json().catch(() => ({}));
                msgEl.textContent = d.error || t("error_msg");
                msgEl.style.color = "red";
            }
        } catch {
            msgEl.textContent = t("error_msg");
            msgEl.style.color = "red";
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span data-t="send_message">${t("send_message")}</span> <span><i class="icofont-thin-double-right"></i></span>`;
        }
    });
}