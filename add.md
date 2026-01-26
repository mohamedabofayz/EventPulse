# تعديل نظام SmartHotel AI للعمل مع أحداث من رابط ويب هوك (Webhook)

## مقدمة

نظام SmartHotel AI الحالي يعمل على أحداث معرفة مسبقًا في الكود (Events 2026)، مثل مواسم الحج ورمضان وأعياد وطنية. في هذا المستند، سأشرح بالتفصيل كيف يمكن تعديل النظام ليصبح ديناميكيًا ويأخذ الأحداث من رابط ويب هوك بدلاً من الأحداث الثابتة في الكود.

## الفرق بين النظام الحالي والمراد تطويره

### النظام الحالي:
- الأحداث معرفة مسبقًا في الكود (Hardcoded)
- لا يمكن تحديث الأحداث دون تعديل الكود
- لا يتفاعل مع الأحداث الحقيقية التي تحدث فعليًا

### النظام بعد التعديل:
- الأحداث تأتي من رابط ويب هوك خارجي
- يمكن تحديث الأحداث بشكل ديناميكي
- يتفاعل مع الأحداث الحالية والمستقبلية في الوقت الحقيقي

## الخطوات لتحويل النظام للعمل مع ويب هوك

### 1. تعريف هيكل البيانات للحدث من ويب هوك

أولاً، نحتاج لتحديد هيكل البيانات التي سيتلقاها النظام من الويب هوك:

```json
{
  "events": [
    {
      "id": "event_001",
      "name": "حفل موسيقي كبير",
      "start_date": "2026-07-15",
      "end_date": "2026-07-17",
      "location": "الرياض",
      "category": "ترفيهي",
      "impact_level": "high",  // low, medium, high, very_high
      "price_multiplier": 1.8,
      "occupancy_boost": 25
    },
    {
      "id": "event_002",
      "name": "مؤتمر تجاري",
      "start_date": "2026-09-05",
      "end_date": "2026-09-07",
      "location": "مكة",
      "category": "تجاري",
      "impact_level": "medium",
      "price_multiplier": 1.4,
      "occupancy_boost": 15
    }
  ]
}
```

### 2. تعديل هيكل الكود

نحتاج لإجراء التعديلات التالية في الكود:

#### أ. استبدال الأحداث الثابتة بمتغير فارغ:

نحذف أو نستبدل هذا الجزء من الكود:

```javascript
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
```

بمتغير فارغ أو مهيأ مسبقًا:

```javascript
// Events will be loaded from webhook
let externalEvents = [];
```

#### ب. إضافة وظيفة لجلب الأحداث من ويب هوك:

```javascript
async function fetchEventsFromWebhook() {
  try {
    const response = await fetch('YOUR_WEBHOOK_URL_HERE');
    const data = await response.json();
    
    // Transform the received data to internal format
    externalEvents = data.events.map(event => ({
      id: event.id,
      name: event.name,
      startDate: new Date(event.start_date),
      endDate: new Date(event.end_date),
      category: event.category,
      impactLevel: event.impact_level,
      priceMultiplier: event.price_multiplier,
      occupancyBoost: event.occupancy_boost
    }));
    
    console.log('Events loaded from webhook:', externalEvents);
    return externalEvents;
  } catch (error) {
    console.error('Error fetching events from webhook:', error);
    return [];
  }
}
```

#### ج. تعديل وظيفة التحليل لدمج الأحداث من ويب هوك:

نحتاج لتعديل دالة `generateData()` لدمج الأحداث من الويب هوك مع الأحداث الموسمية التقليدية:

```javascript
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

      // --- 1. Base Season Logic (Traditional Events) ---
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

      // --- 2. External Events from Webhook ---
      const matchingEvent = externalEvents.find(event => 
        date >= event.startDate && date <= event.endDate
      );
      
      if (matchingEvent) {
        // Override or combine with traditional events based on impact level
        if (matchingEvent.priceMultiplier > baseMult) {
          seasonName = matchingEvent.name;
          baseMult = matchingEvent.priceMultiplier;
        }
        
        // Add event-based strategies
        activeStrategies.push(`event_${matchingEvent.id}`);
      }

      // --- 3. Apply Strategies ---
      // (Keep existing strategy logic)
      // ... rest of the function
    }
  }
  return data;
}
```

### 3. تعديل واجهة المستخدم لعرض حالة الاتصال بالويب هوك

نحتاج لإضافة مؤشر حالة الاتصال ووظيفة تحديث الأحداث:

```html
<div class="glass-panel" style="text-align: center;">
  <p style="color: var(--text-muted); margin-bottom: 15px;">.Events Status: <span id="webhookStatus">غير متصل</span></p>
  <button class="btn btn-success" id="refreshEventsBtn" style="width: auto;">🔄 تحديث الأحداث</button>
</div>
```

وإضافة معالجة الحدث:

```javascript
document.getElementById('refreshEventsBtn').addEventListener('click', async () => {
  document.getElementById('webhookStatus').textContent = 'جاري التحديث...';
  document.getElementById('webhookStatus').style.color = 'var(--orange)';
  
  await fetchEventsFromWebhook();
  
  document.getElementById('webhookStatus').textContent = 'تم التحديث (' + externalEvents.length + ' أحداث)';
  document.getElementById('webhookStatus').style.color = 'var(--green)';
  
  // Re-run analysis with new events
  if (state.hotelInfo.totalRooms) {
    runAnalysis();
  }
});
```

### 4. تعديل دالة التهيئة لتحميل الأحداث عند بدء النظام

نحتاج لتعديل دالة التهيئة:

```javascript
// At the end of the script, initialize the system
document.addEventListener('DOMContentLoaded', async () => {
  // Load events from webhook when page loads
  await fetchEventsFromWebhook();
  
  if (externalEvents.length > 0) {
    document.getElementById('webhookStatus').textContent = 'متصل (' + externalEvents.length + ' أحداث)';
    document.getElementById('webhookStatus').style.color = 'var(--green)';
  } else {
    document.getElementById('webhookStatus').textContent = 'لا توجد أحداث';
    document.getElementById('webhookStatus').style.color = 'var(--red)';
  }
});
```

### 5. إضافة وظيفة لتحديد مصدر الحدث في عرض التقويم

نحتاج لتعديل دالة `showDayDetails()` لعرض مصدر الحدث:

```javascript
function showDayDetails(d) {
  document.getElementById('detailsTitle').textContent = `تفاصيل يوم ${d.day} ${monthsAr[d.monthIdx]}`;
  
  // Check if this day has an external event
  let eventSource = " seasonal"; // Default to seasonal event
  const matchingEvent = externalEvents.find(event => {
    const date = new Date(2026, d.monthIdx, d.day);
    return date >= event.startDate && date <= event.endDate;
  });
  
  if (matchingEvent) {
    eventSource = ` ${matchingEvent.name} (${matchingEvent.category})`;
  }
  
  let th = `<tr><th>نوع الغرفة</th><th>العدد</th><th>السعر العادي</th><th>سعر الإطلالة</th><th>الإيراد</th><th>مصدر الحدث</th></tr>`;
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
    <td>${eventSource}</td>
    </tr>`;
  });
  
  document.getElementById('detailsBody').innerHTML = tb;
  document.getElementById('detailsModal').classList.add('active');
}
```

### 6. إضافة وظيفة لتحديد لون الخلايا بناءً على مصدر الحدث

نحتاج لتعديل الطريقة التي يتم بها تحديد لون الخلايا في التقويم:

```javascript
// Inside the calendar rendering function
days.forEach(d => {
  let heatClass = 'heat-neutral';
  
  // Check if this day has an external event
  const matchingEvent = externalEvents.find(event => {
    const date = new Date(2026, d.monthIdx, d.day);
    return date >= event.startDate && date <= event.endDate;
  });
  
  // Determine heat class based on event impact or seasonal multiplier
  if (matchingEvent) {
    // Use event impact level
    switch(matchingEvent.impactLevel) {
      case 'very_high':
        heatClass = 'heat-very-high';
        break;
      case 'high':
        heatClass = 'heat-high';
        break;
      case 'medium':
        heatClass = 'heat-medium';
        break;
      default:
        if(d.mult > 3.0) heatClass = 'heat-very-high';
        else if(d.mult > 2.0) heatClass = 'heat-high';
        else if(d.mult > 1.2) heatClass = 'heat-medium';
    }
  } else {
    // Use seasonal multiplier
    if(d.mult > 3.0) heatClass = 'heat-very-high';
    else if(d.mult > 2.0) heatClass = 'heat-high';
    else if(d.mult > 1.2) heatClass = 'heat-medium';
  }
  
  const cell = document.createElement('div');
  cell.className = `day-cell ${heatClass}`;
  cell.textContent = d.day;
  
  // Add dot if strategy active
  if(d.strategies.length > 0) {
    const dot = document.createElement('div');
    dot.style.cssText = 'width:5px;height:5px;background:var(--dark-blue);border-radius:50%;position:absolute;bottom:3px;right:3px;';
    cell.appendChild(dot);
  }
  
  // Include event source in tooltip
  let eventSource = matchingEvent ? matchingEvent.name : d.season;
  cell.title = `${eventSource} | الإيراد: ${d.totalRev.toLocaleString()} ريال | الاستراتيجيات: ${d.strategies.map(s => strategyInfo[s].name).join(', ')}`;
  cell.onclick = (e) => { e.stopPropagation(); showDayDetails(d); };
  
  daysDiv.appendChild(cell);
});
```

## مزايا النظام بعد التعديل

1. **تحديث ديناميكي**: يمكن تحديث الأحداث بدون تعديل الكود
2. **التفاعل مع الأحداث الحقيقية**: النظام يتفاعل مع الأحداث التي تحدث فعليًا
3. **سهولة التكامل**: يمكن ربطه بأنظمة إدارة الأحداث الأخرى
4. **التحكم عن بعد**: يمكن إدارة الأحداث من واجهة إدارية خارجية
5. **التحديث التلقائي**: يمكن ضبط النظام لتحديث الأحداث تلقائيًا كل فترة

## كيفية تهيئة رابط الويب هوك

1. يجب أن يكون الرابط يعيد بيانات JSON بصيغة معرفة مسبقًا
2. يجب أن تكون البيانات محدثة دائمًا
3. يجب تنفيذ آليات الأمان المناسبة (مثل التوقيع الرقمي أو المصادقة)

## مثال عملي على رابط ويب هوك

```javascript
// في تطبيق خارجي (Node.js مثلاً)
app.get('/api/hotel-events', (req, res) => {
  const events = [
    {
      id: 'umrah_campaign_2026',
      name: 'حملة العمرة 2026',
      start_date: '2026-03-10',
      end_date: '2026-04-15',
      location: 'مكة',
      category: 'دينية',
      impact_level: 'high',
      price_multiplier: 2.2,
      occupancy_boost: 30
    },
    {
      id: 'national_day_2026',
      name: 'اليوم الوطني 2026',
      start_date: '2026-09-23',
      end_date: '2026-09-25',
      location: 'جميع المدن',
      category: 'وطني',
      impact_level: 'high',
      price_multiplier: 2.0,
      occupancy_boost: 25
    }
  ];
  
  res.json({ events });
});
```

## خاتمة

باستخدام هذه التعديلات، سيصبح نظام SmartHotel AI أكثر مرونة وفعالية، حيث سيتمكن من التفاعل مع الأحداث الحقيقية التي تحدث في السوق بشكل ديناميكي، مما يؤدي إلى تحسين دقة التنبؤات وزيادة الإيرادات من خلال التكيف الفوري مع الظروف المتغيرة في السوق الفندقي.