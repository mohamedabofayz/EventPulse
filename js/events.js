// ⚠️⚠️ هام: تأكد أن هذا الرابط هو رابط Web App الخاص بك
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydeVJflP4VwHposHOz6OHEsKxM8dkJV19RC5EZn6eTFwWqZMmUH_MjWMRqT6abaEQc/exec";

// دالة إرسال التحديث (الجزء العلوي)
function sendUpdate() {
    const gov = document.getElementById('govSelect').value;
    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');

    const platformOptions = document.getElementsByName('platform');
    let selectedPlatform = null;
    for (const option of platformOptions) {
        if (option.checked) {
            selectedPlatform = option.value;
            break;
        }
    }

    if (!gov) { resultDiv.innerHTML = "<span style='color:red'>يرجى اختيار المحافظة أولاً.</span>"; return; }
    if (!selectedPlatform) { resultDiv.innerHTML = "<span style='color:red'>يرجى اختيار نوع التحديث.</span>"; return; }

    resultDiv.innerText = "";
    loader.style.display = "block";

    const url = `${SCRIPT_URL}?gov=${encodeURIComponent(gov)}&platform=${encodeURIComponent(selectedPlatform)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            loader.style.display = "none";
            if (data.status === "success") {
                resultDiv.innerHTML = `<div style="background:#e8f5e9; padding:10px; border-radius:5px; color:#2e7d32;">${data.message}</div>`;
                fetchSheetData();
            } else {
                resultDiv.innerHTML = `<div style="background:#ffebee; padding:10px; border-radius:5px; color:#c62828;">خطأ: ${data.message}</div>`;
            }
        })
        .catch(error => {
            loader.style.display = "none";
            resultDiv.innerHTML = "<span style='color:red'>فشل الاتصال بالخادم.</span>";
            console.error('Error:', error);
        });
}

// --- دوال الجدول الجديد ---

window.onload = function () {
    fetchSheetData();
};

function fetchSheetData() {
    const tableBody = document.querySelector("#dataTable tbody");
    const loader = document.getElementById("tableLoader");

    loader.style.display = "block";
    tableBody.innerHTML = "";

    fetch(`${SCRIPT_URL}?action=readData`)
        .then(response => response.json())
        .then(json => {
            loader.style.display = "none";
            if (json.status === "success") {
                renderTable(json.data);
            } else {
                tableBody.innerHTML = "<tr><td colspan='5'>خطأ في جلب البيانات</td></tr>";
            }
        })
        .catch(err => {
            loader.style.display = "none";
            console.error(err);
            tableBody.innerHTML = "<tr><td colspan='5'>تعذر الاتصال بقاعدة البيانات</td></tr>";
        });
}

function renderTable(data) {
    const tableHead = document.querySelector("#dataTable thead");
    const tableBody = document.querySelector("#dataTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (!data || data.length === 0) return;

    let headerRow = "<tr>";
    data[0].forEach(cell => {
        headerRow += `<th>${cell}</th>`;
    });
    headerRow += "<th>إجراء</th>";
    headerRow += "</tr>";
    tableHead.innerHTML = headerRow;

    for (let i = 1; i < data.length; i++) {
        let rowHtml = "<tr>";


        data[i].forEach((cell, index) => {
            if (index === 3) {
                rowHtml += `<td>
            <input type="text" class="edit-input" id="row-${i + 1}-val" value="${cell}" placeholder="%">
        </td>`;
            } else {
                rowHtml += `<td>${cell}</td>`;
            }
        });

        // تعديل: إضافة ID للزر ليسهل الوصول إليه
        rowHtml += `<td>
    <button class="save-row-btn" id="btn-row-${i + 1}" onclick="updatePercentage(${i + 1})">
        <i class="fas fa-save"></i> حفظ
    </button>
</td>`;

        rowHtml += "</tr>";
        tableBody.innerHTML += rowHtml;
    }
}

// 🔥🔥 التعديل الجوهري هنا: إلغاء الـ Alert واستبداله بتحديث الزر 🔥🔥
function updatePercentage(rowIndex) {
    const inputVal = document.getElementById(`row-${rowIndex}-val`).value;
    const btn = document.getElementById(`btn-row-${rowIndex}`);

    // حفظ النص الأصلي للزر لاستعادته
    const originalHTML = '<i class="fas fa-save"></i> حفظ';

    // تغيير حالة الزر إلى "جاري التحميل"
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const url = `${SCRIPT_URL}?action=updatePercentage&row=${rowIndex}&value=${encodeURIComponent(inputVal)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                // ✅ حالة النجاح: الزر يصبح أخضر ويكتب "تم"
                btn.innerHTML = '<i class="fas fa-check"></i> تم';
                btn.classList.add('success');
            } else {
                // ❌ حالة الخطأ من السيرفر: الزر يصبح أحمر
                btn.innerHTML = '<i class="fas fa-times"></i> خطأ';
                btn.classList.add('error');
            }

            // إعادة الزر لحالته الطبيعية بعد 2 ثانية
            resetButton(btn, originalHTML);
        })
        .catch(err => {
            console.error(err);
            // ⚠️ حالة فشل الاتصال
            btn.innerHTML = '<i class="fas fa-wifi"></i> فشل';
            btn.classList.add('error');

            resetButton(btn, originalHTML);
        });
}

// دالة مساعدة لإعادة الزر لطبيعته
function resetButton(btn, originalHTML) {
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('success', 'error');
        btn.disabled = false;
    }, 2000); // الانتظار لمدة ثانيتين
}
