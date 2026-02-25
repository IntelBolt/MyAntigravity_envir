/**
 * Скрипт для сайта: Захват GA4 ClientID и UTM-меток
 *
 * Инструкция:
 * 1. Разместите этот код в теге <head> после основного кода Google Analytics.
 * 2. В формах на сайте должны быть скрытые поля с именами:
 *    - google_client_id
 *    - utm_source
 *    - utm_medium
 *    - utm_campaign
 *    - utm_content
 *    - utm_term
 */

(function () {
    // Функция получения ClientID из GA4
    function captureGcid() {
        if (typeof gtag !== 'undefined') {
            gtag('get', 'YOUR_MEASUREMENT_ID', 'client_id', (clientId) => {
                const fields = document.querySelectorAll('input[name="google_client_id"], .gcid-field');
                fields.forEach(field => {
                    field.value = clientId;
                });
                console.log('IntelBolt: Captured GCID', clientId);
                localStorage.setItem('intelbolt_gcid', clientId);
            });
        }
    }

    // Функция захвата UTM-меток из URL
    function captureUtms() {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['source', 'medium', 'campaign', 'term', 'content'];

        utms.forEach(param => {
            const value = urlParams.get('utm_' + param);
            if (value) {
                const fields = document.querySelectorAll(`input[name="utm_${param}"], .utm-${param}-field`);
                fields.forEach(input => {
                    input.value = value;
                });
                localStorage.setItem('intelbolt_utm_' + param, value);
            } else {
                // Если в URL нет, пробуем восстановить из localStorage
                const savedValue = localStorage.getItem('intelbolt_utm_' + param);
                if (savedValue) {
                    const fields = document.querySelectorAll(`input[name="utm_${param}"], .utm-${param}-field`);
                    fields.forEach(input => {
                        input.value = savedValue;
                    });
                }
            }
        });
    }

    // Запуск при загрузке
    window.addEventListener('load', () => {
        captureGcid();
        captureUtms();
    });

    // Резервный запуск через 3 секунды (на случай медленной загрузки gtag)
    setTimeout(() => {
        captureGcid();
        captureUtms();
    }, 3000);
})();
