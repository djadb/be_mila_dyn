// ─── Constants ────────────────────────────────────────────────────
const API_BASE = "http://127.0.0.1:8000/api";
const SITE_CONFIG = {
    logo:             "assets/images/logo1.png",
    logo_white:       "assets/images/logo2.png",
    breadcrumbs: {
        projects: "assets/images/project_2000x1121.png",
        contact:  "assets/images/slider3.jpg",
        about:    "assets/images/about_2000x1121.png",
    },
    google_maps_source : "https://www.google.com/maps/embed/v1/place?key=AIzaSyDoOLq_ts27g3vEog9sGYB0GJSyWBDK9gs&center=36.4519049%2C6.2584338&zoom=14&q=Cit%C3%A9%20S%C3%A9nnaoua%20W.MILA%2043000",
    projects_per_page: 60,
};

// ─── TRANSLATIONS ────────────────────────────────────────────────
const TRANSLATIONS = {
    en: {
        // nav
        home: "Home", about: "About", projects: "Projects", contact: "Contact", language: "Language",
        // hero
        hero_sub: "REALISE YOUR PROJECTS WITH OUR EXPERTISE",
        hero_title: "We build <span>great</span><br> structures.",
        hero_desc: "We are committed to delivering reliable, high-quality solutions, meeting the highest expectations while respecting standards of integrity and transparency.",
        see_more_service: "SEE MORE SERVICE",
        // capabilities
        our_capabilities: "Our Capabilities",
        cap1: "Architecture + Design", cap2: "Interior Design", cap3: "MEP Engineering",
        cap4: "Systems Engineering", cap5: "Laser Scanning", cap6: "Civil Engineering",
        cap_service_sub: "--- Our Provided Service",
        cap_service_title: "A global architecture, engineering, and consulting firm that believes in designing spaces where people and businesses thrive.",
        // feature
        since_sub: "--- SINCE 1994 ---",
        feature_title: "We plan and Implement the Dream?",
        feature_desc: "If you'd like to know more about our services or how we can help you with your project, please get in touch. We'd love to hear from you.",
        step1: "Submit Plan", step2: "Review Engineer", step3: "Complete Work",
        step_desc: "Our post-construction services gives you peace of mind knowing that we are here for you even after.",
        read_more: "Read More",
        contact_with_us: "Contact With us",
        // about
        about_sub: "--- About Company",
        about_title: "Our Small Company.",
        about_sub2: "Ready to Build your Home.",
        about_desc: "Building company that has been turning clients' visions into realities for over 35 years. Opportunities for professional growth are presented each day and we are dedicated to providing the safest and most productive working environment possible.",
        about_li1: "Experienced Construction Professional",
        about_li2: "Required to undertake any civil structure imaginable.",
        about_li3: "Productive working environment possible.",
        more_about: "More About us",
        // service 2
        service2_sub: "--- Provided Service ---",
        service2_title: "We plan and Implement the Dream?",
        service2_desc: "Rorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        // tab
        history_sub: "--- HISTORY COMPANY",
        history_title: "We're Building Better Company",
        history_desc: "Rorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        tab_history: "OUR HISTORY", tab_skills: "Our Skill", tab_members: "OUR MEMBER",
        // project
        proj_sub: "--- SINCE 1994 ---",
        proj_title: "We plan and Implement the Dream?",
        proj_desc: "If you'd like to know more about our services or how we can help you with your project, please get in touch. We'd love to hear from you.",
        loading: "Loading...", no_projects: "No featured projects.",
        // faq
        faq_sub: "--- Our FAQ",
        faq_title: "Manage everything",
        faq_sub2: "for brand and trademark!",
        faq_desc: "Building company that has been turning clients' visions into realities for over 35 years for professional growth are presented.",
        // video
        video_title: "Ready to Build",
        video_sub: "LET'S START SOMETHING",
        tell_project: "tell us ABOUT YOUR PROJECT",
        // testimonials
        test_sub: "--- TESTIMONIALS ---",
        test_title: "What Your Client Say?",
        test_desc: "If you'd like to know more about our services or how we can help you with your project, please get in touch. We'd love to hear from you.",
        // contact
        cont_sub: "--- Our Contact",
        cont_title: "Get In Touch With Us ?",
        cont_desc: "Bring to the table win-win survival strategies to ensure proactive domination a new normal that has evolved from generation.",
        emergency: "Emergency support center 24/7",
        company_address: "Company address",
        name_ph: "Name*", email_ph: "Email*", phone_ph: "Phone*", subject_ph: "Subject*", message_ph: "Message*",
        send_message: "Send Message",
        sending: "Sending...",
        success_msg: "Your message was sent successfully!",
        error_msg: "Something went wrong. Please try again.",
        error_fields: "Please fill in all required fields.",
        // blog
        blog_sub: "--- blog post---",
        blog_title: "News and insights!",
        blog_desc: "If you'd like to know more about our services or how we can help you with your project, please get in touch. We'd love to hear from you.",
        // footer
        join_team: "JOIN THE TEAM",
        footer_desc: "Our ability to self perform site work, concrete work and more —combined with the benefits of owning a significant amount of heavy equipment and large tools",
        our_service: "Our Service",
        view_positions: "View open positions",
        f_arch: "Architecture", f_civil: "Civil Engineering", f_fuel: "Fuel & Gas Stove",
        f_design: "Design", f_industrial: "Industrial Process", f_interiors: "Interiors", f_structural: "Structural Engineering",
        latest_news: "Latest News",
    },
    fr: {
        home: "Accueil", about: "À Propos", projects: "Projets", contact: "Contact", language: "Langue",
        hero_sub: "RÉALISEZ VOS PROJETS AVEC NOTRE EXPERTISE",
        hero_title: "Nous construisons de <span>grandes</span><br> structures.",
        hero_desc: "Nous nous engageons à fournir des solutions fiables et de haute qualité, en répondant aux attentes les plus élevées tout en respectant les normes d'intégrité et de transparence.",
        see_more_service: "VOIR NOS SERVICES",
        our_capabilities: "Nos Capacités",
        cap1: "Architecture + Design", cap2: "Design Intérieur", cap3: "Ingénierie MEP",
        cap4: "Ingénierie des Systèmes", cap5: "Scanning Laser", cap6: "Génie Civil",
        cap_service_sub: "--- Nos Services",
        cap_service_title: "Un cabinet mondial d'architecture, d'ingénierie et de conseil qui croit en la conception d'espaces où les personnes et les entreprises prospèrent.",
        since_sub: "--- DEPUIS 1994 ---",
        feature_title: "Nous planifions et réalisons le rêve",
        feature_desc: "Si vous souhaitez en savoir plus sur nos services ou comment nous pouvons vous aider, contactez-nous.",
        step1: "Soumettre le Plan", step2: "Révision Ingénieur", step3: "Travaux Terminés",
        step_desc: "Nos services après construction vous donnent la tranquillité d'esprit en sachant que nous sommes là pour vous.",
        read_more: "Lire Plus",
        contact_with_us: "Contactez-Nous",
        about_sub: "--- À Propos",
        about_title: "Notre Société.",
        about_sub2: "Prêts à Construire Votre Vision.",
        about_desc: "Une société de construction qui transforme les visions de ses clients en réalités depuis des années. Nous sommes dédiés à fournir l'environnement de travail le plus sûr et le plus productif possible.",
        about_li1: "Professionnels de la construction expérimentés",
        about_li2: "Capables d'entreprendre toute structure civile imaginable.",
        about_li3: "Environnement de travail productif possible.",
        more_about: "En Savoir Plus",
        service2_sub: "--- Services Proposés ---",
        service2_title: "Nous planifions et réalisons le rêve",
        service2_desc: "Nous nous engageons à fournir des solutions de haute qualité dans chaque secteur.",
        history_sub: "--- HISTOIRE DE L'ENTREPRISE",
        history_title: "Nous Construisons une Meilleure Société",
        history_desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        tab_history: "NOTRE HISTOIRE", tab_skills: "Nos Compétences", tab_members: "NOTRE ÉQUIPE",
        proj_sub: "--- DEPUIS 1994 ---",
        proj_title: "Nos Projets Récents",
        proj_desc: "Si vous souhaitez en savoir plus sur nos projets, n'hésitez pas à nous contacter.",
        loading: "Chargement...", no_projects: "Aucun projet en vedette.",
        faq_sub: "--- Notre FAQ",
        faq_title: "Gérez tout",
        faq_sub2: "pour votre marque !",
        faq_desc: "Une société de construction qui transforme les visions de ses clients en réalités depuis des années.",
        video_title: "Prêts à Construire",
        video_sub: "COMMENÇONS QUELQUE CHOSE",
        tell_project: "PARLEZ-NOUS DE VOTRE PROJET",
        test_sub: "--- TÉMOIGNAGES ---",
        test_title: "Ce que disent nos clients ?",
        test_desc: "Si vous souhaitez en savoir plus sur nos services, contactez-nous.",
        cont_sub: "--- Notre Contact",
        cont_title: "Contactez-Nous",
        cont_desc: "Nous mettons tout en œuvre pour assurer votre satisfaction et répondre à vos besoins.",
        emergency: "Support d'urgence 24h/24 7j/7",
        company_address: "Adresse de la société",
        name_ph: "Nom*", email_ph: "Email*", phone_ph: "Téléphone*", subject_ph: "Sujet*", message_ph: "Message*",
        send_message: "Envoyer le Message",
        sending: "Envoi en cours...",
        success_msg: "Votre message a été envoyé avec succès !",
        error_msg: "Une erreur s'est produite. Veuillez réessayer.",
        error_fields: "Veuillez remplir tous les champs obligatoires.",
        blog_sub: "--- articles ---",
        blog_title: "Actualités et perspectives !",
        blog_desc: "Si vous souhaitez en savoir plus sur nos services, contactez-nous.",
        join_team: "REJOINDRE L'ÉQUIPE",
        footer_desc: "Notre capacité à réaliser des travaux de terrassement, des travaux de béton et bien plus encore — combinée aux avantages de posséder des équipements lourds significatifs.",
        our_service: "Nos Services",
        view_positions: "Voir les postes ouverts",
        f_arch: "Architecture", f_civil: "Génie Civil", f_fuel: "Carburant & Gaz",
        f_design: "Design", f_industrial: "Processus Industriel", f_interiors: "Intérieurs", f_structural: "Génie Structurel",
        latest_news: "Dernières nouvelles",
    },
    ar: {
        home: "الرئيسية", about: "من نحن", projects: "المشاريع", contact: "اتصل بنا", language: "اللغة",
        hero_sub: "حقّق مشاريعك بخبرتنا",
        hero_title: "نبني <span>هياكل</span><br> عظيمة.",
        hero_desc: "نلتزم بتقديم حلول موثوقة وعالية الجودة، ونلبي أعلى التوقعات مع الحفاظ على معايير النزاهة والشفافية.",
        see_more_service: "اطلع على خدماتنا",
        our_capabilities: "قدراتنا",
        cap1: "العمارة + التصميم", cap2: "التصميم الداخلي", cap3: "هندسة MEP",
        cap4: "هندسة الأنظمة", cap5: "المسح بالليزر", cap6: "الهندسة المدنية",
        cap_service_sub: "--- خدماتنا",
        cap_service_title: "مكتب دراسات عالمي في الهندسة المعمارية والاستشارات يؤمن بتصميم مساحات يزدهر فيها الناس والأعمال.",
        since_sub: "--- منذ 1994 ---",
        feature_title: "نخطط وننفّذ الحلم",
        feature_desc: "إذا كنت تريد معرفة المزيد عن خدماتنا أو كيف يمكننا مساعدتك، تواصل معنا.",
        step1: "تقديم المخطط", step2: "مراجعة المهندس", step3: "إتمام الأعمال",
        step_desc: "خدماتنا ما بعد الإنشاء تمنحك راحة البال مع العلم أننا هنا من أجلك حتى بعد الانتهاء.",
        read_more: "اقرأ المزيد",
        contact_with_us: "تواصل معنا",
        about_sub: "--- عن الشركة",
        about_title: "شركتنا.",
        about_sub2: "مستعدون لبناء رؤيتك.",
        about_desc: "شركة إنشاءات تحوّل رؤى عملائها إلى حقيقة منذ سنوات. نحن ملتزمون بتوفير بيئة عمل آمنة ومنتجة قدر الإمكان.",
        about_li1: "محترفون ذوو خبرة في البناء",
        about_li2: "قادرون على تنفيذ أي هيكل مدني.",
        about_li3: "بيئة عمل منتجة ممكنة.",
        more_about: "المزيد عنا",
        service2_sub: "--- الخدمات المقدمة ---",
        service2_title: "نخطط وننفّذ الحلم",
        service2_desc: "نلتزم بتقديم حلول عالية الجودة في كل قطاع.",
        history_sub: "--- تاريخ الشركة",
        history_title: "نبني شركة أفضل",
        history_desc: "نحن نبذل قصارى جهدنا في كل مشروع نتولاه لتحقيق أعلى معايير الجودة.",
        tab_history: "تاريخنا", tab_skills: "مهاراتنا", tab_members: "فريقنا",
        proj_sub: "--- منذ 1994 ---",
        proj_title: "مشاريعنا الأخيرة",
        proj_desc: "إذا كنت تريد معرفة المزيد عن مشاريعنا، تواصل معنا.",
        loading: "جارٍ التحميل...", no_projects: "لا توجد مشاريع مميزة.",
        faq_sub: "--- الأسئلة الشائعة",
        faq_title: "إدارة كل شيء",
        faq_sub2: "لعلامتك التجارية!",
        faq_desc: "شركة إنشاءات تحوّل رؤى عملائها إلى حقيقة منذ سنوات.",
        video_title: "مستعدون للبناء",
        video_sub: "لنبدأ شيئاً",
        tell_project: "أخبرنا عن مشروعك",
        test_sub: "--- شهادات ---",
        test_title: "ماذا يقول عملاؤنا؟",
        test_desc: "إذا كنت تريد معرفة المزيد عن خدماتنا، تواصل معنا.",
        cont_sub: "--- اتصل بنا",
        cont_title: "تواصل معنا",
        cont_desc: "نضع كل ما في وسعنا لضمان رضاك والاستجابة لاحتياجاتك.",
        emergency: "دعم الطوارئ 24/7",
        company_address: "عنوان الشركة",
        name_ph: "الاسم*", email_ph: "البريد الإلكتروني*", phone_ph: "الهاتف*", subject_ph: "الموضوع*", message_ph: "الرسالة*",
        send_message: "إرسال الرسالة",
        sending: "جارٍ الإرسال...",
        success_msg: "تم إرسال رسالتك بنجاح!",
        error_msg: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        error_fields: "يرجى ملء جميع الحقول المطلوبة.",
        blog_sub: "--- مقالات ---",
        blog_title: "أخبار ورؤى!",
        blog_desc: "إذا كنت تريد معرفة المزيد عن خدماتنا، تواصل معنا.",
        join_team: "انضم إلى الفريق",
        footer_desc: "قدرتنا على تنفيذ أعمال الموقع وأعمال الخرسانة والمزيد — إلى جانب امتلاكنا معدات ثقيلة.",
        our_service: "خدماتنا",
        view_positions: "عرض الوظائف المتاحة",
        f_arch: "العمارة", f_civil: "الهندسة المدنية", f_fuel: "وقود وغاز",
        f_design: "التصميم", f_industrial: "العمليات الصناعية", f_interiors: "الديكور الداخلي", f_structural: "الهندسة الإنشائية",
        latest_news: "آخر الأخبار",
    }
};

// ─── HELPERS ─────────────────────────────────────────────────────

function getLang() {
    return localStorage.getItem("lang") || "en";
}

function t(key) {
    const lang = getLang();
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key])
        || (TRANSLATIONS["en"] && TRANSLATIONS["en"][key])
        || key;
}

// Gets correct language field from API object
// field(company, "description") → company.description_ar / _fr / _en
function field(obj, key) {
    if (!obj) return "";
    const lang = getLang();
    return obj[`${key}_${lang}`] || obj[`${key}_fr`] || obj[`${key}_en`] || "";
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload();
}
