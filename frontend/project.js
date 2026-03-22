// ─── ADD PROJECT PAGE TRANSLATIONS ───────────────────────────────
Object.keys(TRANSLATIONS).forEach(lang => {
    const extra = {
        en: {
            filter_all:         "All Projects",
            prev_page:          "Previous",
            next_page:          "Next",
            page_of:            "Page",
            of:                 "of",
            no_projects_filter: "No projects found for this status.",
        },
        fr: {
            filter_all:         "Tous les Projets",
            prev_page:          "Précédent",
            next_page:          "Suivant",
            page_of:            "Page",
            of:                 "sur",
            no_projects_filter: "Aucun projet trouvé pour ce statut.",
        },
        ar: {
            filter_all:         "جميع المشاريع",
            prev_page:          "السابق",
            next_page:          "التالي",
            page_of:            "صفحة",
            of:                 "من",
            no_projects_filter: "لا توجد مشاريع لهذه الحالة.",
        }
    };
    Object.assign(TRANSLATIONS[lang], extra[lang] || extra["en"]);
});

// ─── STATE ────────────────────────────────────────────────────────
const PAGE_SIZE   = 60;
let allProjects   = [];
let statuses      = [];
let currentFilter = "*";
let currentPage   = 1;

// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    applyLang();
    applyTranslations();
    await loadProjectsAndStatuses();
    loadPartners();
});

// ─── LANGUAGE ─────────────────────────────────────────────────────

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

// ─── FETCH PROJECTS + STATUSES ───────────────────────────────────

async function loadProjectsAndStatuses() {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = `<div class="proj-loading">${t("loading")}</div>`;

    try {
        const res  = await fetch(`${API_BASE}/projects/?page_size=1000`);
        const data = await res.json();
        allProjects = (data.results || data || []).filter(p => p.is_active !== false);

        // collect unique statuses from fetched projects
        const seen = {};
        allProjects.forEach(p => {
            if (p.status && !seen[p.status.id]) {
                seen[p.status.id] = true;
                statuses.push(p.status);
            }
        });

        buildFilterMenu();
        renderPage();

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div class="proj-empty col-12">Error loading projects.</div>`;
    }
}

// ─── FILTER MENU ─────────────────────────────────────────────────

function buildFilterMenu() {
    const menu = document.getElementById("filter");
    menu.innerHTML = `<li class="current_menu_item" data-filter="*">${t("filter_all")}</li>`;

    statuses.forEach(s => {
        const li          = document.createElement("li");
        li.dataset.filter = `.status-${s.id}`;
        li.textContent    = field(s, "status");
        menu.appendChild(li);
    });

    // single delegated click handler
    menu.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", function() {
            menu.querySelectorAll("li").forEach(el => el.classList.remove("current_menu_item"));
            this.classList.add("current_menu_item");

            const filterVal = this.dataset.filter;
            currentFilter   = filterVal;
            currentPage     = 1;

            const grid = document.getElementById("projects-grid");

            if ($(grid).data("isotope")) {
                // isotope animated filter — no DOM re-render needed
                $(grid).isotope({ filter: filterVal });
                // update pagination for filtered count
                updatePagination(filterVal);
            } else {
                renderPage();
            }
        });
    });
}

// ─── RENDER PAGE ─────────────────────────────────────────────────

function renderPage() {
    const grid = document.getElementById("projects-grid");

    const totalPages = Math.ceil(allProjects.length / PAGE_SIZE);
    currentPage      = Math.min(Math.max(currentPage, 1), totalPages || 1);
    const start      = (currentPage - 1) * PAGE_SIZE;
    const pageItems  = allProjects.slice(start, start + PAGE_SIZE);

    if (pageItems.length === 0) {
        grid.innerHTML = `<div class="proj-empty col-12">${t("no_projects_filter")}</div>`;
        document.getElementById("proj-pagination").style.display = "none";
        return;
    }

    // destroy isotope before touching DOM
    if ($(grid).data("isotope")) {
        $(grid).isotope("destroy");
    }

    grid.innerHTML = pageItems.map(p => buildProjectCard(p)).join("");

    // attach image switchers
    grid.querySelectorAll(".proj-card").forEach(card => attachImageSwitcher(card));

    // init isotope after images load
    $(grid).imagesLoaded(function() {
        $(grid).isotope({
            itemSelector:       ".grid-item",
            layoutMode:         "masonry",
            transitionDuration: "0.6s",
            filter:             currentFilter
        });
    });

    // update pagination
    updatePagination(currentFilter);

    // scroll grid into view
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── UPDATE PAGINATION ────────────────────────────────────────────

function updatePagination(filterVal) {
    // count visible items after isotope filter
    const grid      = document.getElementById("projects-grid");
    const allItems  = grid.querySelectorAll(".grid-item");
    let visibleCount = allItems.length;

    if (filterVal && filterVal !== "*") {
        visibleCount = grid.querySelectorAll(`.grid-item${filterVal}`).length;
    }

    const totalPages  = Math.ceil(allProjects.length / PAGE_SIZE);
    const pagination  = document.getElementById("proj-pagination");
    pagination.style.display = totalPages > 1 ? "flex" : "none";

    document.getElementById("btn-prev").disabled = currentPage === 1;
    document.getElementById("btn-next").disabled = currentPage === totalPages;
    document.getElementById("page-info").textContent =
        `${t("page_of")} ${currentPage} ${t("of")} ${totalPages}`;
}

// ─── BUILD PROJECT CARD ───────────────────────────────────────────

function buildProjectCard(project) {
    const images    = (project.images || []).filter(i => i.is_active !== false);
    const imgCount  = images.length;
    const firstImg  = imgCount > 0 ? images[0].image_url : "assets/images/pot01.jpg";
    const title     = field(project, "title");
    const status    = project.status ? field(project.status, "status") : null;
    const statusEn  = project.status?.status_en?.toLowerCase() || "";
    const statusCls = project.status ? `status-${project.status.id}` : "";

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(
            getLang() === "ar" ? "ar-DZ" :
            getLang() === "fr" ? "fr-FR" : "en-GB",
            { year: "numeric", month: "long" }
        );
    };

    let dateLabel = "";
    if      (statusEn === "finished")                          dateLabel = formatDate(project.end_date);
    else if (statusEn === "in progress")                       dateLabel = formatDate(project.estimated_date) || formatDate(project.start_date);
    else if (statusEn === "paused" || statusEn === "delayed")  dateLabel = formatDate(project.start_date);
    else if (statusEn === "pending")                           dateLabel = formatDate(project.start_date);

    const statusHtml = status ? `
        <p class="proj-status-badge">
            ${status}
            ${dateLabel ? `<span class="proj-status-date">${dateLabel}</span>` : ""}
        </p>` : "";

    const imgUrls  = imgCount > 0 ? images.map(i => i.image_url) : ["assets/images/pot01.jpg"];
    const imgData  = JSON.stringify(imgUrls).replace(/"/g, "&quot;");

    const dotsHtml = imgCount > 1
        ? `<div class="img-dots">
            ${imgUrls.map((_, i) =>
                `<span class="img-dot${i === 0 ? " active" : ""}" data-idx="${i}"></span>`
            ).join("")}
           </div>`
        : "";

    return `
    <div class="col-lg-4 grid-item eportfolio_item col-md-6 col-xs-12 col-sm-12 allprt30 ${statusCls}">
        <div class="single_protfolio">
            <div class="prot_thumb proj-card"
                 data-img-count="${imgCount}"
                 data-imgs="${imgData}"
                 data-current="0">
                <button class="img-nav prev-img" aria-label="prev">&#8249;</button>
                <img class="proj-main-img" src="${firstImg}" alt="${title}"
                     style="width:100%;height:260px;object-fit:cover;display:block;transition:opacity .15s;">
                <button class="img-nav next-img" aria-label="next">&#8250;</button>
                ${dotsHtml}
                <div class="prot_content posibg">
                    <div class="prot_content_inner">
                        <h2><a class="txcwhite txcwhiteh"
                               href="project-detail.html?id=${project.id}">${title}</a></h2>
                        ${statusHtml}
                    </div>
                </div>
                <div class="em_plus_port"><div class="picon"></div></div>
            </div>
        </div>
    </div>`;
}

// ─── IMAGE SWITCHER ───────────────────────────────────────────────

function attachImageSwitcher(card) {
    const imgEl   = card.querySelector(".proj-main-img");
    const prevBtn = card.querySelector(".prev-img");
    const nextBtn = card.querySelector(".next-img");
    const dots    = card.querySelectorAll(".img-dot");
    const imgs    = JSON.parse(card.dataset.imgs.replace(/&quot;/g, '"'));
    let current   = 0;

    function goTo(idx) {
        current         = (idx + imgs.length) % imgs.length;
        imgEl.style.opacity = "0";
        setTimeout(() => {
            imgEl.src           = imgs[current];
            imgEl.style.opacity = "1";
        }, 150);
        card.dataset.current = current;
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    if (prevBtn) prevBtn.addEventListener("click", e => { e.preventDefault(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", e => { e.preventDefault(); goTo(current + 1); });
    dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
}

// ─── PAGINATION BUTTONS ───────────────────────────────────────────

document.getElementById("btn-prev").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        currentFilter = "*";
        // reset filter menu
        document.querySelectorAll(".filter_menu li").forEach(li => li.classList.remove("current_menu_item"));
        document.querySelector(".filter_menu li[data-filter='*']")?.classList.add("current_menu_item");
        renderPage();
    }
});

document.getElementById("btn-next").addEventListener("click", () => {
    const totalPages = Math.ceil(allProjects.length / PAGE_SIZE);
    if (currentPage < totalPages) {
        currentPage++;
        currentFilter = "*";
        document.querySelectorAll(".filter_menu li").forEach(li => li.classList.remove("current_menu_item"));
        document.querySelector(".filter_menu li[data-filter='*']")?.classList.add("current_menu_item");
        renderPage();
    }
});

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
        return `
        <div class="slide_items">
            <a class="txbdbfoverlay" href="#">
                ${p.logo
                    ? `<img src="${p.logo}" alt="${name}"
                            style="max-height:60px;object-fit:contain;display:block;margin:auto;">`
                    : `<span style="display:block;padding:10px 20px;font-weight:700;">${name}</span>`
                }
            </a>
        </div>`;
    }).join("");

    setTimeout(() => {
        $c.slick({
            infinite: true, autoplay: true, autoplaySpeed: 3000,
            speed: 1000, slidesToShow: 5, slidesToScroll: 1,
            arrows: true, dots: false,
            responsive: [
                { breakpoint: 1200, settings: { slidesToShow: 5 } },
                { breakpoint: 992,  settings: { slidesToShow: 4 } },
                { breakpoint: 767,  settings: { slidesToShow: 2 } }
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
            `<li class="icon-list-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-mail"></i></span>
                <span class="icon-list-text ltr-always">
                    <a href="mailto:${e.email}" style="color:inherit;">${e.email}</a>
                </span>
            </li>`
        ).join("");
    }

    if (phonesEl && company.phones?.length) {
        phonesEl.innerHTML = company.phones.map(p =>
            `<li class="icon-list-item">
                <span class="icon-list-icon"><i class="flaticon flaticon-phone-call"></i></span>
                <span class="icon-list-text ltr-always">${p.phone_number}</span>
            </li>`
        ).join("");
    }

    if (addressEl && company.addresses?.length) {
        const a     = company.addresses.find(x => x.is_primary) || company.addresses[0];
        const parts = [field(a,"address_line1"), field(a,"city"), field(a,"country")].filter(Boolean);
        addressEl.innerHTML = `
            <li class="icon-list-item">
                <span class="icon-list-icon"><i class="ti ti-map-alt"></i></span>
                <span class="icon-list-text">${parts.join(", ")}</span>
            </li>`;
    }
}