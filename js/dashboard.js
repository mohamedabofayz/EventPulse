// --- Configuration & State ---
// >>> ضع رابط الـ Webhook الخاص بك هنا <<<
const GAS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzBTVYM8eOSXNsbF2HDnOkdwKKdLuF_K9Df4Egn0BvgRRcc212HlUHONg_FlIn7Mw1v/exec";

const state = {
    hotelInfo: {},
    roomTypes: [],
    yearlyData: [],
    fetchedEvents: [], // يتم تعبئتها من الـ Webhook
    strategies: {
        earlyBooking: true,
        dynamicPricing: true,
        eventPricing: true,
        upselling: true,
        corporate: false,
        minStay: true
    },
    multipliers: {
        ramadan: 2.5,
        lastTen: 4.0,
        hajj: 4.5,
        weekend: 1.3
    },
    priceChart: null, // Global chart instance
    chartView: 'daily' // 'daily' or 'monthly'
};
// Strategy information mapping
const strategyInfo = {
    earlyBooking: {
        name: "الحجز المبكر",
        desc: "زيادة الأسعار بنسبة 35-45% في مواسم الذروة (رمضان، الحج) لتحفيز الحجوزات المبكرة وزيادة الإيرادات. يطبق تلقائياً عند اكتشاف مواسم الذروة."
    },
    dynamicPricing: {
        name: "التسعير الديناميكي",
        desc: "تعديل الأسعار يومياً بناءً على العرض والطلب مع زيادات خاصة للأحداث الوطنية (يوم التأسيس، اليوم الوطني). يستخدم خوارزميات التعلم الآلي للتنبؤ بالطلب."
    },
    eventPricing: {
        name: "تسعير الأحداث",
        desc: "زيادة الأسعار بنسبة 40% خلال الفعاليات الكبرى (فورمولا 1، المؤتمرات الدولية) لتحقيق أقصى ربح من المناسبات الخاصة. يتضمن كشف تلقائي للأحداث."
    },
    upselling: {
        name: "حزم الترقية",
        desc: "عرض خدمات إضافية (وجبات فاخرة، نقل خاص) لزيادة متوسط سعر الغرفة اليومي (ADR) بنسبة 6%. يظهر لضيوف الحجز المبكر كخيارات إضافية."
    },
    corporate: {
        name: "عروض الشركات",
        desc: "خصومات مميزة للشركات والفعاليات (مثل المعارض) لزيادة الإشغال في المواسم المنخفضة. يشمل عقوداً سنوية بمرونة في الأسعار."
    },
    minStay: {
        name: "الحد الأدنى للإقامة",
        desc: "فرض إقامة ليلتين على الأقل في مواسم الذروة لتحسين استقرار الإشغال وزيادة الإيرادات. يمنع الحجوزات القصيرة التي تقلل الربحية."
    }
};
const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
// Key Dates for 2026 (Approximate)
const events2026 = {
    foundingDay: new Date(2026, 1, 22), // Feb 22
    nationalDay: new Date(2026, 8, 23), // Sep 23
    ramadanStart: new Date(2026, 1, 18),
    lastTenStart: new Date(2026, 2, 9),
    ramadanEnd: new Date(2026, 2, 19),
    hajjStart: new Date(2026, 4, 15),
    hajjEnd: new Date(2026, 4, 25),
    // Adding specific prompt events adapted for simulation
    summerFest: { start: new Date(2026, 6, 1), end: new Date(2026, 7, 30) }, // July-Aug
    corporateSeason: { start: new Date(2026, 9, 1), end: new Date(2026, 9, 15) } // Oct (Construct Expo equivalent)
};
// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    fetchProvincesFromGAS(); // جلب المحافظات عند التحميل
});

document.getElementById('addRoomBtn').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'room-type-row';
    div.innerHTML = `<input type="text" class="rt-name" placeholder="النوع"><input type="number" class="rt-count" placeholder="العدد"><button type="button" class="btn btn-danger remove-rt">×</button>`;
    document.getElementById('roomTypesContainer').appendChild(div);
});
document.getElementById('roomTypesContainer').addEventListener('click', e => {
    if (e.target.classList.contains('remove-rt')) e.target.parentElement.remove();
});
document.getElementById('hotelForm').addEventListener('submit', async e => {
    e.preventDefault();
    await handleAnalysis(); // Changed to Async Handler
});
document.getElementById('exportBtn').addEventListener('click', exportExcel);
function openSettings() { document.getElementById('settingsModal').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function applySettings() {
    // Update Strategies from Toggle Switches
    state.strategies.earlyBooking = document.getElementById('st_early').checked;
    state.strategies.dynamicPricing = document.getElementById('st_dynamic').checked;
    state.strategies.eventPricing = document.getElementById('st_event').checked;
    state.strategies.upselling = document.getElementById('st_upsell').checked;
    state.strategies.corporate = document.getElementById('st_corp').checked;
    state.strategies.minStay = document.getElementById('st_minstay').checked;
    // Update Multipliers
    state.multipliers.ramadan = Number(document.getElementById('mul_ramadan').value) / 100;
    state.multipliers.lastTen = Number(document.getElementById('mul_last10').value) / 100;
    state.multipliers.hajj = Number(document.getElementById('mul_hajj').value) / 100;
    state.multipliers.weekend = Number(document.getElementById('mul_weekend').value) / 100;
    closeModal('settingsModal');
    runAnalysis(); // Re-run analysis with new settings
}

// --- NEW: Webhook Integration for Provinces & Events ---

// 1. Fetch Provinces List on Load
async function fetchProvincesFromGAS() {
    const provinceSelect = document.getElementById('provinceSelect');

    // إذا لم يكن هناك رابط حقيقي، نستخدم القيم الافتراضية
    if (GAS_WEBHOOK_URL.includes("YOUR_SCRIPT_URL") || GAS_WEBHOOK_URL === "") {
        // الابقاء على الخيارات الموجودة في HTML (الافتراضية)
        return;
    }

    try {
        // إرسال طلب لجلب المحافظات: ?action=getProvinces
        const response = await fetch(`${GAS_WEBHOOK_URL}?action=getProvinces`);
        if (!response.ok) throw new Error("Webhook Error");
        const provinces = await response.json();

        // إذا عادت البيانات كمصفوفة، نقوم بتعبئة القائمة
        if (Array.isArray(provinces) && provinces.length > 0) {
            provinceSelect.innerHTML = ''; // مسح "جاري التحميل"
            provinces.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p; // القيمة المرسلة
                opt.textContent = p; // النص الظاهر
                provinceSelect.appendChild(opt);
            });
        }
    } catch (e) {
        console.warn("Could not fetch provinces from Webhook, using defaults.", e);
        // في حال الفشل، نعيد الخيارات الافتراضية إذا كانت قد مسحت
        if (provinceSelect.options.length <= 1) {
            provinceSelect.innerHTML = `
                <option value="Makkah">مكة المكرمة</option>
                <option value="Madinah">المدينة المنورة</option>
                <option value="Riyadh">الرياض</option>
                <option value="Eastern">المنطقة الشرقية</option>
                <option value="Asir">عسير</option>
            `;
        }
    }
}

// 2. Main Analysis Handler
async function handleAnalysis() {
    const btn = document.getElementById('analyzeBtn');
    const originalText = btn.textContent;
    btn.textContent = 'جاري الاتصال بالخوادم...';
    btn.classList.add('btn-loading');

    const province = document.getElementById('provinceSelect').value;

    try {
        await fetchProvinceEvents(province);
    } catch (err) {
        console.error("Webhook Error or Offline:", err);
    } finally {
        runAnalysis();
        btn.textContent = originalText;
        btn.classList.remove('btn-loading');
    }
}

// 3. Fetch Events for Selected Province
async function fetchProvinceEvents(province) {
    if (GAS_WEBHOOK_URL.includes("YOUR_SCRIPT_URL")) {
        console.log("No actual Webhook URL provided. Skipping fetch.");
        state.fetchedEvents = simulateEvents(province);
        return;
    }

    try {
        // إرسال طلب لجلب الأحداث: ?action=getEvents&province=X
        const url = `${GAS_WEBHOOK_URL}?action=getEvents&province=${encodeURIComponent(province)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        // المتوقع: [{ name: "Event Name", date: "2026-10-20" }, ...]
        state.fetchedEvents = data;
    } catch (error) {
        console.warn("Using simulation due to fetch error:", error);
        state.fetchedEvents = simulateEvents(province);
    }
}


// --- Core Analysis Logic (UNCHANGED) ---
function runAnalysis() {
    // 1. Get Form Data
    state.hotelInfo = {
        name: document.getElementById('hotelName').value,
        province: document.getElementById('provinceSelect').value, // Store province
        totalRooms: Number(document.getElementById('totalRooms').value),
        viewRooms: Number(document.getElementById('viewRooms').value),
        basePrice: Number(document.getElementById('basePrice').value),
        rent: Number(document.getElementById('annualRent').value),
        currentMargin: Number(document.getElementById('currentProfitMargin').value)
    };
    state.roomTypes = [];
    document.querySelectorAll('.room-type-row').forEach(row => {
        const name = row.querySelector('.rt-name').value;
        const count = Number(row.querySelector('.rt-count').value);
        if (name && count) state.roomTypes.push({ name, count });
    });
    if (state.roomTypes.length === 0) return alert('أضف نوع غرفة واحد على الأقل');
    // 2. Generate Data
    state.yearlyData = generateData();
    // 3. Render Room Summary
    renderRoomSummary();
    // 4. Render Dashboard
    renderDashboard();

    // SPA Toggle: Hide Input, Show Results
    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('results-view').classList.remove('hidden');

    // Ensure logic elements are visible within tabs
    document.getElementById('resultsArea').classList.remove('hidden');
    document.getElementById('strategiesFooter').classList.remove('hidden');
    document.getElementById('roomSummaryPanel').classList.remove('hidden'); // Ensure room summary logic is active

    // Reset to Stats Tab
    switchTab('stats');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderRoomSummary() {
    const container = document.getElementById('roomTypesSummary');
    container.innerHTML = '';
    const totalRooms = state.hotelInfo.totalRooms;
    state.roomTypes.forEach(room => {
        const percentage = Math.round((room.count / totalRooms) * 100);
        const roomCard = document.createElement('div');
        roomCard.className = 'room-type-card';
        roomCard.innerHTML = `
<div class="room-type-name">${room.name}</div>
<div class="room-type-count">${room.count}</div>
<div class="room-type-percent">${percentage}% من إجمالي الغرف</div>
`;
        container.appendChild(roomCard);
    });
}
function generateData() {
    const data = [];
    const viewRatio = state.hotelInfo.viewRooms / state.hotelInfo.totalRooms;
    for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(2026, m + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(2026, m, d);
            const dayOfWeek = date.getDay();
            const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
            let seasonName = "عادي";
            let baseMult = 1.0;
            let activeStrategies = [];
            // --- 1. Base Season Logic ---
            if (date >= events2026.lastTenStart && date <= events2026.ramadanEnd) {
                seasonName = "العشر الأواخر";
                baseMult = state.multipliers.lastTen;
            } else if (date >= events2026.ramadanStart && date <= events2026.ramadanEnd) {
                seasonName = "رمضان";
                baseMult = state.multipliers.ramadan;
            } else if (date >= events2026.hajjStart && date <= events2026.hajjEnd) {
                seasonName = "موسم الحج";
                baseMult = state.multipliers.hajj;
            } else if (isWeekend) {
                seasonName = "نهاية الأسبوع";
                baseMult = state.multipliers.weekend;
            }
            // --- 2. Apply Strategies ---
            // Strategy: Early Booking (Boosts Peak Seasons)
            if (state.strategies.earlyBooking && (seasonName.includes("رمضان") || seasonName.includes("الحج"))) {
                // Logic: Early booking secures higher average rate
                baseMult += 0.35; // +35% impact
                activeStrategies.push("earlyBooking");
            }
            // Strategy: Event Pricing (National Day / Founding Day / fetchedEvents)
            if (state.strategies.eventPricing) {
                if (date.getTime() === events2026.foundingDay.getTime()) {
                    seasonName = "يوم التأسيس";
                    baseMult = Math.max(baseMult, 2.5);
                    activeStrategies.push("eventPricing");
                }
                if (date.getTime() === events2026.nationalDay.getTime()) {
                    seasonName = "اليوم الوطني";
                    baseMult = Math.max(baseMult, 2.5);
                    activeStrategies.push("eventPricing");
                }
                // Check fetched events from Webhook
                if (state.fetchedEvents && state.fetchedEvents.length > 0) {
                    const fetchedMatch = state.fetchedEvents.find(ev => {
                        const evDate = new Date(ev.date);
                        return evDate.getDate() === d && evDate.getMonth() === m && evDate.getFullYear() === 2026;
                    });
                    if (fetchedMatch) {
                        seasonName = fetchedMatch.name;
                        baseMult = Math.max(baseMult, 2.5); // Treat like major event
                        activeStrategies.push("eventPricing");
                    }
                }
            }
            // Strategy: Corporate (October Season)
            if (state.strategies.corporate && date >= events2026.corporateSeason.start && date <= events2026.corporateSeason.end) {
                if (baseMult < 1.5) { // Only boost if not already peak
                    baseMult = 1.3;
                    seasonName = "موسم أعمال";
                    activeStrategies.push("corporate");
                }
            }
            // Strategy: Dynamic Pricing (Summer)
            if (state.strategies.dynamicPricing && date >= events2026.summerFest.start && date <= events2026.summerFest.end) {
                if (baseMult < 1.2) {
                    baseMult = 1.25; // Slight boost for Summer Fest
                    activeStrategies.push("dynamicPricing");
                }
            }
            // --- 3. Calculate Occupancy & Revenue ---
            // Base Occupancy
            let occ = 55; // Standard
            if (baseMult > 2.0) occ = 90;
            else if (baseMult > 1.2) occ = 75;
            // Strategy: Min Stay (Stabilize Occupancy in Peak)
            if (state.strategies.minStay && baseMult > 2.0) {
                occ = 98; // Force near full occupancy
                activeStrategies.push("minStay");
            }
            // Strategy: Upselling (Add Value to Rate)
            let upsellingValue = 0;
            if (state.strategies.upselling) {
                upsellingValue = state.hotelInfo.basePrice * 0.06; // +6% ADR
                activeStrategies.push("upselling");
            }
            // Calculate Rooms
            let dailyTotalRev = 0;
            const roomDetails = state.roomTypes.map((rt, idx) => {
                const typeBase = state.hotelInfo.basePrice * (1 + (idx * 0.4));
                const finalRate = Math.round((typeBase * baseMult) + upsellingValue);
                const viewCount = Math.round(rt.count * viewRatio);
                const stdCount = rt.count - viewCount;
                // View rooms get 30% extra premium
                const viewRate = Math.round(finalRate * 1.3);
                const rev = (stdCount * finalRate * (occ / 100)) + (viewCount * viewRate * (occ / 100));
                dailyTotalRev += rev;
                return { name: rt.name, count: rt.count, rate: finalRate, viewRate: viewRate, rev: rev };
            });
            data.push({
                date: date,
                monthIdx: m,
                day: d,
                season: seasonName,
                mult: baseMult,
                occ: occ,
                strategies: activeStrategies,
                rooms: roomDetails,
                totalRev: Math.round(dailyTotalRev),
                viewRoomsCount: state.hotelInfo.viewRooms // Added fixed view rooms count per day
            });
        }
    }
    return data;
}
function renderDashboard() {
    // Stats
    const totalRev = state.yearlyData.reduce((a, b) => a + b.totalRev, 0);
    const rent = state.hotelInfo.rent;
    const opsCost = totalRev * 0.22; // 22% Ops cost
    const net = totalRev - rent - opsCost;
    const margin = (net / totalRev) * 100;
    document.getElementById('totalRevenueDisplay').textContent = (totalRev / 1000000).toFixed(2) + " مليون ريال";
    document.getElementById('netProfitDisplay').textContent = (net / 1000000).toFixed(2) + " مليون ريال";
    document.getElementById('newMarginDisplay').textContent = margin.toFixed(1) + "%";
    const diff = margin - state.hotelInfo.currentMargin;
    const badge = document.getElementById('marginImprovement');
    badge.textContent = diff > 0 ? `تحسن +${diff.toFixed(1)}%` : `تغير ${diff.toFixed(1)}%`;
    badge.style.color = diff > 0 ? 'var(--green)' : 'var(--red)';
    // Count Active Strategies for Badge
    const activeCount = Object.values(state.strategies).filter(Boolean).length;
    document.getElementById('revBoostBadge').textContent = `تم تفعيل ${activeCount} استراتيجيات ذكية`;
    const avgOcc = state.yearlyData.reduce((a, b) => a + b.occ, 0) / 365;
    document.getElementById('occupancyDisplay').textContent = Math.round(avgOcc) + "%";
    // Calendar
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    monthsAr.forEach((mName, mIdx) => {
        const card = document.createElement('div');
        card.className = 'month-card';
        const header = document.createElement('div');
        header.className = 'month-header';
        header.innerHTML = `<span>${mName}</span><span>👁️</span>`;
        header.onclick = () => showMonthDetails(mIdx);
        const daysDiv = document.createElement('div');
        daysDiv.className = 'days-container';
        const days = state.yearlyData.filter(d => d.monthIdx === mIdx);
        // Spacer for first day
        const firstDay = days[0].date.getDay();
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.style.opacity = '0.3';
            daysDiv.appendChild(empty);
        }
        days.forEach(d => {
            let heatClass = 'heat-neutral';
            if (d.mult > 3.0) heatClass = 'heat-very-high';
            else if (d.mult > 2.0) heatClass = 'heat-high';
            else if (d.mult > 1.2) heatClass = 'heat-medium';
            const cell = document.createElement('div');
            cell.className = `day-cell ${heatClass}`;
            cell.textContent = d.day;
            // Add dot if strategy active
            if (d.strategies.length > 0) {
                const dot = document.createElement('div');
                dot.style.cssText = 'width:5px;height:5px;background:var(--dark-blue);border-radius:50%;position:absolute;bottom:3px;right:3px;';
                cell.appendChild(dot);
            }
            cell.title = `${d.season} | الإيراد: ${d.totalRev.toLocaleString()} ريال | الاستراتيجيات: ${d.strategies.map(s => strategyInfo[s].name).join(', ')}`;
            cell.onclick = (e) => { e.stopPropagation(); showDayDetails(d); };
            daysDiv.appendChild(cell);
        });
        card.appendChild(header);
        card.appendChild(daysDiv);
        grid.appendChild(card);
    });
    // Render Strategies Footer
    renderStrategiesFooter();
    // Render Price Movement Chart
    renderPriceMovementChart();
}
function renderStrategiesFooter() {
    const container = document.getElementById('strategiesContainer');
    container.innerHTML = '';
    const activeStrategies = Object.keys(state.strategies).filter(key => state.strategies[key]);
    if (activeStrategies.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align:center; padding:20px; color:var(--gray);">لم يتم تطبيق أي استراتيجيات. قم بتفعيل الاستراتيجيات من الإعدادات.</p>';
        return;
    }
    activeStrategies.forEach(key => {
        if (strategyInfo[key]) {
            const strat = strategyInfo[key];
            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.innerHTML = `
<h3>${strat.name}</h3>
<p>${strat.desc}</p>
<div class="strategy-badge">مُفعّل</div>
`;
            container.appendChild(card);
        }
    });

    // Update Header Active Strategies List
    const headerList = document.getElementById('activeStrategiesList');
    if (headerList) {
        headerList.innerHTML = '';
        activeStrategies.forEach(key => {
            if (strategyInfo[key]) {
                const badge = document.createElement('span');
                badge.className = 'strategy-badge';
                badge.style.background = 'var(--green)';
                badge.style.color = 'white';
                badge.style.padding = '5px 10px';
                badge.textContent = strategyInfo[key].name;
                headerList.appendChild(badge);
            }
        });
    }
}
function showMonthDetails(mIdx) {
    const days = state.yearlyData.filter(d => d.monthIdx === mIdx);
    document.getElementById('detailsTitle').textContent = `تفاصيل شهر ${monthsAr[mIdx]}`;
    let th = `<tr><th>اليوم</th><th>المناسبة</th><th>الاستراتيجيات</th><th>الإشغال</th><th>الإيراد اليومي</th><th>غرف مطلة</th></tr>`;
    document.getElementById('detailsHead').innerHTML = th;
    let tb = '';
    days.forEach(d => {
        const strategyNames = d.strategies.map(s => strategyInfo[s].name).join(', ') || '-';
        tb += `<tr>
<td>${d.day}</td>
<td>${d.season}</td>
<td style="font-size:0.8rem; color:var(--gray)">${strategyNames}</td>
<td>${d.occ}%</td>
<td style="color:var(--green); font-weight:bold">${d.totalRev.toLocaleString()} ريال</td>
<td>${d.viewRoomsCount}</td>
</tr>`;
    });
    document.getElementById('detailsBody').innerHTML = tb;
    document.getElementById('detailsModal').classList.add('active');
}
function showDayDetails(d) {
    document.getElementById('detailsTitle').textContent = `تفاصيل يوم ${d.day} ${monthsAr[d.monthIdx]}`;
    let th = `<tr><th>نوع الغرفة</th><th>العدد</th><th>السعر العادي</th><th>سعر الإطلالة</th><th>الإيراد</th><th>غرف مطلة</th></tr>`;
    document.getElementById('detailsHead').innerHTML = th;
    let tb = '';
    d.rooms.forEach(r => {
        const viewCount = Math.round(r.count * (state.hotelInfo.viewRooms / state.hotelInfo.totalRooms));
        tb += `<tr>
<td>${r.name}</td>
<td>${r.count} غرفة</td>
<td>${r.rate.toLocaleString()} ريال</td>
<td>${r.viewRate.toLocaleString()} ريال</td>
<td style="color:var(--green); font-weight:bold">${r.rev.toLocaleString()} ريال</td>
<td>${viewCount} غرفة</td>
</tr>`;
    });
    document.getElementById('detailsBody').innerHTML = tb;
    document.getElementById('detailsModal').classList.add('active');
}
function exportExcel() {
    const wb = XLSX.utils.book_new();
    // Summary Sheet
    const summary = [
        ["تقرير استراتيجيات SmartHotel 2026"],
        ["اسم الفندق", state.hotelInfo.name],
        ["المنطقة / المحافظة", state.hotelInfo.province],
        ["الاستراتيجيات المفعلة", Object.keys(state.strategies).filter(k => state.strategies[k]).join(", ")],
        ["إجمالي الغرف", state.hotelInfo.totalRooms],
        ["غرف مطلة", state.hotelInfo.viewRooms],
        ["إجمالي الإيراد", document.getElementById('totalRevenueDisplay').textContent],
        ["صافي الربح", document.getElementById('netProfitDisplay').textContent]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "الملخص");
    // Room Types Sheet
    const roomHeaders = ["نوع الغرفة", "العدد", "النسبة المئوية", "عدد الغرف المطلة"];
    const roomRows = state.roomTypes.map(rt => {
        const viewCount = Math.round(rt.count * (state.hotelInfo.viewRooms / state.hotelInfo.totalRooms));
        return [
            rt.name,
            rt.count,
            ((rt.count / state.hotelInfo.totalRooms) * 100).toFixed(1) + "%",
            viewCount
        ];
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([roomHeaders, ...roomRows]), "توزيع الغرف");
    // Data Sheet
    const headers = ["التاريخ", "المناسبة", "الاستراتيجيات", "نسبة السعر %", "الإشغال %", "عدد الغرف المطلة", "الإيراد اليومي"];
    const rows = state.yearlyData.map(d => [
        `${d.day}/${d.monthIdx + 1}/2026`,
        d.season,
        d.strategies.map(s => strategyInfo[s].name).join(", "),
        (d.mult * 100).toFixed(0) + "%",
        d.occ + "%",
        state.hotelInfo.viewRooms,
        d.totalRev
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), "البيانات اليومية");
    // Daily Room Details Sheet
    const roomDetailsHeaders = ["التاريخ", "نوع الغرفة", "إجمالي الغرف", "غرف عادية", "غرف مطلة", "سعر العادية", "سعر المطلة", "الإيراد"];
    const roomDetailsRows = [];
    state.yearlyData.forEach(d => {
        d.rooms.forEach(r => {
            const viewCount = Math.round(r.count * (state.hotelInfo.viewRooms / state.hotelInfo.totalRooms));
            const stdCount = r.count - viewCount;
            roomDetailsRows.push([
                `${d.day}/${d.monthIdx + 1}/2026`,
                r.name,
                r.count,
                stdCount,
                viewCount,
                r.rate.toLocaleString() + " ريال",
                r.viewRate.toLocaleString() + " ريال",
                r.rev.toLocaleString() + " ريال"
            ]);
        });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([roomDetailsHeaders, ...roomDetailsRows]), "تفاصيل الغرف اليومية");
    XLSX.writeFile(wb, "SmartHotel_Strategies_2026.xlsx");
}

// 4. Simulate Events (Fallback)
function simulateEvents(province) {
    const provinceEvents = [];
    if (province === "Riyadh" || province === "Jeddah") {
        provinceEvents.push({ name: "موسم الرياض/جدة", date: "2026-10-20" });
        provinceEvents.push({ name: "فورمولا 1", date: "2026-12-05" });
    }
    if (province === "Makkah" || province === "Madinah") {
        provinceEvents.push({ name: "ذروة العمرة", date: "2026-03-15" });
    }
    return provinceEvents;
}

// 5. Tab Switcher
function switchTab(tabId) {
    // Hide all tab contents
    document.getElementById('tab-stats').classList.add('hidden');
    document.getElementById('tab-strategies').classList.add('hidden');

    // Deactivate all buttons
    document.getElementById('btn-stats').classList.remove('active');
    document.getElementById('btn-strategies').classList.remove('active');

    // Show selected and activate button
    if (tabId === 'stats') {
        document.getElementById('tab-stats').classList.remove('hidden');
        document.getElementById('btn-stats').classList.add('active');
    } else {
        document.getElementById('tab-strategies').classList.remove('hidden');
        document.getElementById('btn-strategies').classList.add('active');
    }
}

// --- NEW: Chart View Toggler ---
function updateChartView(view) {
    state.chartView = view;

    // Update button active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    renderPriceMovementChart();
}

function renderPriceMovementChart() {
    const ctx = document.getElementById('priceMovementChart').getContext('2d');

    // Helper for Heatmap Colors
    const getHeatColor = (mult) => {
        if (mult > 3.0) return '#e74c3c'; // heat-very-high (Red)
        if (mult > 2.0) return '#f39c12'; // heat-high (Orange)
        if (mult > 1.2) return '#f1c40f'; // heat-medium (Yellow)
        return '#aaa'; // Normal (Gray)
    };

    // Helper to aggregate data for monthly view
    const getMonthlyData = () => {
        const monthly = [];
        for (let m = 0; m < 12; m++) {
            const monthDays = state.yearlyData.filter(d => d.monthIdx === m);
            const avgMult = monthDays.reduce((sum, d) => sum + d.mult, 0) / monthDays.length;

            // For monthly markers: show if any day has an event or strategy
            const hasEvent = monthDays.some(d => d.season !== "عادي" && d.season !== "نهاية الأسبوع");
            const hasStrategy = monthDays.some(d => d.strategies.length > 0);
            const mainEvent = monthDays.find(d => d.season !== "عادي" && d.season !== "نهاية الأسبوع" && d.mult > 2.5)?.season || "";

            monthly.push({
                label: monthsAr[m],
                mult: avgMult,
                hasMarker: hasEvent || hasStrategy,
                eventsCount: monthDays.filter(d => d.season !== "عادي" && d.season !== "نهاية الأسبوع").length,
                mainEvent: mainEvent
            });
        }
        return monthly;
    };

    // Destroy existing chart if it exists
    if (state.priceChart) {
        state.priceChart.destroy();
    }

    let labels, dataPoints, events, strategies, rawMults;

    if (state.chartView === 'monthly') {
        const monthlyData = getMonthlyData();
        labels = monthlyData.map(m => m.label);
        dataPoints = monthlyData.map(m => (m.mult * 100).toFixed(0));
        rawMults = monthlyData.map(m => m.mult);
        // Special mapping for monthly tooltips/markers
        events = monthlyData.map(m => m.mainEvent ? m.mainEvent : (m.eventsCount > 0 ? `${m.eventsCount} أحداث` : null));
        strategies = monthlyData.map(m => m.hasMarker ? "أكثر من استراتيجية" : null);
    } else {
        labels = state.yearlyData.map(d => `${d.day}/${d.monthIdx + 1}`);
        dataPoints = state.yearlyData.map(d => (d.mult * 100).toFixed(0));
        rawMults = state.yearlyData.map(d => d.mult);
        events = state.yearlyData.map(d => d.season !== "عادي" && d.season !== "نهاية الأسبوع" ? d.season : null);
        strategies = state.yearlyData.map(d => d.strategies.length > 0 ? d.strategies.map(s => strategyInfo[s].name).join(', ') : null);
    }

    state.priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'مؤشر سعر الغرفة (%)',
                data: dataPoints,
                borderColor: '#aaa',
                borderWidth: 2,
                pointRadius: (context) => {
                    const index = context.dataIndex;
                    if (state.chartView === 'monthly') return 6; // Always show monthly points
                    if (events[index] || strategies[index]) return 5;
                    return 0;
                },
                pointHoverRadius: 7,
                pointBackgroundColor: (context) => {
                    const index = context.dataIndex;
                    const mult = rawMults[index];
                    return getHeatColor(mult);
                },
                pointBorderColor: '#fff',
                pointBorderWidth: 1.5,
                tension: 0,
                fill: false,
                segment: {
                    borderColor: ctx => {
                        const idx = ctx.p0DataIndex;
                        const mult = rawMults[idx];
                        return getHeatColor(mult);
                    },
                    borderWidth: 2.5
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 10, bottom: 10, left: 5, right: 5 }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    rtl: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleColor: '#0A2E5A',
                    bodyColor: '#444',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true,
                    titleFont: { family: 'Cairo', size: 14, weight: '700' },
                    bodyFont: { family: 'Cairo', size: 13 },
                    callbacks: {
                        label: function (context) {
                            const idx = context.dataIndex;
                            let lines = [`السعر: ${context.parsed.y}%`];
                            if (events[idx]) lines.push(`📌 ${state.chartView === 'monthly' ? 'أبرز حدث: ' : 'الحدث: '}${events[idx]}`);
                            if (strategies[idx] && state.chartView === 'daily') lines.push(`⚡ الاستراتيجية: ${strategies[idx]}`);
                            return lines;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: {
                        color: '#6c757d',
                        font: { family: 'Cairo', size: 11 },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: state.chartView === 'monthly' ? 12 : 12,
                        callback: function (val, index) {
                            if (state.chartView === 'monthly') return labels[index];
                            const date = state.yearlyData[index].date;
                            if (date.getDate() === 1) return monthsAr[date.getMonth()];
                            return null;
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 100,
                    grid: {
                        color: '#f0f0f0',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6c757d',
                        font: { family: 'Cairo', size: 11 },
                        stepSize: state.chartView === 'monthly' ? 50 : 100,
                        callback: function (value) { return value + '%'; }
                    }
                }
            }
        }
    });
}
