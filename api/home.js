
const HOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="MiChoice Technology Systems — First-rate, leading-edge K-12 child nutrition software at affordable prices. eMeal POS, COMS-PRO, FAR-Apps and more.">
<title>MiChoice Technology Systems | K-12 School Food Service Software</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0a0a;--bg2:#111111;--bg3:#141414;--bg4:#1a1a1a;
  --border:#1f1f1f;--border2:#2a2a2a;
  --accent:#3b82f6;--accent-d:#2563eb;--accent-bg:rgba(59,130,246,.08);--accent-bg2:rgba(59,130,246,.15);
  --t1:#f5f5f5;--t2:#a3a3a3;--t3:#6b7280;
  --font:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--t1);line-height:1.6}
a{color:inherit;text-decoration:none}

/* NAV */
nav{background:var(--bg2);border-bottom:1px solid var(--border);padding:0 2rem;position:sticky;top:0;z-index:100}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:1.2rem;font-weight:700;letter-spacing:-.02em}
.logo .mi{color:var(--accent)}
.nav-links{display:flex;gap:1.75rem;list-style:none}
.nav-links a{color:var(--t2);font-size:.88rem;font-weight:500;transition:color .2s}
.nav-links a:hover,.nav-links a.active{color:var(--accent)}
.nav-cta{background:var(--accent);color:#000 !important;padding:.4rem 1rem;border-radius:4px;font-weight:600 !important;transition:background .2s !important}
.nav-cta:hover{background:var(--accent-d) !important;color:#000 !important}

/* HERO */
.hero{max-width:1200px;margin:0 auto;padding:5rem 2rem 4rem}
.hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:var(--accent-bg);border:1px solid rgba(59,130,246,.3);color:var(--accent);font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:.35rem .8rem;border-radius:20px;margin-bottom:1.5rem}
.hero h1{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-bottom:1.25rem}
.hero h1 .orange{color:var(--accent)}
.hero p{font-size:1.1rem;color:var(--t2);max-width:620px;margin-bottom:2.5rem;line-height:1.75}
.hero-actions{display:flex;gap:1rem;flex-wrap:wrap}
.btn-primary{background:var(--accent);color:#000;padding:.75rem 1.75rem;border-radius:5px;font-weight:700;font-size:.95rem;transition:background .2s}
.btn-primary:hover{background:var(--accent-d)}
.btn-secondary{border:1px solid var(--border2);color:var(--t1);padding:.75rem 1.75rem;border-radius:5px;font-weight:600;font-size:.95rem;transition:all .2s}
.btn-secondary:hover{border-color:var(--accent);color:var(--accent)}

/* STATS */
.stats{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.stats-inner{max-width:1200px;margin:0 auto;padding:2.5rem 2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:2rem}
.stat-item{text-align:center}
.stat-num{font-size:2rem;font-weight:800;color:var(--accent);letter-spacing:-.03em}
.stat-label{font-size:.85rem;color:var(--t2);margin-top:.25rem}

/* SECTION */
.section{max-width:1200px;margin:0 auto;padding:5rem 2rem}
.section-header{margin-bottom:3rem}
.section-header .eyebrow{color:var(--accent);font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.75rem}
.section-header h2{font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;letter-spacing:-.03em;margin-bottom:.75rem}
.section-header p{color:var(--t2);max-width:600px;font-size:1rem}

/* PRODUCT GRID */
.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem}
.product-card{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:1.75rem;transition:border-color .2s,background .2s;position:relative;overflow:hidden}
.product-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);opacity:0;transition:opacity .2s}
.product-card:hover{border-color:var(--border2);background:var(--bg4)}
.product-card:hover::before{opacity:1}
.product-card a.product-card-link{display:block;position:absolute;inset:0}
.product-icon{width:40px;height:40px;background:var(--accent-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
.product-icon svg{width:20px;height:20px;stroke:var(--accent);fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.product-card h3{font-size:1.05rem;font-weight:700;margin-bottom:.5rem;letter-spacing:-.01em}
.product-card .product-name-sub{font-size:.78rem;color:var(--accent);font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:.75rem}
.product-card p{font-size:.88rem;color:var(--t2);line-height:1.65}
.product-card .learn-more{display:inline-flex;align-items:center;gap:.35rem;color:var(--accent);font-size:.82rem;font-weight:600;margin-top:1rem;transition:gap .2s}
.product-card:hover .learn-more{gap:.6rem}

/* ABOUT STRIP */
.about-strip{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.about-inner{max-width:1200px;margin:0 auto;padding:4rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.about-inner h2{font-size:2rem;font-weight:800;letter-spacing:-.03em;margin-bottom:1rem}
.about-inner p{color:var(--t2);margin-bottom:1rem;font-size:.95rem;line-height:1.75}
.about-pillars{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem}
.pillar{background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:1.25rem}
.pillar h4{font-size:.9rem;font-weight:700;color:var(--t1);margin-bottom:.35rem}
.pillar p{font-size:.82rem;color:var(--t2);line-height:1.5}
.pillar .icon{color:var(--accent);font-size:1.1rem;margin-bottom:.5rem}

/* CTA */
.cta-section{text-align:center;padding:5rem 2rem;max-width:700px;margin:0 auto}
.cta-section h2{font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;letter-spacing:-.03em;margin-bottom:1rem}
.cta-section p{color:var(--t2);margin-bottom:2rem;font-size:1rem}
.cta-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}

/* FOOTER */
footer{background:var(--bg2);border-top:1px solid var(--border);padding:3rem 2rem}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem}
.footer-brand .logo{font-size:1.1rem;font-weight:700;margin-bottom:.75rem;display:block}
.footer-brand p{font-size:.85rem;color:var(--t3);line-height:1.65;max-width:260px}
.footer-col h4{font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);margin-bottom:1rem}
.footer-col ul{list-style:none}
.footer-col li{margin-bottom:.6rem}
.footer-col a{font-size:.85rem;color:var(--t2);transition:color .2s}
.footer-col a:hover{color:var(--accent)}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center}
.footer-bottom p{font-size:.82rem;color:var(--t3)}
.footer-bottom .accent{color:var(--accent)}

/* SCREENSHOTS */
.screenshots-section{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.screenshots-inner{max-width:1200px;margin:0 auto;padding:5rem 2rem}
.screenshots-inner .section-header{margin-bottom:2.5rem}
.screenshot-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.screenshot-card{background:var(--bg3);border:1px solid var(--border);border-radius:8px;overflow:hidden;transition:border-color .2s,transform .2s}
.screenshot-card:hover{border-color:var(--border2);transform:translateY(-2px)}
.screenshot-card img{width:100%;display:block;border-bottom:1px solid var(--border)}
.screenshot-caption{padding:.85rem 1rem;font-size:.82rem;color:var(--t2);line-height:1.5}
.screenshot-caption strong{color:var(--t1);display:block;margin-bottom:.2rem;font-size:.85rem}

/* RESPONSIVE */
@media(max-width:768px){
  .nav-links{display:none}
  .about-inner{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr 1fr}
  .about-pillars{grid-template-columns:1fr}
  .screenshot-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>


<nav>
  <div class="nav-inner">
    <a href="index.html" class="logo"><span class="mi">Mi</span>Choice Technology Systems</a>
    <ul class="nav-links">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="aboutus.html">About</a></li>
      <li><a href="products.html">Products</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="support.html">Support</a></li>
      <li><a href="contactus.html" class="nav-cta">Contact Us</a></li>
    </ul>
  </div>
</nav>

<section style="background:var(--bg)">
  <div class="hero">
    <div class="hero-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      35+ Years in K-12 Child Nutrition
    </div>
    <h1>School Food Service Software<br><span class="orange">Built to Last.</span></h1>
    <p>From the cafeteria serving line to the central office — MiChoice Technology Systems delivers first-rate, leading-edge K-12 child nutrition software at affordable prices. Every module. Fully integrated. Fully compliant.</p>
    <div class="hero-actions">
      <a href="products.html" class="btn-primary">Explore Products</a>
      <a href="contactus.html" class="btn-secondary">Request a Demo</a>
    </div>
  </div>
</section>

<div class="stats">
  <div class="stats-inner">
    <div class="stat-item">
      <div class="stat-num">35+</div>
      <div class="stat-label">Years of Industry Experience</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">K-12</div>
      <div class="stat-label">Exclusively Child Nutrition</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">12+</div>
      <div class="stat-label">Integrated Software Modules</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">USDA</div>
      <div class="stat-label">Compliance Built In</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">24/7</div>
      <div class="stat-label">Help Desk &amp; On-Site Support</div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-header">
    <div class="eyebrow">Products</div>
    <h2>The Complete K-12 Nutrition Suite</h2>
    <p>Every module works independently or as a fully integrated system — designed for both front-line cafeteria personnel and district management.</p>
  </div>

  <div class="product-grid">

    <div class="product-card">
      <a href="pointofsalesystems.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </div>
      <div class="product-name-sub">miMeal <span style="font-weight:400;font-size:.68em;opacity:.55">(eMeal)</span></div>
      <h3>Touch Screen Point of Sale</h3>
      <p>Client/server POS on any Windows touch screen PC. Lunch line efficiency, serving line accounting, comprehensive management reports — all USDA compliant.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="centralmgmtsoftware.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      </div>
      <div class="product-name-sub">miComs <span style="font-weight:400;font-size:.68em;opacity:.55">(COMS-PRO)</span></div>
      <h3>Central Office Management</h3>
      <p>The hub of your district's nutrition data. Real-time bi-directional data transfer, centralized F&amp;R processing, and district-wide meal accountability reporting.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="feereducedapplicationssoftware.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </div>
      <div class="product-name-sub">miFAR <span style="font-weight:400;font-size:.68em;opacity:.55">(FAR-Apps)</span></div>
      <h3>Free &amp; Reduced Application Processing</h3>
      <p>Automates eligibility processing end-to-end. Real-time status updates at the POS, maximum school lunch funding, full compliance audit trail.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="onlinefreeandreducedapplications.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      </div>
      <div class="product-name-sub">Online F&amp;R</div>
      <h3>Online Free &amp; Reduced Applications</h3>
      <p>Digital F&amp;R applications for families — accessible anywhere, anytime. Reduces paper, reduces processing time, integrates directly with FAR-Apps.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="onlinemealpayment.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      </div>
      <div class="product-name-sub">miMealMoney <span style="font-weight:400;font-size:.68em;opacity:.55">(mymealmoney.com)</span></div>
      <h3>Online Patron Meal Payments</h3>
      <p>Credit and debit card payments online. Parents pay from home, balances import automatically — zero manual data entry for district staff.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="onlinemealaccountretrieval.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      </div>
      <div class="product-name-sub">Parent Portal</div>
      <h3>Online Meal Account Retrieval</h3>
      <p>Give parents 24/7 access to their student's meal account balance. Proactive balance alerts, transaction history, and secure account management.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="inventorysoftware.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div class="product-name-sub">miInventory <span style="font-weight:400;font-size:.68em;opacity:.55">(EZ-Task)</span></div>
      <h3>Inventory Control Software</h3>
      <p>300+ reports. Track items, quantities, cost of goods, reorder levels, commodity cross-references. Dramatically cuts inventory time and eliminates manual extensions.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="timeandattendancesoftware.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="product-name-sub">miTimes <span style="font-weight:400;font-size:.68em;opacity:.55">(ETC)</span></div>
      <h3>Time &amp; Attendance Software</h3>
      <p>Turn any PC — including your POS terminal — into a time clock. Automated time cards, gross wages calculation, centralized employee database.</p>
      <span class="learn-more">Learn more →</span>
    </div>

    <div class="product-card">
      <a href="services.html" class="product-card-link"></a>
      <div class="product-icon">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="product-name-sub">Support</div>
      <h3>Installation, Training &amp; Help Desk</h3>
      <p>Unequaled telephone help desk and on-site support. Every implementation is backed by our experienced team — from day one through years of operation.</p>
      <span class="learn-more">Learn more →</span>
    </div>

  </div>
</div>

<div class="about-strip">
  <div class="about-inner">
    <div>
      <h2>35 Years. One Industry.<br>Zero Compromises.</h2>
      <p>MiChoice Technology Systems was founded with a single focus: school food service. Not general ERP. Not retail POS. K-12 child nutrition — exclusively.</p>
      <p>Our staff brings over 35 years of hands-on school food service technology experience. We blend strategic technology expertise with deep operational knowledge to create solutions that actually work in the cafeteria and the central office.</p>
      <a href="aboutus.html" class="btn-secondary" style="display:inline-block;margin-top:1rem">Our Story →</a>
    </div>
    <div class="about-pillars">
      <div class="pillar">
        <div class="icon">◆</div>
        <h4>Holistic Approach</h4>
        <p>We solve the whole problem — software, hardware, implementation, and ongoing support.</p>
      </div>
      <div class="pillar">
        <div class="icon">◆</div>
        <h4>Microsoft Platform</h4>
        <p>Built on Microsoft development tools — robust, reliable, and integrated with your existing infrastructure.</p>
      </div>
      <div class="pillar">
        <div class="icon">◆</div>
        <h4>Fully Integrated</h4>
        <p>Every module shares one data source. Real-time bi-directional data flow across all systems.</p>
      </div>
      <div class="pillar">
        <div class="icon">◆</div>
        <h4>Affordable</h4>
        <p>First-rate software at prices built for district budgets — not enterprise sales cycles.</p>
      </div>
    </div>
  </div>
</div>

<div class="screenshots-section">
  <div class="screenshots-inner">
    <div class="section-header">
      <div class="eyebrow">Platform Screenshots</div>
      <h2>eMeal in Action</h2>
      <p>eMeal is built for the pace of real school cafeteria operations. Every screen is designed for speed, compliance, and clarity.</p>
    </div>
    <div class="screenshot-grid">

      <div class="screenshot-card">
        <img src="screenshots/ss_pos_terminal.png" alt="MiMeals POS Terminal — 3-panel serving interface" loading="lazy">
        <div class="screenshot-caption">
          <strong>MiMeals POS Terminal</strong>
          3-panel serving interface at 1,000+ students/hour
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_dashboard.png" alt="Manager Dashboard with miAgentic Production Advisor" loading="lazy">
        <div class="screenshot-caption">
          <strong>Manager Dashboard</strong>
          miAgentic Production Advisor surfaces insights each morning
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_reports.png" alt="miReports — District analytics with eligibility visualization" loading="lazy">
        <div class="screenshot-caption">
          <strong>miReports</strong>
          District analytics with 7 CFR 245 compliant eligibility visualization
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_inventory.png" alt="miInventory — AI reorder predictions" loading="lazy">
        <div class="screenshot-caption">
          <strong>miInventory</strong>
          AI predicts reorder needs before tomorrow's service
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_bom.png" alt="Recipe/BOM Editor split panel" loading="lazy">
        <div class="screenshot-caption">
          <strong>Recipe/BOM Editor</strong>
          Map menu items to ingredients once; auto-deduct runs daily
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_timeatt.png" alt="miTimes — Live roster with staff cards" loading="lazy">
        <div class="screenshot-caption">
          <strong>miTimes</strong>
          Live roster with position-coded staff cards, 60-second refresh
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_training.png" alt="miTraining — Voice-guided cashier onboarding" loading="lazy">
        <div class="screenshot-caption">
          <strong>miTraining</strong>
          Voice-guided cashier onboarding with real district menu data
        </div>
      </div>

      <div class="screenshot-card">
        <img src="screenshots/ss_clockin.png" alt="POS Clock-In Kiosk PIN entry" loading="lazy">
        <div class="screenshot-caption">
          <strong>POS Clock-In</strong>
          Staff clock in at the register before serving begins
        </div>
      </div>

    </div>
  </div>
</div>

<div class="cta-section">
  <h2>Ready to Transform Your Food Service Program?</h2>
  <p>Talk to our team about the right suite of tools for your district — from a single module to the complete integrated system.</p>
  <div class="cta-actions">
    <a href="contactus.html" class="btn-primary">Request a Demo</a>
    <a href="products.html" class="btn-secondary">View All Products</a>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="logo"><span class="mi">Mi</span>Choice Technology Systems</span>
        <p>First-rate, leading-edge K-12 child nutrition software at affordable prices. Serving school food service programs for over 35 years.</p>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="pointofsalesystems.html">miMeal <span style="font-weight:400;font-size:.68em;opacity:.55">(eMeal)</span> POS</a></li>
          <li><a href="centralmgmtsoftware.html">miComs <span style="font-weight:400;font-size:.68em;opacity:.55">(COMS-PRO)</span></a></li>
          <li><a href="feereducedapplicationssoftware.html">miFAR <span style="font-weight:400;font-size:.68em;opacity:.55">(FAR-Apps)</span></a></li>
          <li><a href="inventorysoftware.html">miInventory <span style="font-weight:400;font-size:.68em;opacity:.55">(EZ-Task)</span> Inventory</a></li>
          <li><a href="timeandattendancesoftware.html">Time &amp; Attendance</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="aboutus.html">About Us</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="support.html">Support</a></li>
          <li><a href="contactus.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="contactus.html">Request a Demo</a></li>
          <li><a href="support.html">Help Desk</a></li>
          <li><a href="support.html">On-Site Support</a></li>
          <li><a href="support.html">Training</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 <span class="accent">MiChoice Technology Systems, Inc.</span> All rights reserved.</p>
    </div>
  </div>
</footer>



<script src="/chat-widget.js" defer></script>
</body>
</html>`;

// Serves the homepage at the site root (the static index.html is shadowed by public/ on this project).
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(HOME_HTML);
};
