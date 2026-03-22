// ─── API ─────────────────────────────────────────────────────────
const API_BASE = "http://127.0.0.1:8000/api";

// ─── TRANSLATIONS ────────────────────────────────────────────────
const TRANSLATIONS = {
    fr: {
        home: "Accueil", presentation: "Présentation", projects: "Nos Projets",
        contact: "Contact", language: "Langue",
        hero_title: "Réalisez vos projets avec notre expertise",
        hero_desc: "Nous nous engageons à fournir des solutions fiables et de haute qualité, en répondant aux attentes les plus élevées tout en respectant les normes d'intégrité et de transparence.",
        contact_us: "Contactez Nous",
        we_ensure: "Nous assurons",
        we_ensure_desc: "Nous mettons un point d'honneur à respecter les plus hauts standards de qualité et d'intégrité dans chaque projet que nous entreprenons.",
        about_us: "À Propos de Nous", our_expertise: "Notre Expertise et Valeurs", discover_us: "Découvrez Nous",
        our_projects: "NOS PROJETS", recent_projects: "Nos Propriétés Récentes",
        recent_projects_desc: "Nous sommes dédiés à fournir des services exemplaires, en veillant à la satisfaction de nos clients et à l'intégrité de chaque projet.",
        see_more: "Voir plus", view_more: "VOIR PLUS",
        no_projects: "Aucun projet récent pour le moment.", loading: "Chargement...",
        trust_title: "Ceux qui nous font confiance",
        email_label: "EMAIL :", location_label: "ADRESSE :", phone_label: "TÉLÉPHONE :",
        pages: "pages", social: "Social media", rights: "Tous droits réservés.",
        name_ph: "Nom *", email_ph: "Email *", phone_ph: "Téléphone *",
        subject_ph: "Sujet *", message_ph: "Message *",
        send: "Envoyer", sending: "Envoi en cours...",
        success_msg: "Votre message a été envoyé avec succès !",
        error_msg: "Une erreur s'est produite. Veuillez réessayer.",
        error_fields: "Veuillez remplir tous les champs obligatoires.",
    },
    en: {
        home: "Home", presentation: "Presentation", projects: "Our Projects",
        contact: "Contact", language: "Language",
        hero_title: "Realise your projects with our expertise",
        hero_desc: "We are committed to delivering reliable, high-quality solutions, meeting the highest expectations while respecting standards of integrity and transparency.",
        contact_us: "Contact Us",
        we_ensure: "We ensure",
        we_ensure_desc: "We make it a point of honour to respect the highest standards of quality and integrity in every project we undertake.",
        about_us: "About Us", our_expertise: "Our Expertise and Values", discover_us: "Discover Us",
        our_projects: "OUR PROJECTS", recent_projects: "Our Recent Properties",
        recent_projects_desc: "We are dedicated to providing exemplary services, ensuring client satisfaction and the integrity of every project.",
        see_more: "See more", view_more: "VIEW MORE",
        no_projects: "No recent projects at the moment.", loading: "Loading...",
        trust_title: "Those who trust us",
        email_label: "EMAIL:", location_label: "LOCATION:", phone_label: "PHONE NUMBER:",
        pages: "Pages", social: "Social media", rights: "All rights reserved.",
        name_ph: "Name *", email_ph: "Email *", phone_ph: "Phone *",
        subject_ph: "Subject *", message_ph: "Message *",
        send: "Send", sending: "Sending...",
        success_msg: "Your message has been sent successfully!",
        error_msg: "Something went wrong. Please try again.",
        error_fields: "Please fill in all required fields.",
    },
    ar: {
        home: "الرئيسية", presentation: "تقديم", projects: "مشاريعنا",
        contact: "اتصل بنا", language: "اللغة",
        hero_title: "حقّق مشاريعك بخبرتنا",
        hero_desc: "نلتزم بتقديم حلول موثوقة وعالية الجودة، ونلبي أعلى التوقعات مع الحفاظ على معايير النزاهة والشفافية.",
        contact_us: "تواصل معنا",
        we_ensure: "نحن نضمن",
        we_ensure_desc: "نحرص على الالتزام بأعلى معايير الجودة والنزاهة في كل مشروع نتولاه.",
        about_us: "من نحن", our_expertise: "خبرتنا وقيمنا", discover_us: "اكتشفنا",
        our_projects: "مشاريعنا", recent_projects: "مشاريعنا الأخيرة",
        recent_projects_desc: "نحن ملتزمون بتقديم خدمات مثالية مع ضمان رضا عملائنا ونزاهة كل مشروع.",
        see_more: "عرض المزيد", view_more: "عرض المزيد",
        no_projects: "لا توجد مشاريع حديثة حالياً.", loading: "جارٍ التحميل...",
        trust_title: "من يثق بنا",
        email_label: "البريد الإلكتروني:", location_label: "العنوان:", phone_label: "رقم الهاتف:",
        pages: "الصفحات", social: "وسائل التواصل", rights: "جميع الحقوق محفوظة.",
        name_ph: "الاسم *", email_ph: "البريد الإلكتروني *", phone_ph: "الهاتف *",
        subject_ph: "الموضوع *", message_ph: "الرسالة *",
        send: "إرسال", sending: "جارٍ الإرسال...",
        success_msg: "تم إرسال رسالتك بنجاح!",
        error_msg: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        error_fields: "يرجى ملء جميع الحقول المطلوبة.",
    }
};

// ─── HELPERS ─────────────────────────────────────────────────────

function getLang() {
    return localStorage.getItem("lang") || "fr";
}

function t(key) {
    const lang = getLang();
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key])
        || (TRANSLATIONS["fr"] && TRANSLATIONS["fr"][key])
        || key;
}

// Gets the correct language field from an API object
// e.g. field(company, "description") → company.description_fr
function field(obj, key) {
    if (!obj) return "";
    const lang = getLang();
    return obj[`${key}_${lang}`] || obj[`${key}_fr`] || obj[`${key}_en`] || "";
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload();
}