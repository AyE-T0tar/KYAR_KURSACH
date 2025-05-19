document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const route = urlParams.get('route');
    const time = urlParams.get('time');
    const plane = urlParams.get('plane');
    
    let basePrice = 0; // Будет хранить базовую стоимость рейса
    
    // Загружаем данные о рейсе из XML
    fetch('../XML/flights.xml')
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            const flights = xml.getElementsByTagName('flight');
            
            for (let flight of flights) {
                const flightRoute = flight.getElementsByTagName('route')[0].textContent;
                if (flightRoute === route) {
                    // Устанавливаем данные о рейсе
                    document.getElementById('flight-route').textContent = route;
                    document.getElementById('flight-time').textContent = time;
                    document.getElementById('flight-plane').textContent = plane;
                    
                    // Устанавливаем дату и цену
                    const departure = flight.getElementsByTagName('departure')[0].textContent;
                    const price = flight.getElementsByTagName('price')[0].textContent;
                    basePrice = parseInt(price);
                    
                    const dateObj = new Date(departure);
                    const formattedDate = dateObj.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    document.getElementById('flight-date').textContent = formattedDate;
                    updatePrices();
                    
                    break;
                }
            }
        })
        .catch(error => console.error('Error loading flight data:', error));

    // Обработка дополнительных услуг
    const serviceCheckboxes = document.querySelectorAll('.services-list input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrices);
    });

    function updatePrices() {
        let extraPrice = 0;
        
        // Пересчитываем стоимость дополнительных услуг
        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                extraPrice += parseInt(checkbox.dataset.price);
            }
        });
        
        const totalPrice = basePrice + extraPrice;
        
        // Обновляем отображение цен
        document.getElementById('base-price').textContent = `${basePrice}$`;
        document.getElementById('extra-price').textContent = `${extraPrice}$`;
        document.getElementById('total-price').textContent = `${totalPrice}$`;
        document.getElementById('payment-amount').textContent = totalPrice;
        
        // Обновляем текст кнопки
        document.getElementById('proceed-to-payment').textContent = `Перейти к оплате (${totalPrice}$)`;
    }

    // Обработка кнопки оплаты
    document.getElementById('proceed-to-payment').addEventListener('click', function() {
        // Здесь можно добавить логику обработки оплаты
        alert('Рейс успешно забронирован!');
    });
});