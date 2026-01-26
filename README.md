<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>SmartHotel AI - نظام التسعير الاستراتيجي 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Sans-serif:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
<style>
:root {
--dark-blue: #0A2E5A;
--green: #27AE60;
--orange: #F39C12;
--yellow: #F1C40F;
--red: #E74C3C;
--light-blue: #E8F4FD;
--gray: #6C757D;
--border: #dee2e6;
--card-bg: #ffffff;
--input-bg: #f8f9fa;
--modal-bg: #ffffff;
--text-main: #212529;
--text-muted: #6c757d;
--success: #28a745;
--danger: #dc3545;
--font-sans: 'Sans-serif', Arial, sans-serif;
/* Heatmap Colors */
--very-high: #e74c3c;
--high: #f39c12;
--medium: #f1c40f;
--neutral: #ffffff;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body {
font-family: var(--font-sans);
background-color: #F0F4F8;
color: var(--text-main);
min-height: 100vh;
padding-bottom: 40px;
line-height: 1.6;
}
.container { max-width: 1400px; margin: 0 auto; padding: 20px; }
/* Header */
header { text-align: center; padding: 30px 20px; }
h1 {
font-size: clamp(1.8rem, 4vw, 3rem);
color: var(--dark-blue);
font-weight: 800;
margin-bottom: 10px;
}
/* Panels */
.glass-panel {
background: var(--card-bg);
box-shadow: 0 4px 20px rgba(0,0,0,0.05);
border: 1px solid white;
border-radius: 16px;
padding: clamp(15px, 3vw, 30px);
margin-bottom: 30px;
}
.room-summary-panel {
margin-top: 20px;
display: none;
}
.room-type-card {
background: var(--light-blue);
border-radius: 12px;
padding: 15px;
text-align: center;
border-top: 3px solid var(--dark-blue);
}
.room-type-name {
font-weight: 700;
color: var(--dark-blue);
font-size: 1.1rem;
margin-bottom: 5px;
}
.room-type-count {
font-size: 1.8rem;
font-weight: 800;
color: var(--dark-blue);
margin: 8px 0;
}
.room-type-percent {
color: var(--gray);
font-size: 0.9rem;
}
.form-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
}
.form-group label {
display: block;
margin-bottom: 8px;
color: var(--dark-blue);
font-weight: 600;
font-size: 0.9rem;
}
input, select {
width: 100%;
background: var(--input-bg);
border: 1px solid var(--border);
color: var(--text-main);
padding: 10px 15px;
border-radius: 8px;
font-family: inherit;
font-size: 0.95rem;
}
input:focus, select:focus {
border-color: var(--dark-blue);
outline: none;
box-shadow: 0 0 0 3px rgba(10, 46, 90, 0.1);
}
/* Room Types */
.room-type-row {
display: grid;
grid-template-columns: 2fr 1fr auto;
gap: 15px;
margin-bottom: 10px;
background: var(--light-blue);
padding: 10px;
border-radius: 8px;
align-items: center;
}
/* Buttons */
.btn {
cursor: pointer;
padding: 12px 20px;
border-radius: 8px;
border: none;
font-weight: 700;
transition: all 0.3s ease;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
font-family: var(--font-sans);
font-size: 1rem;
}
.btn-primary {
background: var(--dark-blue);
color: white;
width: 100%;
margin-top: 20px;
box-shadow: 0 4px 15px rgba(10, 46, 90, 0.3);
}
.btn-primary:hover {
background: #082348;
transform: translateY(-2px);
}
.btn-danger {
background: #fff; color: var(--danger); width: 35px; height: 35px; border: 1px solid #ffccd0; padding: 0;
}
.btn-success {
background: var(--green); color: white; width: auto; font-size: 0.9rem; padding: 8px 15px; margin-top: 10px;
}
.btn-loading {
opacity: 0.7;
pointer-events: none;
}
/* Floating Settings Button */
.settings-fab {
position: fixed;
right: 30px;
bottom: 30px;
width: 65px;
height: 65px;
background: var(--dark-blue);
color: white;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 30px;
box-shadow: 0 5px 20px rgba(0,0,0,0.3);
cursor: pointer;
z-index: 999;
transition: transform 0.3s;
border: 2px solid white;
}
.settings-fab:hover { transform: rotate(45deg) scale(1.1); }
.settings-fab::after {
content: 'الإعدادات';
position: absolute;
right: 75px;
background: #333;
color: white;
padding: 5px 10px;
border-radius: 5px;
font-size: 14px;
opacity: 0;
pointer-events: none;
transition: opacity 0.3s;
white-space: nowrap;
}
.settings-fab:hover::after { opacity: 1; }
/* Dashboard Stats */
.dashboard-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 20px;
margin-bottom: 30px;
}
.room-types-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 15px;
margin-top: 15px;
}
.stat-card {
background: var(--card-bg);
padding: 20px;
border-radius: 16px;
box-shadow: 0 2px 10px rgba(0,0,0,0.05);
border-top: 4px solid var(--dark-blue);
}
.stat-value {
font-size: 1.8rem; font-weight: 800; color: var(--dark-blue); margin: 8px 0;
}
.stat-label {
color: var(--text-muted); font-size: 0.9rem; font-weight: 600;
}
.profit-badge {
background: rgba(39, 174, 96, 0.1); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; display: inline-block; margin-top: 8px;
}
/* Calendar */
.month-grid {
display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;
}
.month-card {
background: var(--card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.month-header {
background: var(--dark-blue); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; color: white; font-weight: 600; cursor: pointer;
}
.days-container {
display: grid; grid-template-columns: repeat(7, 1fr); padding: 10px; gap: 3px; background: #fff;
}
.day-cell {
aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: 0.2s; position: relative;
}
.day-cell:hover { transform: scale(1.1); z-index: 2; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
/* Heatmap Classes */
.heat-very-high { background-color: var(--very-high); color: white; }
.heat-high { background-color: var(--high); color: white; }
.heat-medium { background-color: var(--medium); color: #212529; }
.heat-neutral { background-color: #f8f9fa; color: #aaa; border: 1px solid #eee; }
/* Toggle Switch */
.switch-container {
display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;
}
.switch {
position: relative; display: inline-block; width: 46px; height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;
}
.slider:before {
position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;
}
input:checked + .slider { background-color: var(--green); }
input:checked + .slider:before { transform: translateX(22px); }
/* Modals */
.modal {
position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s;
}
.modal.active { opacity: 1; pointer-events: all; }
.modal-content {
background: white; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; padding: 30px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}
.settings-section { margin-bottom: 20px; }
.settings-section h3 { color: var(--dark-blue); border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 15px; }
/* Table */
table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9rem; }
th, td { padding: 12px; text-align: right; border-bottom: 1px solid #eee; }
th { background: var(--light-blue); color: var(--dark-blue); position: sticky; top: 0; }
.hidden { display: none !important; }
.fade-in { animation: fadeIn 0.6s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
/* Strategies Footer */
#strategiesFooter {
margin-top: 30px;
padding: 25px;
}
.strategies-container {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 25px;
margin-top: 20px;
}
.strategy-card {
background: var(--light-blue);
padding: 20px;
border-radius: 12px;
border-left: 4px solid var(--dark-blue);
transition: transform 0.3s ease;
}
.strategy-card:hover {
transform: translateY(-3px);
box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}
.strategy-card h3 {
color: var(--dark-blue);
margin-bottom: 10px;
font-size: 1.2rem;
display: flex;
align-items: center;
gap: 10px;
}
.strategy-card h3::before {
content: "✓";
color: var(--green);
font-weight: bold;
font-size: 1.1rem;
}
.strategy-card p {
color: var(--text-muted);
line-height: 1.6;
font-size: 0.95rem;
}
.strategy-badge {
display: inline-block;
background: rgba(10, 46, 90, 0.1);
color: var(--dark-blue);
padding: 3px 8px;
border-radius: 4px;
font-size: 0.8rem;
margin-top: 8px;
}
/* Heatmap Legend */
.heatmap-legend {
display: flex;
justify-content: center;
gap: 15px;
margin: 20px 0;
padding: 15px;
background: var(--light-blue);
border-radius: 12px;
}
.legend-item {
display: flex;
flex-direction: column;
align-items: center;
min-width: 80px;
}
.legend-color {
width: 40px;
height: 20px;
border-radius: 4px;
margin-bottom: 5px;
}
.legend-label {
font-size: 0.85rem;
color: var(--text-muted);
font-weight: 500;
}
.heat-very-high { background-color: var(--very-high); }
.heat-high { background-color: var(--high); }
.heat-medium { background-color: var(--medium); }
.heat-neutral { background-color: #f8f9fa; border: 1px solid #eee; }
/* Responsive */
@media (max-width: 768px) {
.form-grid { grid-template-columns: 1fr; }
.room-type-row { grid-template-columns: 1fr 1fr auto; }
.room-types-grid { grid-template-columns: 1fr; }
.strategies-container { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<div class="container">
<header>
<h1>SmartHotel AI</h1>
<p style="color: var(--gray);">نظام إدارة الإيرادات الذكي</p>
</header>
<div class="glass-panel fade-in">
<h2 style="margin-bottom: 20px; color: var(--dark-blue);">📄 بيانات الفندق الأساسية</h2>
<form id="hotelForm">
<div class="form-grid">
<div class="form-group"><label>اسم الفندق</label><input type="text" id="hotelName" value="فندق الحرم 2026"></div>
<div class="form-group"><label>المنطقة / المحافظة</label>
<select id="provinceSelect">
    <option value="" disabled selected>جاري تحميل المناطق...</option>
</select>
</div>
<div class="form-group"><label>إجمالي الغرف</label><input type="number" id="totalRooms" value="150"></div>
<div class="form-group"><label>غرف مطلة</label><input type="number" id="viewRooms" value="45"></div>
<div class="form-group"><label>السعر الأساسي (ريال)</label><input type="number" id="basePrice" value="450"></div>
<div class="form-group"><label>الإيجار السنوي</label><input type="number" id="annualRent" value="6000000"></div>
<div class="form-group"><label>هامش الربح الحالي %</label><input type="number" id="currentProfitMargin" value="12"></div>
</div>
<h3 style="margin: 20px 0 10px; font-size: 1rem; color: var(--dark-blue);">أنواع الغرف</h3>
<div id="roomTypesContainer">
<div class="room-type-row">
<input type="text" class="rt-name" value="غرفة مزدوجة" placeholder="النوع">
<input type="number" class="rt-count" value="100" placeholder="العدد">
<button type="button" class="btn btn-danger remove-rt">×</button>
</div>
<div class="room-type-row">
<input type="text" class="rt-name" value="جناح ملكي" placeholder="النوع">
<input type="number" class="rt-count" value="50" placeholder="العدد">
<button type="button" class="btn btn-danger remove-rt">×</button>
</div>
</div>
<button type="button" class="btn btn-success" id="addRoomBtn">+ إضافة نوع</button>
<button type="submit" class="btn btn-primary" id="analyzeBtn">تحليل البيانات وجلب أحداث المنطقة</button>
</form>
</div>

<div class="glass-panel room-summary-panel fade-in" id="roomSummaryPanel">
<h2 style="margin-bottom: 20px; color: var(--dark-blue);">🏨 توزيع الغرف في الفندق</h2>
<div class="room-types-grid" id="roomTypesSummary"></div>
</div>

<div id="resultsArea" class="hidden fade-in">
<div class="dashboard-grid">
<div class="stat-card">
<div class="stat-label">الإيراد السنوي المتوقع</div>
<div class="stat-value" id="totalRevenueDisplay">0</div>
<div class="profit-badge" id="revBoostBadge" style="background:#e0f2fe; color:var(--dark-blue)"></div>
</div>
<div class="stat-card">
<div class="stat-label">صافي الربح</div>
<div class="stat-value" style="color: var(--green);" id="netProfitDisplay">0</div>
</div>
<div class="stat-card">
<div class="stat-label">هامش الربح الجديد</div>
<div class="stat-value" id="newMarginDisplay">0%</div>
<div class="profit-badge" id="marginImprovement"></div>
</div>
<div class="stat-card">
<div class="stat-label">معدل الإشغال السنوي</div>
<div class="stat-value" id="occupancyDisplay">0%</div>
<div class="stat-label" style="font-size:0.8rem; color:var(--orange)">محسن بواسطة Min Stay AI</div>
</div>
</div>
<div class="heatmap-legend">
<div class="legend-item">
<div class="legend-color heat-very-high"></div>
<span class="legend-label">ذروة عالية جداً</span>
</div>
<div class="legend-item">
<div class="legend-color heat-high"></div>
<span class="legend-label">ذروة عالية</span>
</div>
<div class="legend-item">
<div class="legend-color heat-medium"></div>
<span class="legend-label">ذروة متوسطة</span>
</div>
<div class="legend-item">
<div class="legend-color heat-neutral"></div>
<span class="legend-label">عادي</span>
</div>
</div>
<div style="text-align: left; margin: 20px 0;">
<button class="btn btn-success" id="exportBtn" style="width: auto;">📥 تصدير Excel شامل</button>
</div>
<div class="month-grid" id="calendarGrid"></div>
</div>
<div id="strategiesFooter" class="glass-panel hidden fade-in">
<h2 style="margin-bottom: 20px; color: var(--dark-blue); display: flex; align-items: center; gap: 10px;">
<span>📊 الاستراتيجيات المطبقة</span>
<span class="strategy-badge">مُحسّن بواسطة الذكاء الاصطناعي</span>
</h2>
<div class="strategies-container" id="strategiesContainer"></div>
</div>
</div>
<div class="settings-fab" onclick="openSettings()">⚙️</div>
<div class="modal" id="settingsModal">
<div class="modal-content">
<div style="display:flex; justify-content:space-between; margin-bottom:20px;">
<h2 style="color:var(--dark-blue)">⚙️ إعدادات الاستراتيجيات الذكية</h2>
<button class="btn btn-danger" onclick="closeModal('settingsModal')">×</button>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
<div class="settings-section">
<h3>1. استراتيجيات التسعير (Pricing)</h3>
<div class="switch-container">
<div>
<strong>الحجز المبكر (Early Booking)</strong>
<div style="font-size:0.8rem; color:#777">زيادة الأسعار في رمضان/حج بنسبة 35-45%</div>
</div>
<label class="switch"><input type="checkbox" id="st_early" checked><span class="slider"></span></label>
</div>
<div class="switch-container">
<div>
<strong>التسعير الديناميكي (Dynamic)</strong>
<div style="font-size:0.8rem; color:#777">تعديل يومي + Premium Events (يوم التأسيس/الوطني)</div>
</div>
<label class="switch"><input type="checkbox" id="st_dynamic" checked><span class="slider"></span></label>
</div>
<div class="switch-container">
<div>
<strong>تسعير الأحداث (Event-Specific)</strong>
<div style="font-size:0.8rem; color:#777">زيادة 40% للأحداث الكبرى (فورمولا/مؤتمرات)</div>
</div>
<label class="switch"><input type="checkbox" id="st_event" checked><span class="slider"></span></label>
</div>
</div>
<div class="settings-section">
<h3>2. تعظيم الإيرادات (Boosters)</h3>
<div class="switch-container">
<div>
<strong>حزم الترقية (Upselling)</strong>
<div style="font-size:0.8rem; color:#777">إضافة وجبات/نقل (+6% ADR)</div>
</div>
<label class="switch"><input type="checkbox" id="st_upsell" checked><span class="slider"></span></label>
</div>
<div class="switch-container">
<div>
<strong>حزم الشركات (Corporate)</strong>
<div style="font-size:0.8rem; color:#777">عروض المؤتمرات والمعارض (+20%)</div>
</div>
<label class="switch"><input type="checkbox" id="st_corp" checked><span class="slider"></span></label>
</div>
<div class="switch-container">
<div>
<strong>الحد الأدنى للإقامة (Min Stay)</strong>
<div style="font-size:0.8rem; color:#777">فرض ليلتين في الذروة (استقرار الإشغال)</div>
</div>
<label class="switch"><input type="checkbox" id="st_minstay" checked><span class="slider"></span></label>
</div>
</div>
</div>
<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
<h3>3. مضاعفات المواسم</h3>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
<div class="form-group">
<label>_ramadan_multiplier">Ramadan (Default: 250%)</label>
<input type="number" id="ramadan_multiplier" value="250" min="100" max="1000" step="10">
</div>
<div class="form-group">
<label>last_10_multiplier">Last 10 Days (Default: 400%)</label>
<input type="number" id="last_10_multiplier" value="400" min="100" max="1000" step="10">
</div>
<div class="form-group">
<label>hajj_multiplier">Hajj Season (Default: 450%)</label>
<input type="number" id="hajj_multiplier" value="450" min="100" max="1000" step="10">
</div>
<div class="form-group">
<label>weekend_multiplier">Weekend Boost (Default: 130%)</label>
<input type="number" id="weekend_multiplier" value="130" min="100" max="300" step="5">
</div>
</div>
</div>
</div>
<div style="text-align: center; margin-top: 30px;">
<button class="btn btn-primary" onclick="saveSettings()">💾 حفظ الإعدادات</button>
</div>
</div>
</div>
<script>
// Main application data structure
let appData = {
    hotelInfo: {},
    provinces: [],
    calendarData: [],
    strategies: {
        st_early: true,
        st_dynamic: true,
        st_event: true,
        st_upsell: true,
        st_corp: true,
        st_minstay: true,
        ramadan_multiplier: 250,
        last_10_multiplier: 400,
        hajj_multiplier: 450,
        weekend_multiplier: 130
    },
    events: []
};

// Province data with events
const saudiProvinces = [
    {
        name: "مكة المكرمة",
        seasonDates: {
            ramadan: { start: new Date(new Date().getFullYear(), 3, 10), end: new Date(new Date().getFullYear(), 4, 9) }, // April 10 - May 9
            hajj: { start: new Date(new Date().getFullYear(), 7, 5), end: new Date(new Date().getFullYear(), 7, 15) }, // August 5-15
            last10: { start: new Date(new Date().getFullYear(), 7, 16), end: new Date(new Date().getFullYear(), 7, 25) } // August 16-25
        },
        events: [
            { date: new Date(new Date().getFullYear(), 8, 23), name: "يوم الوطن", type: "national" },
            { date: new Date(new Date().getFullYear(), 1, 22), name: "يوم التأسيس", type: "national" }
        ]
    },
    {
        name: "المدينة المنورة",
        seasonDates: {
            ramadan: { start: new Date(new Date().getFullYear(), 3, 10), end: new Date(new Date().getFullYear(), 4, 9) }, // April 10 - May 9
            hajj: { start: new Date(new Date().getFullYear(), 7, 5), end: new Date(new Date().getFullYear(), 7, 15) }, // August 5-15
            last10: { start: new Date(new Date().getFullYear(), 7, 16), end: new Date(new Date().getFullYear(), 7, 25) } // August 16-25
        },
        events: [
            { date: new Date(new Date().getFullYear(), 8, 23), name: "يوم الوطن", type: "national" },
            { date: new Date(new Date().getFullYear(), 1, 22), name: "يوم التأسيس", type: "national" }
        ]
    },
    {
        name: "الرياض",
        seasonDates: {},
        events: [
            { date: new Date(new Date().getFullYear(), 8, 23), name: "يوم الوطن", type: "national" },
            { date: new Date(new Date().getFullYear(), 1, 22), name: "يوم التأسيس", type: "national" },
            { date: new Date(new Date().getFullYear(), 3, 20), name: "مهرجان الرياض", type: "event" },
            { date: new Date(new Date().getFullYear(), 9, 15), name: "منتدى الرياض الاقتصادي", type: "event" }
        ]
    },
    {
        name: "جدة",
        seasonDates: {},
        events: [
            { date: new Date(new Date().getFullYear(), 8, 23), name: "يوم الوطن", type: "national" },
            { date: new Date(new Date().getFullYear(), 1, 22), name: "يوم التأسيس", type: "national" },
            { date: new Date(new Date().getFullYear(), 5, 10), name: "مهرجان البحر الأحمر", type: "event" },
            { date: new Date(new Date().getFullYear(), 8, 5), name: "Formula E جدة", type: "event" }
        ]
    },
    {
        name: "الدمام",
        seasonDates: {},
        events: [
            { date: new Date(new Date().getFullYear(), 8, 23), name: "يوم الوطن", type: "national" },
            { date: new Date(new Date().getFullYear(), 1, 22), name: "يوم التأسيس", type: "national" },
            { date: new Date(new Date().getFullYear(), 9, 20), name: "معرض الشرق الأوسط للسياحة", type: "event" }
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    populateProvinceSelect();
    setupEventListeners();
    loadSettings();
}

function populateProvinceSelect() {
    const select = document.getElementById('provinceSelect');
    select.innerHTML = '<option value="" disabled selected>اختر المنطقة</option>';
    
    saudiProvinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('hotelForm').addEventListener('submit', analyzeData);
    document.getElementById('addRoomBtn').addEventListener('click', addRoomTypeRow);
    document.getElementById('roomTypesContainer').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-rt')) {
            removeRoomTypeRow(e.target);
        }
    });
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    
    // Add event listener for the settings modal close buttons
    document.querySelectorAll('.btn-danger').forEach(button => {
        if (button.textContent === '×') {
            button.addEventListener('click', function() {
                closeModal('settingsModal');
            });
        }
    });
}

function addRoomTypeRow() {
    const container = document.getElementById('roomTypesContainer');
    const newRow = document.createElement('div');
    newRow.className = 'room-type-row';
    newRow.innerHTML = `
        <input type="text" class="rt-name" placeholder="نوع الغرفة">
        <input type="number" class="rt-count" placeholder="العدد" value="10">
        <button type="button" class="btn btn-danger remove-rt">×</button>
    `;
    container.appendChild(newRow);
}

function removeRoomTypeRow(button) {
    const row = button.closest('.room-type-row');
    row.remove();
}

function analyzeData(e) {
    e.preventDefault();
    
    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.classList.add('btn-loading');
    analyzeBtn.textContent = 'جاري التحليل...';
    
    // Get form data
    appData.hotelInfo = {
        name: document.getElementById('hotelName').value || 'فندقي',
        province: document.getElementById('provinceSelect').value,
        totalRooms: parseInt(document.getElementById('totalRooms').value) || 0,
        viewRooms: parseInt(document.getElementById('viewRooms').value) || 0,
        basePrice: parseInt(document.getElementById('basePrice').value) || 0,
        annualRent: parseInt(document.getElementById('annualRent').value) || 0,
        currentProfitMargin: parseFloat(document.getElementById('currentProfitMargin').value) || 0
    };
    
    // Get room types
    appData.hotelInfo.roomTypes = [];
    document.querySelectorAll('#roomTypesContainer .room-type-row').forEach(row => {
        const nameInput = row.querySelector('.rt-name');
        const countInput = row.querySelector('.rt-count');
        if (nameInput.value && countInput.value) {
            appData.hotelInfo.roomTypes.push({
                name: nameInput.value,
                count: parseInt(countInput.value)
            });
        }
    });
    
    // Validate inputs
    if (!appData.hotelInfo.province) {
        alert('الرجاء اختيار المنطقة');
        analyzeBtn.classList.remove('btn-loading');
        analyzeBtn.textContent = 'تحليل البيانات وجلب أحداث المنطقة';
        return;
    }
    
    if (appData.hotelInfo.totalRooms <= 0) {
        alert('الرجاء إدخال عدد الغرف');
        analyzeBtn.classList.remove('btn-loading');
        analyzeBtn.textContent = 'تحليل البيانات وجلب أحداث المنطقة';
        return;
    }
    
    // Find selected province data
    const selectedProvince = saudiProvinces.find(p => p.name === appData.hotelInfo.province);
    if (selectedProvince) {
        appData.events = selectedProvince.events || [];
        
        // Add seasonal dates if they exist
        if (selectedProvince.seasonDates) {
            // We'll use these dates in the calendar generation
        }
    }
    
    // Calculate room distribution summary
    calculateRoomDistribution();
    
    // Simulate processing delay for better UX
    setTimeout(() => {
        generateCalendar();
        calculateFinancials();
        showStrategiesApplied();
        
        // Show results
        document.getElementById('resultsArea').classList.remove('hidden');
        document.getElementById('strategiesFooter').classList.remove('hidden');
        
        // Scroll to results
        document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth' });
        
        // Reset button
        analyzeBtn.classList.remove('btn-loading');
        analyzeBtn.textContent = 'تحليل البيانات وجلب أحداث المنطقة';
    }, 1500);
}

function calculateRoomDistribution() {
    const roomTypes = appData.hotelInfo.roomTypes;
    const totalRooms = roomTypes.reduce((sum, rt) => sum + rt.count, 0);
    
    // Update room summary panel
    const summaryContainer = document.getElementById('roomTypesSummary');
    summaryContainer.innerHTML = '';
    
    roomTypes.forEach(roomType => {
        const percentage = ((roomType.count / totalRooms) * 100).toFixed(1);
        const card = document.createElement('div');
        card.className = 'room-type-card';
        card.innerHTML = `
            <div class="room-type-name">${roomType.name}</div>
            <div class="room-type-count">${roomType.count}</div>
            <div class="room-type-percent">${percentage}%</div>
        `;
        summaryContainer.appendChild(card);
    });
    
    // Show the summary panel
    document.getElementById('roomSummaryPanel').style.display = 'block';
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    const today = new Date();
    const year = today.getFullYear();
    
    // Generate 12 months
    for (let month = 0; month < 12; month++) {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        
        // Month header
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        monthHeader.innerHTML = `
            <span>${monthNames[month]} ${year}</span>
            <span>▼</span>
        `;
        monthHeader.addEventListener('click', function() {
            const daysContainer = this.nextElementSibling;
            daysContainer.style.display = daysContainer.style.display === 'none' ? 'grid' : 'grid';
        });
        
        // Days container
        const daysContainer = document.createElement('div');
        daysContainer.className = 'days-container';
        
        // Create day cells
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            daysContainer.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            
            // Determine heatmap class based on date
            const currentDate = new Date(year, month, day);
            dayCell.className += ' ' + getHeatmapClass(currentDate, month, day);
            
            daysContainer.appendChild(dayCell);
        }
        
        monthCard.appendChild(monthHeader);
        monthCard.appendChild(daysContainer);
        calendarGrid.appendChild(monthCard);
    }
}

function getHeatmapClass(date, month, day) {
    // Find the selected province to get its season dates
    const selectedProvince = saudiProvinces.find(p => p.name === appData.hotelInfo.province);
    
    if (selectedProvince && selectedProvince.seasonDates) {
        const { ramadan, hajj, last10 } = selectedProvince.seasonDates;
        
        // Check if date falls within special seasons
        if (isDateInRange(date, ramadan)) {
            return 'heat-high';
        } else if (isDateInRange(date, hajj)) {
            return 'heat-very-high';
        } else if (isDateInRange(date, last10)) {
            return 'heat-very-high';
        }
    }
    
    // Check for weekends (Thursday and Friday for Saudi Arabia)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 4 || dayOfWeek === 5) { // Thursday or Friday
        return 'heat-medium';
    }
    
    // Check for national events
    if (selectedProvince && selectedProvince.events) {
        for (const event of selectedProvince.events) {
            if (event.date.getDate() === day && event.date.getMonth() === month) {
                if (event.type === 'national') {
                    return 'heat-high';
                } else {
                    return 'heat-medium';
                }
            }
        }
    }
    
    // Default - neutral
    return 'heat-neutral';
}

function isDateInRange(date, range) {
    if (!range || !range.start || !range.end) return false;
    return date >= range.start && date <= range.end;
}

function calculateFinancials() {
    // Base calculations
    const info = appData.hotelInfo;
    const totalRooms = info.totalRooms;
    const basePrice = info.basePrice;
    const annualRent = info.annualRent;
    
    // Calculate occupancy rate based on heatmap
    let totalPotentialRevenue = 0;
    let actualRevenue = 0;
    let occupiedDays = 0;
    const daysInYear = 365;
    
    for (let month = 0; month < 12; month++) {
        const lastDay = new Date(new Date().getFullYear(), month + 1, 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(new Date().getFullYear(), month, day);
            const heatmapClass = getHeatmapClass(date, month, day);
            
            // Define multiplier based on heatmap class
            let multiplier = 1.0;
            if (heatmapClass.includes('very-high')) {
                multiplier = appData.strategies.very_high_multiplier / 100 || 4.0;
            } else if (heatmapClass.includes('high')) {
                multiplier = appData.strategies.high_multiplier / 100 || 2.5;
            } else if (heatmapClass.includes('medium')) {
                multiplier = appData.strategies.medium_multiplier / 100 || 1.8;
            }
            
            // Apply strategy multipliers
            if (appData.strategies.st_early && isRamadanOrHajj(date)) {
                multiplier *= (appData.strategies.ramadan_multiplier || 250) / 100;
            }
            
            if (appData.strategies.st_dynamic && isWeekend(date)) {
                multiplier *= (appData.strategies.weekend_multiplier || 130) / 100;
            }
            
            // Calculate daily revenue
            const dailyRate = basePrice * multiplier;
            const occupancyFactor = getOccupancyFactor(heatmapClass);
            
            totalPotentialRevenue += basePrice * totalRooms;
            actualRevenue += dailyRate * totalRooms * occupancyFactor;
            if (occupancyFactor > 0.3) occupiedDays++; // Count as occupied if occupancy > 30%
        }
    }
    
    // Calculate annual metrics
    const occupancyRate = (occupiedDays / daysInYear) * 100;
    const netProfit = actualRevenue - annualRent;
    const profitMargin = (netProfit / actualRevenue) * 100;
    
    // Update UI
    document.getElementById('totalRevenueDisplay').textContent = formatNumber(actualRevenue);
    document.getElementById('netProfitDisplay').textContent = formatNumber(netProfit);
    document.getElementById('newMarginDisplay').textContent = profitMargin.toFixed(1) + '%';
    document.getElementById('occupancyDisplay').textContent = occupancyRate.toFixed(1) + '%';
    
    // Calculate improvement over current situation
    const currentAnnualRevenue = info.basePrice * totalRooms * 365 * (info.currentProfitMargin / 100);
    const revenueIncrease = actualRevenue - currentAnnualRevenue;
    const marginImprovement = profitMargin - info.currentProfitMargin;
    
    const revBoostBadge = document.getElementById('revBoostBadge');
    const marginImprovementBadge = document.getElementById('marginImprovement');
    
    if (revenueIncrease > 0) {
        revBoostBadge.innerHTML = `📈 زيادة الإيراد: ${formatNumber(revenueIncrease)} ريال`;
        revBoostBadge.style.background = 'rgba(39, 174, 96, 0.1)';
        revBoostBadge.style.color = 'var(--green)';
    } else {
        revBoostBadge.innerHTML = `📉 انخفاض الإيراد: ${formatNumber(Math.abs(revenueIncrease))} ريال`;
        revBoostBadge.style.background = 'rgba(231, 76, 60, 0.1)';
        revBoostBadge.style.color = 'var(--red)';
    }
    
    if (marginImprovement > 0) {
        marginImprovementBadge.innerHTML = `📈 تحسن الهامش: ${marginImprovement.toFixed(1)}%`;
        marginImprovementBadge.style.background = 'rgba(39, 174, 96, 0.1)';
        marginImprovementBadge.style.color = 'var(--green)';
    } else {
        marginImprovementBadge.innerHTML = `📉 تراجع الهامش: ${Math.abs(marginImprovement).toFixed(1)}%`;
        marginImprovementBadge.style.background = 'rgba(231, 76, 60, 0.1)';
        marginImprovementBadge.style.color = 'var(--red)';
    }
}

function getOccupancyFactor(heatmapClass) {
    if (heatmapClass.includes('very-high')) return 0.95;
    if (heatmapClass.includes('high')) return 0.85;
    if (heatmapClass.includes('medium')) return 0.70;
    return 0.40; // neutral
}

function isRamadanOrHajj(date) {
    const selectedProvince = saudiProvinces.find(p => p.name === appData.hotelInfo.province);
    if (selectedProvince && selectedProvince.seasonDates) {
        const { ramadan, hajj, last10 } = selectedProvince.seasonDates;
        return isDateInRange(date, ramadan) || isDateInRange(date, hajj) || isDateInRange(date, last10);
    }
    return false;
}

function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 4 || dayOfWeek === 5; // Thursday or Friday
}

function formatNumber(num) {
    return num.toLocaleString('ar-SA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function showStrategiesApplied() {
    const container = document.getElementById('strategiesContainer');
    container.innerHTML = '';
    
    // Define strategies with descriptions
    const strategies = [
        {
            title: "الحجز المبكر (Early Booking)",
            description: "زيادة الأسعار في رمضان/الحج بنسبة 35-45% لتشجيع الحجز المبكر وتحقيق استقرار في التدفق النقدي.",
            enabled: appData.strategies.st_early
        },
        {
            title: "التسعير الديناميكي (Dynamic)",
            description: "تعديل يومي للأسعار بناءً على الطلب والعرض، مع مراعاة الأحداث الخاصة مثل يوم التأسيس والوطني.",
            enabled: appData.strategies.st_dynamic
        },
        {
            title: "تسعير الأحداث (Event-Specific)",
            description: "زيادة الأسعار بنسبة 40% خلال الأحداث الكبرى مثل الفورمولا والمؤتمرات والمعارض.",
            enabled: appData.strategies.st_event
        },
        {
            title: "حزم الترقية (Upselling)",
            description: "إضافة خدمات مثل وجبات ونقل بقيمة +6% من متوسط سعر الغرفة لزيادة الإيراد لكل غرفة.",
            enabled: appData.strategies.st_upsell
        },
        {
            title: "حزم الشركات (Corporate)",
            description: "عروض خاصة للمؤتمرات والمعارض تزيد الإيراد بنسبة 20% مقارنة بالحجز الفردي.",
            enabled: appData.strategies.st_corp
        },
        {
            title: "الحد الأدنى للإقامة (Min Stay)",
            description: "فرض ليلتين على الأقل في فترات الذروة لضمان استقرار الإشغال وتحقيق أرباح أفضل.",
            enabled: appData.strategies.st_minstay
        }
    ];
    
    strategies.forEach(strategy => {
        if (strategy.enabled) {
            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.innerHTML = `
                <h3>${strategy.title}</h3>
                <p>${strategy.description}</p>
                <span class="strategy-badge">مفعل</span>
            `;
            container.appendChild(card);
        }
    });
}

function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function saveSettings() {
    // Save all strategy toggles
    Object.keys(appData.strategies).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                appData.strategies[key] = element.checked;
            } else if (element.type === 'number') {
                appData.strategies[key] = parseFloat(element.value);
            }
        }
    });
    
    // Show confirmation
    alert('تم حفظ الإعدادات بنجاح');
    
    // Close modal
    closeModal('settingsModal');
    
    // Re-run analysis if results are visible
    if (!document.getElementById('resultsArea').classList.contains('hidden')) {
        analyzeData(new Event('submit')); // Re-trigger analysis with new settings
    }
}

function loadSettings() {
    // Load all strategy toggles
    Object.keys(appData.strategies).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = appData.strategies[key];
            } else if (element.type === 'number') {
                element.value = appData.strategies[key];
            }
        }
    });
}

function exportToExcel() {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // 1. Summary sheet
    const summaryData = [
        ['العنصر', 'القيمة'],
        ['اسم الفندق', appData.hotelInfo.name],
        ['المنطقة', appData.hotelInfo.province],
        ['إجمالي الغرف', appData.hotelInfo.totalRooms],
        ['غرف مطلة', appData.hotelInfo.viewRooms],
        ['السعر الأساسي', appData.hotelInfo.basePrice],
        ['الإيراد السنوي المتوقع', document.getElementById('totalRevenueDisplay').textContent],
        ['صافي الربح', document.getElementById('netProfitDisplay').textContent],
        ['هامش الربح الجديد', document.getElementById('newMarginDisplay').textContent],
        ['معدل الإشغال السنوي', document.getElementById('occupancyDisplay').textContent]
    ];
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'الملخص');
    
    // 2. Room distribution sheet
    const roomData = [['نوع الغرفة', 'العدد', 'النسبة']];
    appData.hotelInfo.roomTypes.forEach(roomType => {
        const totalRooms = appData.hotelInfo.roomTypes.reduce((sum, rt) => sum + rt.count, 0);
        const percentage = ((roomType.count / totalRooms) * 100).toFixed(1);
        roomData.push([roomType.name, roomType.count, `${percentage}%`]);
    });
    const roomWS = XLSX.utils.aoa_to_sheet(roomData);
    XLSX.utils.book_append_sheet(wb, roomWS, 'توزيع الغرف');
    
    // 3. Daily data sheet
    const dailyData = [['التاريخ', 'اليوم', 'نوع الذروة', 'السعر', 'الإشغال', 'الإيراد اليومي']];
    const year = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(year, month, day);
            const dayCell = document.querySelector(`.day-cell:contains('${day}')`);
            const heatmapClass = dayCell ? dayCell.className : 'heat-neutral';
            const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const dayName = dayNames[date.getDay()];
            
            // Calculate daily metrics
            const baseDailyRevenue = appData.hotelInfo.basePrice * appData.hotelInfo.totalRooms;
            let multiplier = 1.0;
            if (heatmapClass.includes('very-high')) multiplier = 4.0;
            else if (heatmapClass.includes('high')) multiplier = 2.5;
            else if (heatmapClass.includes('medium')) multiplier = 1.8;
            else multiplier = 1.0;
            
            const dailyRevenue = baseDailyRevenue * multiplier;
            const occupancyFactor = getOccupancyFactor(heatmapClass);
            
            dailyData.push([
                `${day} ${monthNames[month]}`, 
                dayName, 
                getHeatmapLabel(heatmapClass),
                (appData.hotelInfo.basePrice * multiplier).toFixed(0),
                (occupancyFactor * 100).toFixed(0) + '%',
                dailyRevenue.toFixed(0)
            ]);
        }
    }
    const dailyWS = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(wb, dailyWS, 'البيانات اليومية');
    
    // 4. Room types daily performance
    const roomDailyData = [['نوع الغرفة', 'التاريخ', 'السعر', 'الإشغال', 'عدد الغرف', 'الإيراد']];
    appData.hotelInfo.roomTypes.forEach(roomType => {
        for (let month = 0; month < 12; month++) {
            const lastDay = new Date(year, month + 1, 0).getDate();
            const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
            for (let day = 1; day <= lastDay; day++) {
                const date = new Date(year, month, day);
                
                // Calculate metrics for this room type on this day
                const baseDailyRevenue = appData.hotelInfo.basePrice * roomType.count;
                let multiplier = 1.0;
                const heatmapClass = getHeatmapClass(date, month, day);
                
                if (heatmapClass.includes('very-high')) multiplier = 4.0;
                else if (heatmapClass.includes('high')) multiplier = 2.5;
                else if (heatmapClass.includes('medium')) multiplier = 1.8;
                else multiplier = 1.0;
                
                const dailyRevenue = baseDailyRevenue * multiplier;
                const occupancyFactor = getOccupancyFactor(heatmapClass);
                
                roomDailyData.push([
                    roomType.name,
                    `${day} ${monthNames[month]}`,
                    (appData.hotelInfo.basePrice * multiplier).toFixed(0),
                    (occupancyFactor * 100).toFixed(0) + '%',
                    roomType.count,
                    dailyRevenue.toFixed(0)
                ]);
            }
        }
    });
    const roomDailyWS = XLSX.utils.aoa_to_sheet(roomDailyData);
    XLSX.utils.book_append_sheet(wb, roomDailyWS, 'تفاصيل الغرف اليومية');
    
    // Export file
    XLSX.writeFile(wb, `${appData.hotelInfo.name}_تقرير_التحليل.xlsx`);
}

function getHeatmapLabel(heatmapClass) {
    if (heatmapClass.includes('very-high')) return 'ذروة عالية جداً';
    if (heatmapClass.includes('high')) return 'ذروة عالية';
    if (heatmapClass.includes('medium')) return 'ذروة متوسطة';
    return 'عادي';
}

// Helper function to select elements by text content (for export function)
const originalContains = window.Element.prototype.contains;
window.Element.prototype.originalContains = originalContains;
window.Element.prototype.contains = function(text) {
    if (typeof text === 'string') {
        return this.textContent.includes(text);
    }
    return this.originalContains(text);
};
</script>
</body>
</html>
