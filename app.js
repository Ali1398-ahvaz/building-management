// مدیریت PWA
let deferredPrompt;

// تاریخ و زمان زنده
function updateDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        weekday: 'long'
    };
    
    const date = now.toLocaleDateString('fa-IR', options);
    const time = now.toLocaleTimeString('fa-IR');
    
    document.getElementById('current-date').textContent = date;
    document.getElementById('current-time').textContent = time;
}

// تماس اضطراری
function callEmergency(number) {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        // موبایل
        window.location.href = `tel:${number}`;
    } else {
        // دسکتاپ
        alert(`شماره ${number} را شماره گیری کنید`);
    }
}

// نمایش مدال اضطراری
function showEmergency() {
    document.getElementById('emergencyModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('emergencyModal').style.display = 'none';
}

// مدیریت نصب PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // نمایش prompt بعد از 5 ثانیه
    setTimeout(() => {
        showInstallPrompt();
    }, 5000);
});

function showInstallPrompt() {
    document.getElementById('installPrompt').style.display = 'block';
}

function hideInstallPrompt() {
    document.getElementById('installPrompt').style.display = 'none';
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('کاربر نصب را پذیرفت');
                hideInstallPrompt();
            }
            deferredPrompt = null;
        });
    }
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker ثبت شد با scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker ثبت نشد: ', error);
            });
    });
}

// نمایش بخش‌های مختلف
function showSection(section) {
    const messages = {
        'payments': '💰 بخش پرداخت قبوض\nبه زودی فعال می‌شود...',
        'units': '🏠 بخش مدیریت واحد\nبه زودی فعال می‌شود...', 
        'parking': '🅿️ بخش پارکینگ\nبه زودی فعال می‌شود...',
        'repairs': '🔧 بخش تعمیرات\nبه زودی فعال می‌شود...',
        'contacts': '📞 بخش تماس‌ها\nبه زودی فعال می‌شود...'
    };
    
    alert(messages[section]);
}

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // به روزرسانی تاریخ و زمان
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // بستن مدال با کلیک خارج
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('emergencyModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // بستن مدال با دکمه ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});
