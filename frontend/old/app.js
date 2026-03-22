document.addEventListener("DOMContentLoaded", () => {
    applyLang();
    applyTranslations();

    setTimeout(async () => {
        applyTranslations();
        forceTranslateCarousel();
        await loadCompany();
        await loadFeaturedProjects();
    }, 600);
});

function applyLang() {
    const lang  = getLang();
    const isRTL = lang === "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir  = isRTL ? "rtl" : "ltr";
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

function forceTranslateCarousel() {
    document.querySelectorAll(".owl-item [data-t]").forEach(el => {
        el.innerHTML = t(el.dataset.t);
    });
    document.querySelectorAll(".owl-item [data-tp]").forEach(el => {
        el.placeholder = t(el.dataset.tp);
    });
}

// ─── COMPANY ─────────────────────────────────────────────────────

async function loadCompany() {
    try {
        const res = await fetch(`${API_BASE}/company/main/`);
        if (!res.ok) { console.warn("No main company configured."); return; }
        const company = await res.json();

        // ── Logo
        if (company.logo?.image_url) {
            document.querySelectorAll(".company-logo").forEach(el => {
                el.src = company.logo.image_url;
                el.alt = field(company, "name");
            });
        }

        // ── About description
        const descEl = document.getElementById("company-description");
        if (descEl) {
            const text = field(company, "description");
            descEl.innerHTML = text || "";
            descEl.classList.remove("loading-placeholder");
        }

        // ── Qualities section — dynamic cards
        renderQualities(company.qualities || []);

        // ── Contact: emails
        const emailsEl = document.getElementById("company-emails");
        if (emailsEl && company.emails?.length) {
            emailsEl.innerHTML = company.emails
                .map(e => `<a href="mailto:${e.email}">${e.email}</a>`)
                .join("<br>");
        }

        // ── Contact: phones
        const phonesEl = document.getElementById("company-phones");
        if (phonesEl && company.phones?.length) {
            phonesEl.innerHTML = company.phones
                .map(p => `<span>${p.phone_number}</span>`)
                .join("<br>");
        }

        // ── Contact: address
        const addressEl = document.getElementById("company-address");
        if (addressEl && company.addresses?.length) {
            const primary = company.addresses.find(a => a.is_primary) || company.addresses[0];
            addressEl.textContent = [
                field(primary, "address_line1"),
                field(primary, "city"),
                field(primary, "country")
            ].filter(Boolean).join(", ");
        }

        // ── Partners
        renderPartners(company.partners || []);

    } catch (err) {
        console.error("Failed to load company:", err);
    }
}

// ─── QUALITIES ───────────────────────────────────────────────────

function renderQualities(qualities) {
    const container = document.getElementById("qualities-container");
    if (!container) return;

    if (!qualities.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = qualities.map(q => `
        <div class="col-lg-4 col-md-6">
            <div class="quality-card">
                ${q.icon?.image_url
                    ? `<div class="quality-icon"><img src="${q.icon.image_url}" alt="${field(q, 'name')}" style="height:50px; object-fit:contain;"></div>`
                    : `<div class="quality-icon"><i class="flaticon flaticon-shield"></i></div>`
                }
                <h3>${field(q, "name")}</h3>
            </div>
        </div>
    `).join("");
}

// ─── FEATURED PROJECTS ───────────────────────────────────────────

async function loadFeaturedProjects() {
    const container = document.getElementById("featured-projects-container");
    if (!container) return;

    container.innerHTML = `<p class="loading-placeholder" style="text-align:center; padding:30px;">${t("loading")}</p>`;

    try {
        const res  = await fetch(`${API_BASE}/projects/?featured=true`);
        const data = await res.json();
        const projects = data.results || data || [];

        if (!Array.isArray(projects) || projects.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding:30px; color:#aaa;">${t("no_projects")}</p>`;
            return;
        }

        container.innerHTML = projects.map(project => {
            const img    = project.images?.[0]?.image_url || "assets/images/pot01.jpg";
            const title  = field(project, "title");
            const status = project.status ? field(project.status, "status") : "";

            return `
                <div class="witr_single_pslide">
                    <div class="witr_pslide_image">
                        <img src="${img}" alt="${title}" style="width:100%; height:280px; object-fit:cover;">
                    </div>
                    <div class="witr_content_pslide_text">
                        <div class="witr_content_pslide">
                            <h2><a href="project.html?id=${project.id}">${title}</a></h2>
                            ${status ? `<p>${status}</p>` : ""}
                        </div>
                    </div>
                    <div class="witr_pslide_custom">
                        <a href="project.html?id=${project.id}" tabindex="-1">
                            <span class="txbdbrac ti-arrow-right"></span>
                        </a>
                    </div>
                </div>`;
        }).join("");

        // reinit owl carousel after injecting content
        if (window.jQuery && $.fn.owlCarousel) {
            const $carousel = $(container).closest(".witr_carousel_main");
            $carousel.trigger("destroy.owl.carousel").removeClass("owl-loaded owl-drag");
            $carousel.owlCarousel({
                loop: projects.length > 2,
                margin: 20, nav: true, dots: true,
                autoplay: true, autoplayTimeout: 4000,
                responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3 } }
            });
        }

    } catch (err) {
        console.error("Failed to load projects:", err);
        container.innerHTML = `<p style="text-align:center; color:red;">${t("error_msg")}</p>`;
    }
}

// ─── PARTNERS ────────────────────────────────────────────────────

function renderPartners(partners) {
    const container = document.getElementById("partners-container");
    if (!container) return;

    if (!partners.length) {
        container.closest(".cg_brand_area")?.style.setProperty("display", "none");
        return;
    }

    container.innerHTML = partners.map(p => `
        <div class="slide_items">
            <a class="txbdbfoverlay" href="#">
                ${p.logo?.image_url
                    ? `<img src="${p.logo.image_url}" alt="${field(p, 'name')}" style="max-height:70px; object-fit:contain;">`
                    : `<span style="display:block; padding:15px; font-weight:600;">${field(p, "name")}</span>`
                }
            </a>
        </div>
    `).join("");

    // reinit carousel
    if (window.jQuery && $.fn.owlCarousel) {
        const $carousel = $(container).closest(".witr_carousel_main");
        $carousel.trigger("destroy.owl.carousel").removeClass("owl-loaded owl-drag");
        $carousel.owlCarousel({
            loop: true, margin: 30, nav: false, dots: false,
            autoplay: true, autoplayTimeout: 3000,
            responsive: { 0: { items: 2 }, 600: { items: 4 }, 1000: { items: 6 } }
        });
    }
}

// ─── CONTACT FORM ────────────────────────────────────────────────

const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const get    = name => contactForm.querySelector(`[name="${name}"]`)?.value.trim() || "";
        const name   = get("name");
        const email  = get("email");
        const phone  = get("number");
        const subject= get("subject");
        const message= get("comment");
        const msgEl  = contactForm.querySelector(".form-messege");
        const btn    = contactForm.querySelector("button[type='submit']");

        if (!name || !email || !message) {
            msgEl.textContent = t("error_fields");
            msgEl.style.color = "red";
            return;
        }

        btn.disabled = true;
        btn.textContent = t("sending");
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
                const data = await res.json().catch(() => ({}));
                msgEl.textContent = data.error || t("error_msg");
                msgEl.style.color = "red";
            }
        } catch {
            msgEl.textContent = t("error_msg");
            msgEl.style.color = "red";
        } finally {
            btn.disabled = false;
            btn.textContent = t("send");
        }
    });
}