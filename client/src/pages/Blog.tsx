import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Menu, Search, Send, X } from "lucide-react";

const telegramUrl = "https://t.me/Sal766_bot/Salehphone";

const posts = [
  {
    id: 1,
    category: "صيانة الأجهزة",
    title: "كيف تعرف أن بطارية هاتفك تحتاج إلى التبديل؟",
    excerpt: "علامات بسيطة تساعدك على اكتشاف تراجع البطارية قبل أن تتوقف عن العمل في الوقت الخطأ.",
    date: "22 سبتمبر 2026",
    readTime: "5 دقائق",
    accent: "#dff4ef",
    content: [
      "تراجع أداء البطارية لا يحدث فجأة دائمًا. غالبًا يرسل الهاتف إشارات مبكرة مثل انخفاض الشحن بسرعة، ارتفاع الحرارة، أو انطفاء الجهاز قبل وصول النسبة إلى الصفر.",
      "ابدأ بمراجعة صحة البطارية واستهلاك التطبيقات، ثم جرّب شاحنًا وكابلًا موثوقين. إذا استمرت المشكلة، فمن الأفضل إجراء فحص احترافي بدل تغيير البطارية عشوائيًا.",
      "البطارية المناسبة والتركيب الصحيح يحافظان على أداء الهاتف ويقللان مخاطر الانتفاخ أو تلف المكونات الداخلية.",
    ],
  },
  {
    id: 2,
    category: "أمان البيانات",
    title: "خطوات مهمة لحماية صورك وملفاتك قبل إصلاح الهاتف",
    excerpt: "نسخة احتياطية صغيرة قد توفر عليك خسارة سنوات من الصور والمحادثات والملفات المهمة.",
    date: "18 سبتمبر 2026",
    readTime: "7 دقائق",
    accent: "#e8e4f5",
    content: [
      "قبل تسليم الهاتف للصيانة، خذ نسخة احتياطية من الصور وجهات الاتصال والمحادثات. استخدم iCloud أو Google Drive أو انسخ الملفات إلى حاسوب موثوق.",
      "سجّل حساباتك المهمة وتأكد من أنك تعرف كلمات المرور، ثم فعّل وضع النسخ الاحتياطي التلقائي. لا ترسل رمز قفل جهازك إلا عند الحاجة الفعلية لاختبار الإصلاح.",
      "إذا كان الهاتف لا يعمل، أخبر الفني بذلك قبل بدء العمل حتى يختار طريقة فحص تحافظ على البيانات قدر الإمكان.",
    ],
  },
  {
    id: 3,
    category: "نصائح تقنية",
    title: "هاتف بطيء؟ جرّب هذه الحلول قبل إعادة ضبط المصنع",
    excerpt: "حلول عملية لتخفيف البطء والتعليق دون حذف ملفاتك أو البدء من الصفر.",
    date: "12 سبتمبر 2026",
    readTime: "6 دقائق",
    accent: "#f7e7dc",
    content: [
      "ابدأ بتحديث النظام والتطبيقات، ثم اترك مساحة تخزين فارغة مناسبة. امتلاء الذاكرة من أكثر أسباب البطء شيوعًا.",
      "راجع التطبيقات التي تعمل في الخلفية واحذف ما لا تستخدمه. أعد تشغيل الهاتف بانتظام، وافحصه إذا ظهرت نوافذ غريبة أو استهلاك غير معتاد للبطارية.",
      "إذا لم تتحسن السرعة، قد تكون المشكلة في البطارية أو وحدة التخزين أو النظام نفسه. الفحص قبل إعادة ضبط المصنع يوفر عليك فقدان البيانات دون داعٍ.",
    ],
  },
  {
    id: 4,
    category: "إصلاح الشاشات",
    title: "هل يمكن إصلاح شاشة مكسورة أم يجب تبديلها؟",
    excerpt: "الفرق بين الزجاج المكسور والشاشة التالفة، ومتى يكون الإصلاح آمنًا ومجديًا.",
    date: "7 سبتمبر 2026",
    readTime: "4 دقائق",
    accent: "#e1eff7",
    content: [
      "إذا كان اللمس والصورة يعملان بشكل طبيعي، فقد يكون الضرر في الزجاج الخارجي فقط، لكن معظم الهواتف الحديثة تحتاج إلى تبديل وحدة الشاشة كاملة.",
      "الخطوط الملونة، البقع السوداء، اللمس المتقطع أو انطفاء جزء من الشاشة علامات على تلف اللوحة الداخلية.",
      "لا تعتمد على السعر وحده. اسأل عن نوع القطعة، الضمان، واختبار الشاشة بعد التركيب قبل الموافقة على الإصلاح.",
    ],
  },
];

const categories = ["الكل", ...Array.from(new Set(posts.map((post) => post.category)))];

export default function Blog() {
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<(typeof posts)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "الكل" || post.category === category;
      const matchesQuery = !normalizedQuery || `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div dir="rtl" className="blog-shell">
      <header className="blog-header">
        <div className="blog-container blog-nav">
          <a className="blog-brand" href="#top" onClick={() => setSelectedPost(null)}>
            Saleh<span>.</span>
          </a>
          <nav className={menuOpen ? "blog-menu is-open" : "blog-menu"}>
            <a href="#top" onClick={() => setMenuOpen(false)}>الرئيسية</a>
            <a href="#articles" onClick={() => setMenuOpen(false)}>المقالات</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>عن المدونة</a>
            <a href={telegramUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>تواصل معنا</a>
          </nav>
          <a className="blog-nav-cta" href={telegramUrl} target="_blank" rel="noreferrer"><Send size={16} /> اسأل صالح</a>
          <button className="blog-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="فتح القائمة">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className="blog-hero">
          <div className="blog-container blog-hero-grid">
            <div>
              <span className="blog-kicker">مدونة صالح التقنية</span>
              <h1>معلومة واضحة.<br /><em>جهاز أفضل.</em></h1>
              <p>نصائح عملية وتجارب صادقة تساعدك على فهم هاتفك، حماية بياناتك، واتخاذ قرار الإصلاح المناسب.</p>
              <a className="blog-primary-button" href="#articles">تصفح المقالات <ArrowLeft size={18} /></a>
            </div>
            <div className="blog-feature-card">
              <span className="blog-feature-label">المقال المميز</span>
              <h2>{posts[0].title}</h2>
              <p>{posts[0].excerpt}</p>
              <button onClick={() => setSelectedPost(posts[0])}>اقرأ المقال <ArrowLeft size={17} /></button>
            </div>
          </div>
        </section>

        <section className="blog-content blog-container" id="articles">
          <div className="blog-section-heading">
            <div><span className="blog-kicker dark">المكتبة</span><h2>أحدث المقالات</h2></div>
            <p>اختر القسم الذي يهمك أو ابحث عن إجابة لسؤالك.</p>
          </div>
          <div className="blog-tools">
            <div className="blog-categories">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <label className="blog-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في المقالات" aria-label="البحث في المقالات" /></label>
          </div>
          <div className="blog-grid">
            {filteredPosts.map((post) => <article className="blog-card" key={post.id}>
              <div className="blog-card-art" style={{ background: post.accent }}><span>{String(post.id).padStart(2, "0")}</span><div className="blog-art-circle" /></div>
              <div className="blog-card-body"><span className="blog-card-category">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><div className="blog-card-meta"><span><CalendarDays size={14} /> {post.date}</span><span><Clock3 size={14} /> {post.readTime}</span></div><button onClick={() => setSelectedPost(post)}>اقرأ المزيد <ArrowLeft size={16} /></button></div>
            </article>)}
          </div>
          {!filteredPosts.length && <div className="blog-empty">لم نعثر على مقال مطابق. جرّب كلمة بحث أخرى.</div>}
        </section>

        <section className="blog-about" id="about"><div className="blog-container blog-about-inner"><div><span className="blog-kicker">لماذا هذه المدونة؟</span><h2>نكتب ما يفيدك<br /><em>قبل أن تصل للصيانة.</em></h2></div><p>هدفنا أن تحصل على معلومة صريحة بلا تعقيد: متى تصلح جهازك، كيف تحمي بياناتك، ومتى يكون الاستبدال أفضل من الإصلاح.</p><a href={telegramUrl} target="_blank" rel="noreferrer">تحدث معنا على تيليجرام <Send size={17} /></a></div></section>
      </main>

      <footer className="blog-footer"><div className="blog-container"><strong>Saleh<span>.</span></strong><span>© 2026 جميع الحقوق محفوظة</span><a href={telegramUrl} target="_blank" rel="noreferrer">تواصل معنا</a></div></footer>

      {selectedPost && <div className="blog-modal-backdrop" role="dialog" aria-modal="true" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPost(null); }}><article className="blog-modal"><button className="blog-modal-close" onClick={() => setSelectedPost(null)} aria-label="إغلاق"><X size={20} /></button><span className="blog-card-category">{selectedPost.category}</span><h2>{selectedPost.title}</h2><div className="blog-card-meta"><span><CalendarDays size={14} /> {selectedPost.date}</span><span><Clock3 size={14} /> {selectedPost.readTime}</span></div>{selectedPost.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a className="blog-primary-button" href={telegramUrl} target="_blank" rel="noreferrer"><Send size={16} /> اسأل صالح عن جهازك</a></article></div>}
    </div>
  );
}
