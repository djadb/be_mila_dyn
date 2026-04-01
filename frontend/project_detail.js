// ─── PROJECT DETAIL PAGE ─────────────────────────────────────────
// Relies on config.js being loaded first (API_BASE, TRANSLATIONS, t, field, getLang, setLang)

// ─── EXTRA TRANSLATIONS ──────────────────────────────────────────
Object.keys(TRANSLATIONS).forEach(lang => {
    const extra = {
        en: {
            project_detail:    "Project Details",
            back_to_projects:  "Back to Projects",
            project_status:    "Status",
            start_date:        "Start Date",
            estimated_date:    "Estimated End",
            end_date:          "End Date",
            project_images:    "Project Images",
            no_images:         "No images available.",
            not_specified:     "Not specified",
            project_not_found: "Project not found.",
        },
        fr: {
            project_detail:    "Détails du Projet",
            back_to_projects:  "Retour aux Projets",
            project_status:    "Statut",
            start_date:        "Date de Début",
            estimated_date:    "Fin Estimée",
            end_date:          "Date de Fin",
            project_images:    "Images du Projet",
            no_images:         "Aucune image disponible.",
            not_specified:     "Non spécifié",
            project_not_found: "Projet introuvable.",
        },
        ar: {
            project_detail:    "تفاصيل المشروع",
            back_to_projects:  "العودة إلى المشاريع",
            project_status:    "الحالة",
            start_date:        "تاريخ البداية",
            estimated_date:    "نهاية متوقعة",
            end_date:          "تاريخ الانتهاء",
            project_images:    "صور المشروع",
            no_images:         "لا توجد صور متاحة.",
            not_specified:     "غير محدد",
            project_not_found: "المشروع غير موجود.",
        }
    };
    Object.assign(TRANSLATIONS[lang], extra[lang] || extra["en"]);
});

// ─── STATE ────────────────────────────────────────────────────────
let currentProject    = null;
let currentImageIndex = 0;

// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    applyLang();
    applyTranslations();
    applyBreadcrumb("projects");

    const id = getProjectIdFromUrl();
    if (!id) {
        showError(t("project_not_found"));
        return;
    }

    await loadProject(id);
    loadPartners();
});

// ─── HELPERS ─────────────────────────────────────────────────────

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

function applyBreadcrumb(pageKey) {
    const el  = document.querySelector(".breadcumb-area");
    if (!el) return;
    const img = SITE_CONFIG.breadcrumbs?.[pageKey] || SITE_CONFIG.breadcrumbs?.projects;
    if (img) {
        el.style.backgroundImage    = `url(${img})`;
        el.style.backgroundSize     = "cover";
        el.style.backgroundPosition = "center";
    }
}

function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function formatDate(dateStr) {
    if (!dateStr) return t("not_specified");
    return new Date(dateStr).toLocaleDateString(
        getLang() === "ar" ? "ar-DZ" :
        getLang() === "fr" ? "fr-FR" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }
    );
}

function showError(msg) {
    const el = document.getElementById("project-detail-content");
    if (el) el.innerHTML = `<div class="proj-empty col-12" style="padding:80px 20px;">${msg}</div>`;
}

// ─── LOAD PROJECT ─────────────────────────────────────────────────

async function loadProject(id) {
    const content = document.getElementById("project-detail-content");
    content.innerHTML = `<div class="proj-loading" style="padding:80px 20px;">${t("loading")}</div>`;

    try {
        const res = await fetch(`${API_BASE}/projects/${id}/`);
        if (!res.ok) { showError(t("project_not_found")); return; }

        currentProject    = await res.json();
        currentImageIndex = 0;

        renderProjectDetail(currentProject);

    } catch (err) {
        console.error(err);
        showError(t("project_not_found"));
    }
}

// ─── RENDER PROJECT ───────────────────────────────────────────────

function renderProjectDetail(project) {
    const content = document.getElementById("project-detail-content");

    const title       = field(project, "title");
    const description = field(project, "description");
    const status      = project.status ? field(project.status, "status") : null;
    const statusEn    = project.status?.status_en?.toLowerCase() || "";
    const images      = (project.images || []).filter(i => i.is_active !== false)
                                              .sort((a, b) => a.position - b.position);

    // update breadcrumb title
    const breadTitle = document.querySelector(".brcrumb_title");
    if (breadTitle) breadTitle.textContent = title;

    // update page title
    document.title = `BE-MILA – ${title}`;

    // status color
    const statusColor = {
        "finished":   "#27ae60",
        "in progress":"#F45B1E",
        "paused":     "#e67e22",
        "delayed":    "#e74c3c",
        "pending":    "#95a5a6",
        "cancelled":  "#7f8c8d",
    }[statusEn] || "#F45B1E";

    content.innerHTML = `
    <div class="container">
        <div class="row">

            <!-- ── LEFT: image gallery ── -->
            <div class="col-lg-7 col-md-12">
                <div class="proj-detail-gallery">

                    <!-- main image -->
                    <div class="proj-main-wrap" style="position:relative;">
                        <img id="detail-main-img"
                             src="${images.length ? images[0].image_url : 'assets/images/pot01.jpg'}"
                             alt="${title}"
                             style="width:100%;height:460px;object-fit:cover;
                                    border-radius:4px;transition:opacity .2s;">

                        <!-- prev / next arrows -->
                        ${images.length > 1 ? `
                        <button class="detail-img-nav detail-prev" onclick="changeMainImage(-1)">&#8249;</button>
                        <button class="detail-img-nav detail-next" onclick="changeMainImage(1)">&#8250;</button>
                        <div class="detail-img-counter" id="detail-counter">
                            1 / ${images.length}
                        </div>` : ""}
                    </div>

                    <!-- thumbnail strip -->
                    ${images.length > 1 ? `
                    <div class="proj-thumbnails" id="proj-thumbnails">
                        ${images.map((img, i) => `
                            <div class="proj-thumb ${i === 0 ? 'active' : ''}"
                                 data-idx="${i}"
                                 onclick="goToImage(${i})"
                                 style="background-image:url('${img.image_url}');">
                            </div>`
                        ).join("")}
                    </div>` : ""}

                </div>
            </div>

            <!-- ── RIGHT: project info ── -->
            <div class="col-lg-5 col-md-12">
                <div class="proj-detail-info">

                    <!-- title -->
                    <h1 class="proj-detail-title">${title}</h1>

                    <!-- status badge -->
                    ${status ? `
                    <div class="proj-detail-status" style="background:${statusColor};">
                        ${status}
                    </div>` : ""}

                    <!-- meta: dates -->
                    <div class="proj-detail-meta">
                        ${project.start_date ? `
                        <div class="proj-meta-row">
                            <span class="proj-meta-label">${t("start_date")}</span>
                            <span class="proj-meta-value">${formatDate(project.start_date)}</span>
                        </div>` : ""}

                        ${project.estimated_date ? `
                        <div class="proj-meta-row">
                            <span class="proj-meta-label">${t("estimated_date")}</span>
                            <span class="proj-meta-value">${formatDate(project.estimated_date)}</span>
                        </div>` : ""}

                        ${project.end_date ? `
                        <div class="proj-meta-row">
                            <span class="proj-meta-label">${t("end_date")}</span>
                            <span class="proj-meta-value">${formatDate(project.end_date)}</span>
                        </div>` : ""}
                    </div>

                    <!-- description -->
                    ${description ? `
                    <div class="proj-detail-desc tinymce-content">
                        ${description}
                    </div>` : ""}

                    <!-- back button -->
                    <div class="witr_button_area" style="margin-top:30px;">
                        <div class="witr_btn_style mr">
                            <div class="witr_btn_sinner">
                                <a href="project.html" class="witr_btn">
                                    <span data-t="back_to_projects">${t("back_to_projects")}</span>
                                    <div class="pluse_btn_icon">
                                        <span class="ti-angle-double-left"></span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>`;

    // store images globally for switcher
    window._detailImages = images;
}

// ─── IMAGE SWITCHER ───────────────────────────────────────────────

function changeMainImage(direction) {
    const images = window._detailImages || [];
    if (!images.length) return;
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    goToImage(currentImageIndex);
}

function goToImage(idx) {
    const images = window._detailImages || [];
    if (!images[idx]) return;

    currentImageIndex = idx;

    const mainImg = document.getElementById("detail-main-img");
    const counter = document.getElementById("detail-counter");
    const thumbs  = document.querySelectorAll(".proj-thumb");

    if (mainImg) {
        mainImg.style.opacity = "0";
        setTimeout(() => {
            mainImg.src           = images[idx].image_url;
            mainImg.style.opacity = "1";
        }, 200);
    }

    if (counter) counter.textContent = `${idx + 1} / ${images.length}`;

    thumbs.forEach((t, i) => t.classList.toggle("active", i === idx));

    // scroll active thumbnail into view
    if (thumbs[idx]) {
        thumbs[idx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
}

// ─── PARTNERS ─────────────────────────────────────────────────────

async function loadPartners() {
    try {
        const res = await fetch(`${API_BASE}/company/main/`);
        if (!res.ok) return;
        const company = await res.json();
        renderPartners(company.partners || []);
        renderFooterContact(company);
    } catch(e) {
        console.warn("Partners not loaded", e);
    }
}

function renderPartners(partners) {
    const container = document.getElementById("partners-container");
    if (!container || !partners.length) return;
    const $c = $(container);
    if ($c.hasClass("slick-initialized")) $c.slick("unslick");
    container.innerHTML = partners.map(p => {
        const name = field(p, "name") || p.name_en || "";
        return `<div class="slide_items"><a class="txbdbfoverlay" href="#">
            ${p.logo
                ? `<img src="${p.logo}" alt="${name}" style="max-height:60px;object-fit:contain;display:block;margin:auto;">`
                : `<span style="display:block;padding:10px 20px;font-weight:700;">${name}</span>`}
        </a></div>`;
    }).join("");
    setTimeout(() => {
        $c.slick({
            infinite:true, autoplay:true, autoplaySpeed:3000, speed:1000,
            slidesToShow:5, slidesToScroll:1, arrows:true, dots:false,
            responsive:[
                {breakpoint:1200, settings:{slidesToShow:5}},
                {breakpoint:992,  settings:{slidesToShow:4}},
                {breakpoint:767,  settings:{slidesToShow:2}}
            ]
        });
    }, 100);
}

function renderFooterContact(company) {
    const emailsEl  = document.getElementById("footer-emails");
    const phonesEl  = document.getElementById("footer-phones");
    const addressEl = document.getElementById("footer-address");

    if (emailsEl && company.emails?.length) {
        emailsEl.innerHTML = company.emails.map(e =>
            `<li class="icon-list-item inline-item ltr-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-mail"></i></span>
                <span class="icon-list-text ltr-always">
                    <a href="mailto:${e.email}" style="color:inherit;">${e.email}</a>
                </span>
            </li>`
        ).join("");
    }
    if (phonesEl && company.phones?.length) {
        phonesEl.innerHTML = company.phones.map(p =>
            `<li class="icon-list-item inline-item ltr-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-phone-call"></i></span>
                <span class="icon-list-text ltr-always">${p.phone_number}</span>
            </li>`
        ).join("");
    }
    if (addressEl && company.addresses?.length) {
        const a     = company.addresses.find(x => x.is_primary) || company.addresses[0];
        const parts = [field(a,"address_line1"), field(a,"city"), field(a,"country")].filter(Boolean);
        addressEl.innerHTML = `
            <li class="icon-list-item inline-item">
                <span class="icon-list-icon"><i class="ti ti-map-alt"></i></span>
                <span class="icon-list-text">${parts.join(", ")}</span>
            </li>`;
    }
}