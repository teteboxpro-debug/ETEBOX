import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  welcomeTitle: string;
  welcomeMessage: string;
  freeVideos: string;
  vipStore: string;
  storage: string;
  newLinks: string;
  freeVideosDesc: string;
  vipStoreDesc: string;
  storageDesc: string;
  newLinksDesc: string;
  backToHome: string;
  newLinksTitle: string;
  newLinksSubtitle: string;
  openLink: string;
  deleteLink: string;
  confirmDelete: string;
  cancel: string;
  addNewLink: string;
  titlePlaceholder: string;
  urlPlaceholder: string;
  datePlaceholder: string;
  save: string;
  close: string;
  adminMode: string;
  adminSettings: string;
  editUrls: string;
  noLinksYet: string;
  linkOpened: string;
  linkDeleted: string;
  linkAdded: string;
  telegramBotSupport: string;
  poweredBy: string;
  totalLinks: string;
  searchPlaceholder: string;
  openTelegramBot: string;
  resetDefaults: string;
  officialBadge: string;
  // New auth strings
  userLogin: string;
  telegramUsername: string;
  enterTelegramUsername: string;
  loginSuccess: string;
  logout: string;
  connectedAs: string;
  autoDetectedTg: string;
  loginToContinue: string;
  adminLoginTitle: string;
  adminLoginDesc: string;
  adminUsername: string;
  adminPassword: string;
  adminLoginBtn: string;
  adminLogoutBtn: string;
  adminLoggedInBadge: string;
  adminRequiredToModify: string;
  invalidCredentials: string;
  onlyAdminCanDelete: string;
  onlyAdminCanAdd: string;
  userConnected: string;
  registrationRequiredPromptTitle: string;
  registrationRequiredPromptDesc: string;
  activateButtonsBtn: string;
  telegramSupportTeam: string;
  telegramSupportAccountLabel: string;
  telegramSupportAccountDesc: string;
  // Dashboard & User Management
  adminDashboard: string;
  adminDashboardDesc: string;
  statTotalUsers: string;
  statUsersToday: string;
  statNewUsersToday: string;
  statTotalTelegramAccounts: string;
  dailyActivityTitle: string;
  dailyActivityDesc: string;
  registeredUsersTitle: string;
  registeredUsersDesc: string;
  searchUsersPlaceholder: string;
  deleteUserBtn: string;
  confirmDeleteUser: string;
  userDeletedSuccess: string;
  noUsersFound: string;
  userTableHeaderUser: string;
  userTableHeaderRegistered: string;
  userTableHeaderLastActive: string;
  userTableHeaderLogins: string;
  userTableHeaderActions: string;
  userStatusActive: string;
  openDashboardBtn: string;
  dailyVisits: string;
  activeUsersLabel: string;
  newUsersLabel: string;
  // Social Media & Contact
  socialMediaTitle: string;
  socialMediaDesc: string;
  tiktok: string;
  tiktokDesc: string;
  instagram: string;
  instagramDesc: string;
  whatsapp: string;
  whatsappDesc: string;
  socialMediaConfigTitle: string;
  socialMediaConfigDesc: string;
  saveSocialLinksBtn: string;
  socialLinksSavedSuccess: string;
  mainLinksConfigTitle: string;
  mainLinksConfigDesc: string;
  saveMainLinksBtn: string;
  mainLinksSavedSuccess: string;
  testLinkBtn: string;
  manageVideoLinksTitle: string;
  manageVideoLinksDesc: string;
  editLink: string;
  saveChanges: string;
  linkAddedSuccess: string;
  linkUpdatedSuccess: string;
  linkDeletedSuccess: string;
  markAsNew: string;
  editModalTitle: string;
  allLinksCount: string;
  // TPY & Bot Script Download
  tpyScriptTitle: string;
  tpyScriptDesc: string;
  downloadTpyBtn: string;
  downloadPyBtn: string;
  copyTpyBtn: string;
  tpyCopiedSuccess: string;
  tpyDownloadedSuccess: string;
  viewScriptBtn: string;
  closeScriptBtn: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: '𝔼𝕋𝔼𝔹𝕆𝕏𝕍𝕀ℙ 𝔽𝕆ℝ 𝕍𝕀𝔻𝔼𝕆𝕊',
    appSubtitle: 'المنصة الرسمية لمكتبة الفيديوهات والخدمات السحابية',
    welcomeTitle: 'أهلاً وسهلاً بك في منصتنا الرسمية',
    welcomeMessage: 'وجهتك الموثوقة للوصول المباشر إلى مكتبة الفيديوهات الحصرية، التخزين السحابي وقائمة الروابط المتجددة.',
    freeVideos: '🎬 FREE CHANNEL / VIDEOS (القناة المجانية)',
    vipStore: '💎 VIP STORE VIDEOS',
    storage: '☁️ STORAGE',
    newLinks: '🔗 NEW LINKS',
    freeVideosDesc: 'استعراض المحتوى والمقاطع المجانية مباشرة',
    vipStoreDesc: 'متجر ومكتبة VIP الحصرية فائقة الجودة',
    storageDesc: 'سحابة التخزين المباشرة للملفات والمواد',
    newLinksDesc: 'أحدث الروابط والمصادر المضافة من الإدارة',
    backToHome: 'العودة للرئيسية',
    newLinksTitle: 'الروابط الجديدة (NEW LINKS)',
    newLinksSubtitle: 'تصفح أحدث الروابط المضافة مرتبة حسب التاريخ مع إمكانية الفتح والإدارة',
    openLink: 'فتح الرابط',
    deleteLink: 'حذف',
    confirmDelete: 'هل أنت متأكد من رغبتك في حذف هذا الرابط نهائياً؟',
    cancel: 'إلغاء',
    addNewLink: 'إضافة رابط جديد',
    titlePlaceholder: 'عنوان أو اسم الرابط...',
    urlPlaceholder: 'https://example.com/video...',
    datePlaceholder: 'التاريخ (مثال: 2026-09-17)',
    save: 'حفظ الرابط',
    close: 'إغلاق',
    adminMode: 'لوحة المشرف',
    adminSettings: 'إعدادات الروابط الرئيسية',
    editUrls: 'تعديل مسارات الأزرار الرئيسية',
    noLinksYet: 'لا توجد روابط جديدة حالياً. استخدم زر الإضافة أعلاه لإدراج رابط.',
    linkOpened: 'جاري فتح الرابط...',
    linkDeleted: 'تم حذف الرابط بنجاح',
    linkAdded: 'تم إضافة الرابط الجديد بنجاح',
    telegramBotSupport: 'يدعم بوت تيليجرام الرسمي',
    poweredBy: 'Mini App Studio متوافق مع',
    totalLinks: 'إجمالي الروابط',
    searchPlaceholder: 'بحث في الروابط...',
    openTelegramBot: 'فتح بوت التيليجرام',
    resetDefaults: 'استعادة الروابط الافتراضية',
    officialBadge: 'النسخة الرسمية V2.5',
    // New auth strings
    userLogin: 'تسجيل دخول تيليجرام',
    telegramUsername: 'اسم مستخدم تيليجرام',
    enterTelegramUsername: 'أدخل اسم المستخدم الخاص بك (مثال: @username)',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    logout: 'تسجيل خروج',
    connectedAs: 'متصل بحساب',
    autoDetectedTg: 'تم التعرف على حسابك في تيليجرام',
    loginToContinue: 'سجل اسمك في تيليجرام لتجربة استخدام مخصصة',
    adminLoginTitle: 'تسجيل دخول المشرف (Admin)',
    adminLoginDesc: 'يتطلب تعديل وحذف وإضافة الروابط اسم مستخدم وكلمة مرور المشرف.',
    adminUsername: 'اسم مستخدم المشرف',
    adminPassword: 'كلمة المرور',
    adminLoginBtn: 'تسجيل دخول المشرف',
    adminLogoutBtn: 'خروج المشرف',
    adminLoggedInBadge: 'وضع المشرف نشط',
    adminRequiredToModify: 'يتطلب تعديل أو حذف الروابط تسجيل دخول المشرف',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.',
    onlyAdminCanDelete: 'الحذف متاح للمشرف فقط (قم بتسجيل دخول المشرف)',
    onlyAdminCanAdd: 'الإضافة متاحة للمشرف فقط',
    userConnected: 'مستخدم متصل',
    registrationRequiredPromptTitle: 'التسجيل مطلوب عبر تيليجرام',
    registrationRequiredPromptDesc: 'لفتح القناة المجانية أو تصفح الروابط الجديدة، يرجى إدخال اسم مستخدم تيليجرام أولاً لتفعيل الأزرار والوصول للمحتوى.',
    activateButtonsBtn: 'تأكيد وتفعيل الأزرار',
    telegramSupportTeam: '[Telegram Support Team]',
    telegramSupportAccountLabel: 'حساب فريق دعم تيليجرام',
    telegramSupportAccountDesc: 'أدخل اسم المستخدم (@username) أو الرابط لحساب الدعم الفني',
    // Dashboard & User Management
    adminDashboard: 'لوحة تحكم المشرف',
    adminDashboardDesc: 'إدارة المستخدمين المسجلين، إحصائيات الدخول والنشاط اليومي',
    statTotalUsers: 'إجمالي المستخدمين',
    statUsersToday: 'مستخدمو اليوم',
    statNewUsersToday: 'المستخدمون الجدد اليوم',
    statTotalTelegramAccounts: 'إجمالي حسابات تيليجرام المسجلة',
    dailyActivityTitle: 'إحصائيات النشاط اليومي',
    dailyActivityDesc: 'سجل الزيارات والحسابات النشطة خلال الأيام الأخيرة',
    registeredUsersTitle: 'حسابات تيليجرام المسجلة',
    registeredUsersDesc: 'قائمة المستخدمين المسجلين في التطبيق مع إمكانية المراجعة والحذف',
    searchUsersPlaceholder: 'البحث باسم المستخدم (@username)...',
    deleteUserBtn: 'حذف الحساب',
    confirmDeleteUser: 'هل أنت متأكد من حذف هذا الحساب المسجل نهائياً من قاعدة بيانات التطبيق؟',
    userDeletedSuccess: 'تم حذف حساب تيليجرام بنجاح من قاعدة البيانات',
    noUsersFound: 'لم يتم العثور على أي حسابات مسجلة',
    userTableHeaderUser: 'المستخدم',
    userTableHeaderRegistered: 'تاريخ التسجيل',
    userTableHeaderLastActive: 'آخر نشاط',
    userTableHeaderLogins: 'الزيارات / الدخول',
    userTableHeaderActions: 'الإجراءات',
    userStatusActive: 'نشط',
    openDashboardBtn: 'لوحة تحكم المشرف',
    dailyVisits: 'زيارة',
    activeUsersLabel: 'مستخدمين نشطين',
    newUsersLabel: 'جدد',
    // Social Media & Contact
    socialMediaTitle: 'تواصل معنا ومواقع التواصل',
    socialMediaDesc: 'تابع حساباتنا الرسمية وتواصل معنا مباشرة عبر المنصات المعتمدة',
    tiktok: 'TikTok (تيك توك)',
    tiktokDesc: 'أحدث المقاطع والتحديثات السريعة',
    instagram: 'Instagram (إنستغرام)',
    instagramDesc: 'القصص والمنشورات الحصرية',
    whatsapp: 'WhatsApp (واتساب)',
    whatsappDesc: 'المحادثة الفورية وخدمة العملاء',
    socialMediaConfigTitle: 'روابط التواصل الاجتماعي الرسمية',
    socialMediaConfigDesc: 'تحديث روابط الحسابات الرسمية (تيك توك، إنستغرام، واتساب) المعروضة للزوار',
    saveSocialLinksBtn: 'حفظ روابط التواصل',
    socialLinksSavedSuccess: 'تم تحديث روابط التواصل الاجتماعي بنجاح',
    mainLinksConfigTitle: 'إدارة الروابط والخدمات الرئيسية (VIP & Storage & Free)',
    mainLinksConfigDesc: 'تعديل مسارات الأزرار الرئيسية في واجهة التطبيق مع حفظ فوري ودائم في قاعدة البيانات',
    saveMainLinksBtn: 'حفظ وتثبيت الروابط الرئيسية',
    mainLinksSavedSuccess: 'تم حفظ الروابط الرئيسية بنجاح وتحديث الأزرار في التطبيق!',
    testLinkBtn: 'تجربة الرابط',
    manageVideoLinksTitle: 'إدارة وتعديل قائمة الروابط والفيديوهات (NEW LINKS)',
    manageVideoLinksDesc: 'إضافة روابط جديدة، تعديل الروابط وعناوينها، وتحديثها فوراً من لوحة تحكم المشرف',
    editLink: 'تعديل الرابط',
    saveChanges: 'حفظ التعديلات',
    linkAddedSuccess: 'تمت إضافة الرابط الجديد بنجاح!',
    linkUpdatedSuccess: 'تم تعديل وتحديث الرابط بنجاح!',
    linkDeletedSuccess: 'تم حذف الرابط بنجاح!',
    markAsNew: 'تمييز كجديد (شعار NEW)',
    editModalTitle: 'تعديل بيانات الرابط',
    allLinksCount: 'إجمالي الروابط المتاحة',
    // TPY & Bot Script Download
    tpyScriptTitle: 'ملف سكربت بوت تيليجرام (TPY Script)',
    tpyScriptDesc: 'تحميل كود ربط البوت المخصص لمنصة Telebot Creator وبايثون مع زر Web App المباشر',
    downloadTpyBtn: 'تحميل ملف telebot_bot.tpy',
    downloadPyBtn: 'تحميل ملف bot.py',
    copyTpyBtn: 'نسخ الكود البرمجي',
    tpyCopiedSuccess: 'تم نسخ كود TPY إلى الحافظة بنجاح!',
    tpyDownloadedSuccess: 'تم بدء تحميل الملف بنجاح!',
    viewScriptBtn: 'معاينة الكود',
    closeScriptBtn: 'إغلاق المعاينة',
  },
  en: {
    appName: '𝔼𝕋𝔼𝔹𝕆𝕏𝕍𝕀ℙ 𝔽𝕆ℝ 𝕍𝕀𝔻𝔼𝕆𝕊',
    appSubtitle: 'Official Platform for Video Library & Cloud Storage',
    welcomeTitle: 'Welcome to Our Official Platform',
    welcomeMessage: 'Your trusted gateway for instant access to premium video collections, cloud storage, and the newest curated links.',
    freeVideos: '🎬 FREE CHANNEL / VIDEOS',
    vipStore: '💎 VIP STORE VIDEOS',
    storage: '☁️ STORAGE',
    newLinks: '🔗 NEW LINKS',
    freeVideosDesc: 'Browse and watch free public video content',
    vipStoreDesc: 'Exclusive premium VIP video store & library',
    storageDesc: 'High-speed cloud storage for media & files',
    newLinksDesc: 'Latest links and resources published by admin',
    backToHome: 'Back to Home',
    newLinksTitle: 'New Links (NEW LINKS)',
    newLinksSubtitle: 'Browse recent links arranged by date with instant access and management',
    openLink: 'Open Link',
    deleteLink: 'Delete',
    confirmDelete: 'Are you sure you want to permanently delete this link?',
    cancel: 'Cancel',
    addNewLink: 'Add New Link',
    titlePlaceholder: 'Link title or name...',
    urlPlaceholder: 'https://example.com/video...',
    datePlaceholder: 'Date (e.g. 2026-09-17)',
    save: 'Save Link',
    close: 'Close',
    adminMode: 'Admin Panel',
    adminSettings: 'Main Button URLs',
    editUrls: 'Configure destinations for primary buttons',
    noLinksYet: 'No links available yet. Use the button above to add a new link.',
    linkOpened: 'Opening link...',
    linkDeleted: 'Link deleted successfully',
    linkAdded: 'New link added successfully',
    telegramBotSupport: 'Official Telegram Bot Supported',
    poweredBy: 'Compatible with Mini App Studio',
    totalLinks: 'Total Links',
    searchPlaceholder: 'Search links...',
    openTelegramBot: 'Open Telegram Bot',
    resetDefaults: 'Restore Defaults',
    officialBadge: 'Official Release V2.5',
    // New auth strings
    userLogin: 'Telegram Login',
    telegramUsername: 'Telegram Username',
    enterTelegramUsername: 'Enter your Telegram username (e.g. @username)',
    loginSuccess: 'Logged in successfully',
    logout: 'Log out',
    connectedAs: 'Connected as',
    autoDetectedTg: 'Telegram account auto-detected',
    loginToContinue: 'Login with your Telegram username for a personalized experience',
    adminLoginTitle: 'Admin Authentication',
    adminLoginDesc: 'Modifying, deleting, and adding links requires administrator credentials.',
    adminUsername: 'Admin Username',
    adminPassword: 'Password',
    adminLoginBtn: 'Login as Admin',
    adminLogoutBtn: 'Admin Logout',
    adminLoggedInBadge: 'Admin Active',
    adminRequiredToModify: 'Admin login required to modify or delete links',
    invalidCredentials: 'Invalid username or password! Please try again.',
    onlyAdminCanDelete: 'Only Admin can delete (Please login as admin)',
    onlyAdminCanAdd: 'Only Admin can add new links',
    userConnected: 'Connected User',
    registrationRequiredPromptTitle: 'Telegram Registration Required',
    registrationRequiredPromptDesc: 'To open Free Channel or browse New Links, please register your Telegram username first to activate the buttons.',
    activateButtonsBtn: 'Confirm & Activate Buttons',
    telegramSupportTeam: '[Telegram Support Team]',
    telegramSupportAccountLabel: 'Telegram Support Team Account',
    telegramSupportAccountDesc: 'Enter the username (@username) or link for the support team',
    // Dashboard & User Management
    adminDashboard: 'Admin Dashboard',
    adminDashboardDesc: 'Registered user management, login analytics and daily statistics',
    statTotalUsers: 'Total Users',
    statUsersToday: 'Users Today',
    statNewUsersToday: 'New Users Today',
    statTotalTelegramAccounts: 'Total Registered Telegram Accounts',
    dailyActivityTitle: 'Daily User Activity Statistics',
    dailyActivityDesc: 'Log of daily visits, active members and new registrations over recent days',
    registeredUsersTitle: 'Registered Telegram Accounts',
    registeredUsersDesc: 'Directory of registered Telegram members with activity records and deletion controls',
    searchUsersPlaceholder: 'Search by Telegram @username or name...',
    deleteUserBtn: 'Delete Account',
    confirmDeleteUser: 'Are you sure you want to permanently delete this registered user from the application database?',
    userDeletedSuccess: 'Telegram account successfully deleted from database',
    noUsersFound: 'No registered users found matching your search',
    userTableHeaderUser: 'User',
    userTableHeaderRegistered: 'Registration Date',
    userTableHeaderLastActive: 'Last Active',
    userTableHeaderLogins: 'Visits / Logins',
    userTableHeaderActions: 'Actions',
    userStatusActive: 'Active',
    openDashboardBtn: 'Admin Dashboard',
    dailyVisits: 'visits',
    activeUsersLabel: 'active users',
    newUsersLabel: 'new',
    // Social Media & Contact
    socialMediaTitle: 'Social Media & Contact',
    socialMediaDesc: 'Follow our official channels and connect with our team directly',
    tiktok: 'TikTok',
    tiktokDesc: 'Trending reels & clips',
    instagram: 'Instagram',
    instagramDesc: 'Exclusive stories & releases',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Instant chat & member support',
    socialMediaConfigTitle: 'Social Media & Contact Links',
    socialMediaConfigDesc: 'Update official links (TikTok, Instagram, WhatsApp) displayed to app users',
    saveSocialLinksBtn: 'Save Social Links',
    socialLinksSavedSuccess: 'Social media links successfully updated',
    mainLinksConfigTitle: 'Main Services Links Management (VIP, Storage & Free)',
    mainLinksConfigDesc: 'Update main button URLs across the application with instant permanent persistence',
    saveMainLinksBtn: 'Save & Persist Main Links',
    mainLinksSavedSuccess: 'Main links successfully saved and updated across the app!',
    testLinkBtn: 'Test Link',
    manageVideoLinksTitle: 'Manage & Edit Video Links (NEW LINKS)',
    manageVideoLinksDesc: 'Add new links, edit existing links and titles, and update them directly from the admin panel',
    editLink: 'Edit Link',
    saveChanges: 'Save Changes',
    linkAddedSuccess: 'New link added successfully!',
    linkUpdatedSuccess: 'Link updated successfully!',
    linkDeletedSuccess: 'Link deleted successfully!',
    markAsNew: 'Mark as NEW (Badge)',
    editModalTitle: 'Edit Link Details',
    allLinksCount: 'Total Available Links',
    // TPY & Bot Script Download
    tpyScriptTitle: 'Telegram Bot Script File (TPY Script)',
    tpyScriptDesc: 'Download the bot integration code for Telebot Creator & Python with full Web App support',
    downloadTpyBtn: 'Download telebot_bot.tpy',
    downloadPyBtn: 'Download bot.py',
    copyTpyBtn: 'Copy Script Code',
    tpyCopiedSuccess: 'TPY script copied to clipboard successfully!',
    tpyDownloadedSuccess: 'File download started successfully!',
    viewScriptBtn: 'View Script',
    closeScriptBtn: 'Close Preview',
  },
  ru: {
    appName: '𝔼𝕋𝔼𝔹𝕆𝕏𝕍𝕀ℙ 𝔽𝕆ℝ 𝕍𝕀𝔻𝔼𝕆𝕊',
    appSubtitle: 'Официальная платформа видеотеки и облачного хранилища',
    welcomeTitle: 'Добро пожаловать на официальную платформу',
    welcomeMessage: 'Ваш надежный портал для прямого доступа к эксклюзивным видео, облачному хранилищу и свежим добавленным ссылкам.',
    freeVideos: '🎬 FREE CHANNEL / VIDEOS (БЕСПЛАТНЫЙ КАНАЛ)',
    vipStore: '💎 VIP STORE VIDEOS',
    storage: '☁️ STORAGE',
    newLinks: '🔗 NEW LINKS',
    freeVideosDesc: 'Просмотр бесплатного видеоконтента онлайн',
    vipStoreDesc: 'Эксклюзивный VIP магазин и премиум видеотека',
    storageDesc: 'Быстрое облачное хранилище файлов и видео',
    newLinksDesc: 'Свежие ссылки и материалы от администратора',
    backToHome: 'На главную',
    newLinksTitle: 'Новые ссылки (NEW LINKS)',
    newLinksSubtitle: 'Просмотр последних ссылок по дате с быстрым переходом и удалением',
    openLink: 'Открыть ссылку',
    deleteLink: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить эту ссылку навсегда?',
    cancel: 'Отмена',
    addNewLink: 'Добавить ссылку',
    titlePlaceholder: 'Название или описание ссылки...',
    urlPlaceholder: 'https://example.com/video...',
    datePlaceholder: 'Дата (напр. 2026-09-17)',
    save: 'Сохранить ссылку',
    close: 'Закрыть',
    adminMode: 'Панель админа',
    adminSettings: 'Настройки главных ссылок',
    editUrls: 'Изменить адреса основных кнопок',
    noLinksYet: 'Пока нет добавленных ссылок. Нажмите кнопку выше для добавления.',
    linkOpened: 'Переход по ссылке...',
    linkDeleted: 'Ссылка успешно удалена',
    linkAdded: 'Новая ссылка успешно добавлена',
    telegramBotSupport: 'Поддержка официального Telegram бота',
    poweredBy: 'Совместимо с Mini App Studio',
    totalLinks: 'Всего ссылок',
    searchPlaceholder: 'Поиск по ссылкам...',
    openTelegramBot: 'Открыть Telegram бот',
    resetDefaults: 'Сбросить по умолчанию',
    officialBadge: 'Официальная версия V2.5',
    // New auth strings
    userLogin: 'Вход Telegram',
    telegramUsername: 'Имя пользователя Telegram',
    enterTelegramUsername: 'Введите ваш Telegram @username',
    loginSuccess: 'Успешный вход',
    logout: 'Выйти',
    connectedAs: 'Подключен как',
    autoDetectedTg: 'Аккаунт Telegram автоматически определен',
    loginToContinue: 'Войдите под своим именем Telegram',
    adminLoginTitle: 'Вход администратора',
    adminLoginDesc: 'Для добавления, изменения и удаления ссылок требуются учетные данные администратора.',
    adminUsername: 'Имя администратора',
    adminPassword: 'Пароль',
    adminLoginBtn: 'Войти как админ',
    adminLogoutBtn: 'Выход админа',
    adminLoggedInBadge: 'Админ активен',
    adminRequiredToModify: 'Требуется вход администратора для изменения или удаления ссылок',
    invalidCredentials: 'Неверное имя пользователя или пароль! Попробуйте снова.',
    onlyAdminCanDelete: 'Удаление доступно только администратору',
    onlyAdminCanAdd: 'Добавление доступно только администратору',
    userConnected: 'Пользователь',
    registrationRequiredPromptTitle: 'Требуется регистрация в Telegram',
    registrationRequiredPromptDesc: 'Для перехода в бесплатный канал или новые ссылки, пожалуйста, укажите ваше имя пользователя Telegram для активации кнопок.',
    activateButtonsBtn: 'Подтвердить и активировать',
    telegramSupportTeam: '[Telegram Support Team]',
    telegramSupportAccountLabel: 'Аккаунт команды поддержки Telegram',
    telegramSupportAccountDesc: 'Укажите юзернейм (@username) или ссылку на поддержку',
    // Dashboard & User Management
    adminDashboard: 'Панель управления администратора',
    adminDashboardDesc: 'Управление зарегистрированными пользователями, аналитика входов и ежедневная активность',
    statTotalUsers: 'Всего пользователей',
    statUsersToday: 'Пользователи сегодня',
    statNewUsersToday: 'Новые пользователи сегодня',
    statTotalTelegramAccounts: 'Всего зарегистрированных Telegram аккаунтов',
    dailyActivityTitle: 'Ежедневная статистика активности',
    dailyActivityDesc: 'История посещений, активных участников и новых регистраций за последние дни',
    registeredUsersTitle: 'Зарегистрированные аккаунты Telegram',
    registeredUsersDesc: 'Список зарегистрированных Telegram пользователей с записями активности и удалением',
    searchUsersPlaceholder: 'Поиск по Telegram @username или имени...',
    deleteUserBtn: 'Удалить аккаунт',
    confirmDeleteUser: 'Вы уверены, что хотите навсегда удалить этот аккаунт из базы данных приложения?',
    userDeletedSuccess: 'Аккаунт Telegram успешно удален из базы данных',
    noUsersFound: 'Зарегистрированные пользователи не найдены',
    userTableHeaderUser: 'Пользователь',
    userTableHeaderRegistered: 'Дата регистрации',
    userTableHeaderLastActive: 'Последняя активность',
    userTableHeaderLogins: 'Входов / Активность',
    userTableHeaderActions: 'Действия',
    userStatusActive: 'Активен',
    openDashboardBtn: 'Панель админа',
    dailyVisits: 'визитов',
    activeUsersLabel: 'активных',
    newUsersLabel: 'новых',
    // Social Media & Contact
    socialMediaTitle: 'Контакты и социальные сети',
    socialMediaDesc: 'Подписывайтесь на официальные каналы и связывайтесь с нами напрямую',
    tiktok: 'TikTok',
    tiktokDesc: 'Популярные ролики и клипы',
    instagram: 'Instagram',
    instagramDesc: 'Эксклюзивные истории и релизы',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Мгновенный чат и поддержка',
    socialMediaConfigTitle: 'Ссылки на социальные сети',
    socialMediaConfigDesc: 'Обновление официальных ссылок (TikTok, Instagram, WhatsApp) для пользователей',
    saveSocialLinksBtn: 'Сохранить ссылки',
    socialLinksSavedSuccess: 'Ссылки на соцсети успешно обновлены',
    mainLinksConfigTitle: 'Управление основными ссылками сервисов (VIP, Storage, Free)',
    mainLinksConfigDesc: 'Обновление адресов основных кнопок приложения с мгновенным сохранением',
    saveMainLinksBtn: 'Сохранить основные ссылки',
    mainLinksSavedSuccess: 'Основные ссылки успешно сохранены и обновлены!',
    testLinkBtn: 'Проверить',
    manageVideoLinksTitle: 'Управление и редактирование ссылок (NEW LINKS)',
    manageVideoLinksDesc: 'Добавление новых ссылок, редактирование существующих и обновление прямо из панели управления',
    editLink: 'Редактировать',
    saveChanges: 'Сохранить изменения',
    linkAddedSuccess: 'Новая ссылка успешно добавлена!',
    linkUpdatedSuccess: 'Ссылка успешно обновлена!',
    linkDeletedSuccess: 'Ссылка успешно удалена!',
    markAsNew: 'Отметить как НОВОЕ (NEW)',
    editModalTitle: 'Редактирование ссылки',
    allLinksCount: 'Всего доступных ссылок',
    // TPY & Bot Script Download
    tpyScriptTitle: 'Скрипт Telegram-бота (формат TPY)',
    tpyScriptDesc: 'Скачать скрипт интеграции для Telebot Creator и Python с поддержкой Web App',
    downloadTpyBtn: 'Скачать telebot_bot.tpy',
    downloadPyBtn: 'Скачать bot.py',
    copyTpyBtn: 'Скопировать код',
    tpyCopiedSuccess: 'Код TPY успешно скопирован в буфер обмена!',
    tpyDownloadedSuccess: 'Загрузка файла успешно началась!',
    viewScriptBtn: 'Просмотр кода',
    closeScriptBtn: 'Закрыть просмотр',
  },
};
