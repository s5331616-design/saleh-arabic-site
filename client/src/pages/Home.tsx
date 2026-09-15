import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpLeft,
  BatteryCharging,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Cpu,
  Database,
  Droplets,
  HeartHandshake,
  Menu,
  MessageCircle,
  Phone,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TabletSmartphone,
  Wrench,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const services = [
  {
    icon: Smartphone,
    number: "01",
    title: "إصلاح الشاشات",
    text: "شاشة مكسورة أو لمس لا يستجيب؟ نعيد لجهازك وضوحه واستجابته بقطع موثوقة وضمان واضح.",
    accent: "blue",
  },
  {
    icon: BatteryCharging,
    number: "02",
    title: "تبديل البطاريات",
    text: "بطارية تنفد بسرعة أو جهاز ينطفئ فجأة؟ نركّب بطارية مناسبة ونختبر الأداء قبل التسليم.",
    accent: "mint",
  },
  {
    icon: Cpu,
    number: "03",
    title: "إصلاح البرمجيات",
    text: "نعالج البطء والتعليق ومشاكل النظام والتطبيقات مع تحديث آمن يحافظ على ملفاتك.",
    accent: "lavender",
  },
  {
    icon: Database,
    number: "04",
    title: "استعادة البيانات",
    text: "نستعيد صورك وملفاتك وجهات اتصالك قبل الإصلاح ونؤمّن نسخة احتياطية حتى لا تخسر شيئًا.",
    accent: "peach",
  },
];

const faqItems = [
  ["كم يستغرق إصلاح شاشة الجوال؟", "معظم إصلاحات الشاشات تُنجز في نفس اليوم. نفحص الجهاز أولًا، نعطيك سعرًا واضحًا، وإذا وافقت نبدأ العمل فورًا. بعض الحالات النادرة قد تحتاج يوم عمل إضافي حسب توفر القطع."],
  ["هل يغطي الضمان الإصلاح الذي قمت به؟", "نعم، كل إصلاح ننفذه يأتي بضمان مكتوب يوضح نوع التغطية ومدتها. وإذا عاد نفس العطل خلال فترة الضمان نعيد معالجته دون تكلفة إضافية."],
  ["ماذا يشمل الضمان على برمجة الأجهزة؟", "يشمل العمل البرمجي الذي نفذناه والتأكد من استقرار النظام بعد الإصلاح. نوضح لك الشروط كاملة قبل بدء أي خطوة."],
  ["كم سعر الإصلاح وهل يشمل القطع؟", "نعطيك تشخيصًا أوليًا مجانيًا وتكلفة شاملة قبل الإصلاح. لا توجد مفاجآت في السعر ولا نبدأ دون موافقتك."],
  ["هل تقومون بإصلاح جميع أنواع الجوالات؟", "نخدم أغلب أجهزة iPhone وSamsung وGoogle Pixel والأجهزة اللوحية. أرسل لنا موديل جهازك لنؤكد لك إمكانية الإصلاح."],
];

const testimonials = [
  { quote: "أكثر شيء عجبني أنه لا يستعجل عليك. يشرح المشكلة بالتفصيل ويكون صريحًا إذا كان هناك أمل أو لا. هذا الصدق يجعلني أعود له مرة ثانية.", name: "علي محمد", place: "بيحان الحرجة" },
  { quote: "ظننت أن هاتفي انتهى ويحتاج إلى واحد جديد. صالح أصلح البرمجة وأنهاها خلال ساعة. شخص نزيه ويرد على الأسئلة بسرعة.", name: "ديفيد غارسيا", place: "ساكن في وسط المدينة" },
  { quote: "سعر واضح قبل أن نبدأ، وفحص حقيقي للجهاز. ارتحت من الغموض الذي واجهته في محلات أخرى.", name: "سارة حسن", place: "ساكنة في باسيفيك بالمز" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const bookingMutation = trpc.booking.submit.useMutation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "التشخيص الأولي مجاني", text: "أرسل طلبك الآن وسنرد عليك خلال دقائق.", time: "الآن", unread: true, icon: ScanSearch },
    { id: 2, title: "ضمان على كل إصلاح", text: "نوضح لك مدة الضمان قبل بدء العمل.", time: "منذ ساعة", unread: true, icon: ShieldCheck },
    { id: 3, title: "خصم هذا الأسبوع", text: "خصم 10% على تبديل البطاريات حتى الجمعة.", time: "أمس", unread: false, icon: Sparkles },
  ]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formSent, setFormSent] = useState(false);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      toast("تذكير سريع", { description: "التشخيص الأولي مجاني، وبدون أي التزام." });
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const openBooking = () => {
    setMobileOpen(false);
    setBookingOpen(true);
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const service = String(formData.get("service") ?? "");

    try {
      const result = await bookingMutation.mutateAsync({ name, phone, service });
      if (!result.success) {
        toast.error("تعذر إرسال الطلب", { description: "حاول مرة أخرى أو اتصل بنا مباشرة." });
        return;
      }
    } catch {
      toast.error("تعذر إرسال الطلب", { description: "حاول مرة أخرى أو اتصل بنا مباشرة." });
      return;
    }

    setFormSent(true);
    setNotifications((current) => [
      { id: Date.now(), title: "تم استلام طلبك", text: "سنتواصل معك لتأكيد الموعد خلال دقائق.", time: "الآن", unread: true, icon: Check },
      ...current,
    ]);
    toast.success("تم استلام طلبك", { description: "سنتواصل معك لتأكيد الموعد خلال دقائق." });
  };

  const toggleNotifications = () => {
    setNotificationsOpen((open) => !open);
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  return (
    <div dir="rtl" className="site-shell">
      <Toaster position="top-center" richColors dir="rtl" />
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#home" onClick={() => scrollToSection("home")} aria-label="Saleh الرئيسية">
            <span className="brand-mark"><Wrench size={18} strokeWidth={2.4} /></span>
            <span>Saleh<span className="brand-dot">.</span></span>
          </a>
          <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="التنقل الرئيسي">
            <a href="#home" onClick={() => setMobileOpen(false)}>الرئيسية</a>
            <a href="#services" onClick={() => setMobileOpen(false)}>الخدمات</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>من نحن</a>
            <a href="#faq" onClick={() => setMobileOpen(false)}>الأسئلة الشائعة</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>تواصل</a>
          </nav>
          <div className="nav-actions">
            <a className="phone-link" href="tel:+967774572020"><Phone size={16} /> <span dir="ltr">+967 774 572 020</span></a>
            <div className="notification-wrap">
              <button className={`notification-button ${notificationsOpen ? "is-active" : ""}`} onClick={toggleNotifications} aria-label="فتح الإشعارات" aria-expanded={notificationsOpen}>
                <Bell size={17} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {notificationsOpen && <div className="notification-panel" role="region" aria-label="الإشعارات">
                <div className="notification-panel-head"><div><b>الإشعارات</b><small>{unreadCount ? `${unreadCount} جديدة` : "لا توجد إشعارات جديدة"}</small></div><button onClick={() => setNotifications([])}>مسح الكل</button></div>
                <div className="notification-list">{notifications.length ? notifications.map((notification) => { const Icon = notification.icon; return <button className={`notification-item ${notification.unread ? "unread" : ""}`} key={notification.id} onClick={() => setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, unread: false } : item))}><span className="notification-icon"><Icon size={15} /></span><span className="notification-copy"><b>{notification.title}</b><small>{notification.text}</small><em>{notification.time}</em></span>{notification.unread && <i />}</button>; }) : <div className="notification-empty"><Bell size={22} /><span>أنت على اطلاع بكل جديد</span></div>}</div>
              </div>}
            </div>
            <button className="nav-cta" onClick={openBooking}>احجز موعدك <ArrowLeft size={16} /></button>
            <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid" />
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-content page-container">
            <div className="hero-copy reveal-up">
              <div className="eyebrow"><span className="eyebrow-line" /> صيانة تفهم جهازك</div>
              <h1>جوالك يستاهل<br /><em>شغلًا صح.</em></h1>
              <p>نصلح الشاشات والبطاريات وأعطال البرمجيات بسعر واضح. تشخيص مجاني واستشارة صريحة قبل أي إصلاح.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={openBooking}>احجز تشخيصك المجاني <ArrowLeft size={18} /></button>
                <a className="button button-ghost" href="tel:+967774572020"><Phone size={17} /> اتصل الآن</a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack"><span>ع</span><span>م</span><span>س</span><span className="avatar-more">+<small>2k</small></span></div>
                <div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><strong>يثق بنا أكثر من 2,000 عميل</strong></div>
              </div>
            </div>
            <div className="hero-visual reveal-up delay-2">
              <div className="visual-backdrop" />
              <div className="repair-card">
                <div className="repair-card-top"><span className="live-dot" /> حالة الجهاز <span className="repair-id">#SLH-2048</span></div>
                <div className="phone-stage">
                  <div className="phone-glow" />
                  <div className="phone-device">
                    <div className="phone-camera"><span /><span /><span /></div>
                    <div className="phone-screen"><div className="screen-time">09:41</div><div className="screen-date">الثلاثاء، 16 سبتمبر</div><div className="screen-orbit" /><div className="screen-battery"><span /></div></div>
                  </div>
                  <div className="floating-chip chip-top"><ScanSearch size={15} /><span>فحص شامل<br /><b>100%</b></span></div>
                  <div className="floating-chip chip-bottom"><ShieldCheck size={15} /><span>ضمان<br /><b>موثوق</b></span></div>
                </div>
                <div className="repair-progress"><div className="progress-label"><span>جاري التشخيص</span><b>72%</b></div><div className="progress-track"><span /></div></div>
              </div>
              <div className="floating-note"><Sparkles size={16} /><span>لا إصلاح<br /><b>بدون موافقتك</b></span></div>
            </div>
          </div>
          <div className="hero-bottom page-container"><span>نصلحها من الجذر</span><div className="scroll-cue"><span /> مرّر لاكتشاف المزيد</div><span dir="ltr">EST. 2018 — LOS ANGELES</span></div>
        </section>

        <section className="intro section-light" id="about">
          <div className="page-container intro-grid">
            <div className="section-label"><span>01</span><span className="label-line" /><span>لماذا صالح؟</span></div>
            <div className="intro-copy"><h2>الصيانة ليست<br /><em>مجرد تغيير شاشة.</em></h2><p>نحن نعالج جذر المشكلة، البرمجي والعتادي معًا، حتى لا يرجع جهازك لنفس العطل بعد أسبوع. تشخيص صريح وسعر واضح قبل أي شغل.</p><button className="text-link" onClick={() => scrollToSection("services")}>اكتشف خدماتنا <ArrowLeft size={17} /></button></div>
            <div className="intro-stat"><span className="stat-number">08</span><span className="stat-label">سنوات من الخبرة<br />في إصلاح الأجهزة</span></div>
          </div>
        </section>

        <section className="services-section section-light" id="services">
          <div className="page-container">
            <div className="section-heading"><div><div className="eyebrow dark"><span className="eyebrow-line" /> خدماتنا</div><h2>نرجّع جهازك<br /><em>للحياة.</em></h2></div><p>من أول فحص إلى لحظة التسليم، كل خطوة محسوبة لتخرج وأنت مطمئن.</p></div>
            <div className="service-grid">{services.map((service) => { const Icon = service.icon; return <article className={`service-card card-${service.accent}`} key={service.number}><div className="service-top"><span className="service-icon"><Icon size={23} /></span><span className="service-number">{service.number}</span></div><h3>{service.title}</h3><p>{service.text}</p><a href="#contact" className="card-arrow" aria-label={`المزيد عن ${service.title}`}><ArrowUpLeft size={18} /></a></article>; })}</div>
            <div className="service-bottom"><div className="mini-points"><span><Check size={14} /> قطع موثوقة</span><span><Check size={14} /> سعر قبل الإصلاح</span><span><Check size={14} /> ضمان مكتوب</span></div><button className="outline-button" onClick={openBooking}>تحدث مع صالح <MessageCircle size={17} /></button></div>
          </div>
        </section>

        <section className="trust-section">
          <div className="page-container trust-grid">
            <div className="trust-copy"><div className="eyebrow"><span className="eyebrow-line" /> شغل نظيف. كلام واضح.</div><h2>لأن جهازك<br /><em>جزء من يومك.</em></h2><p>نحن نعرف أن الجوال ليس مجرد قطعة إلكترونية. عليه صورك، شغلك، محادثاتك، وتفاصيل يومك. لذلك نتعامل معه بنفس العناية التي نعامل بها أجهزتنا.</p><div className="trust-list"><div><span className="trust-icon"><ScanSearch size={18} /></span><span><b>فحص شامل</b><small>نخبرك بالمشكلة الحقيقية قبل أن نلمس جهازك.</small></span></div><div><span className="trust-icon"><HeartHandshake size={18} /></span><span><b>نصيحة صريحة</b><small>إذا لم يكن الإصلاح مجديًا، سنخبرك بذلك.</small></span></div></div></div>
            <div className="trust-quote"><div className="quote-mark">“</div><p>أول ما نزلت على صالح، شرح لي المشكلة بصراحة بدل ما يبيع عليّ قطع غيار. الشاشة اتصلحت في نفس اليوم والسعر كان زي ما قالي بالضبط.</p><div className="quote-author"><span className="author-avatar">ع</span><span><b>علي محمد</b><small>عميل منذ 2021</small></span><div className="quote-stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div></div></div>
          </div>
        </section>

        <section className="metrics-section section-light"><div className="page-container"><div className="metrics-heading"><div className="eyebrow dark"><span className="eyebrow-line" /> نتائج ملموسة</div><h2>أرقام من داخل<br /><em>صيانة صالح.</em></h2><p>كل إصلاح يمر بفحص، وكل جهاز يُعاد إليك بحالة تخليك مطمئن.</p></div><div className="metrics-grid"><div><strong>100<span>%</span></strong><small>فحص شامل قبل الإصلاح</small></div><div><strong>48<span>س</span></strong><small>إنجاز معظم الإصلاحات</small></div><div><strong>30<span>د</span></strong><small>تشخيص أولي مجاني</small></div><div><strong>365</strong><small>دعم متابعة بعد الإصلاح</small></div></div></div></section>

        <section className="faq-section section-light" id="faq"><div className="page-container faq-grid"><div className="faq-intro"><div className="eyebrow dark"><span className="eyebrow-line" /> عندك سؤال؟</div><h2>نحب الكلام<br /><em>الواضح.</em></h2><p>إجابات مختصرة على أكثر الأسئلة التي تصلنا. وإذا لم تجد سؤالك، تواصل معنا مباشرة.</p><a className="text-link" href="tel:+967774572020">اسأل صالح مباشرة <ArrowLeft size={17} /></a></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${activeFaq === index ? "active" : ""}`} key={question}><button onClick={() => setActiveFaq(activeFaq === index ? -1 : index)} aria-expanded={activeFaq === index}><span>{question}</span><ChevronDown size={19} /></button>{activeFaq === index && <div className="faq-answer"><p>{answer}</p></div>}</div>)}</div></div></section>

        <section className="testimonial-section"><div className="page-container"><div className="testimonial-header"><div><div className="eyebrow"><span className="eyebrow-line" /> آراء العملاء</div><h2>ثقة تُبنى مع<br /><em>كل جهاز.</em></h2></div><div className="testimonial-controls"><button onClick={() => setActiveTestimonial((activeTestimonial + testimonials.length - 1) % testimonials.length)} aria-label="التقييم السابق">←</button><span>0{activeTestimonial + 1} / 0{testimonials.length}</span><button onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)} aria-label="التقييم التالي">→</button></div></div><div className="testimonial-card"><div className="testimonial-quote"><div className="big-quote">“</div><p>{testimonials[activeTestimonial].quote}</p></div><div className="testimonial-person"><div className="person-avatar">{testimonials[activeTestimonial].name.slice(0, 1)}</div><div><b>{testimonials[activeTestimonial].name}</b><small>{testimonials[activeTestimonial].place}</small></div><div className="testimonial-stars"><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /></div></div></div></div></section>

        <section className="cta-section" id="contact"><div className="cta-pattern" /><div className="page-container cta-inner"><div><div className="eyebrow light"><span className="eyebrow-line" /> جاهز نبدأ؟</div><h2>مشكلة في جهازك؟<br /><em>التشخيص علينا.</em></h2><p>نشخّص مشكلتك مجانًا ونخبرك بتكلفة الإصلاح قبل أي خطوة.</p></div><div className="cta-actions"><button className="button button-white" onClick={openBooking}>احجز استشارتك المجانية <ArrowLeft size={18} /></button><a href="tel:+967774572020" className="cta-phone"><Phone size={17} /><span><small>أو اتصل بنا الآن</small><b dir="ltr">+967 774 572 020</b></span></a></div></div></section>
      </main>

      <footer className="site-footer"><div className="page-container footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Wrench size={18} /></span><span>Saleh<span className="brand-dot">.</span></span></a><p>إصلاح يفهم جهازك.<br />وصراحة تقدر تثق فيها.</p><div className="footer-nav"><a href="#home">الرئيسية</a><a href="#services">الخدمات</a><a href="#about">من نحن</a><a href="#contact">تواصل</a></div></div><div className="page-container footer-bottom"><span>© 2026 Saleh. جميع الحقوق محفوظة.</span><span className="footer-legal"><a href="#contact">سياسة الخصوصية</a><a href="#contact">شروط الخدمة</a></span><span dir="ltr">LOS ANGELES · CA</span></div></footer>

      {bookingOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><div className="booking-modal"><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="إغلاق"><X size={19} /></button>{formSent ? <div className="success-state"><span className="success-icon"><Check size={28} /></span><h2>وصلنا طلبك.</h2><p>شكرًا لثقتك. سنتواصل معك على الرقم الذي أدخلته لتأكيد الموعد.</p><button className="button button-primary" onClick={() => { setFormSent(false); setBookingOpen(false); }}>تم، شكرًا</button></div> : <><div className="modal-kicker">حجز سريع · مجاني</div><h2 id="booking-title">خلّينا نسمع<br /><em>عن مشكلة جهازك.</em></h2><p className="modal-intro">اترك بياناتك وسنتواصل معك لتأكيد الموعد والوقت المناسب لك.</p><form onSubmit={submitBooking}><label>الاسم الكامل<input required name="name" placeholder="اكتب اسمك" /></label><label>رقم الجوال<input required name="phone" type="tel" placeholder="05x xxx xxxx" dir="ltr" /></label><label>نوع الخدمة<select name="service" defaultValue="إصلاح شاشة"><option>إصلاح شاشة</option><option>تبديل بطارية</option><option>إصلاح برمجيات</option><option>استعادة بيانات</option></select></label><button className="button button-primary full-button" type="submit" disabled={bookingMutation.isPending}>{bookingMutation.isPending ? "جاري إرسال الطلب..." : <>أرسل طلب الحجز <ArrowLeft size={18} /></>}</button></form><div className="modal-note"><ShieldCheck size={15} /> لا نشارك بياناتك مع أي جهة.</div></>}</div></div>}
    </div>
  );
}
