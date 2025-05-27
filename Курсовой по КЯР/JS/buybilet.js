document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const route = urlParams.get('route');
    const time = urlParams.get('time');
    const plane = urlParams.get('plane');
    
    let basePrice = 0;
    

    fetch('../XML/flights.xml')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить flights.xml');
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            const flights = xml.getElementsByTagName('flight');
            
            for (let flight of flights) {
                const flightRoute = flight.getElementsByTagName('route')[0]?.textContent;
                if (flightRoute === route) {
                    
                    document.getElementById('flight-route').textContent = route || 'Не указано';
                    document.getElementById('flight-time').textContent = time || 'Не указано';
                    document.getElementById('flight-plane').textContent = plane || 'Не указано';
                    

                    const departure = flight.getElementsByTagName('departure')[0]?.textContent;
                    const price = flight.getElementsByTagName('price')[0]?.textContent;
                    basePrice = parseInt(price) || 0;
                    
                    if (departure) {
                        const dateObj = new Date(departure);
                        const formattedDate = dateObj.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });
                        document.getElementById('flight-date').textContent = formattedDate;
                    } else {
                        document.getElementById('flight-date').textContent = 'Дата не указана';
                    }
                    
                    updatePrices();
                    break;
                }
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки данных о рейсе:', error);
            document.getElementById('flight-route').textContent = 'Ошибка загрузки';
            document.getElementById('flight-time').textContent = 'Ошибка загрузки';
            document.getElementById('flight-plane').textContent = 'Ошибка загрузки';
            document.getElementById('flight-date').textContent = 'Ошибка загрузки';
            document.getElementById('base-price').textContent = '0$';
            document.getElementById('extra-price').textContent = '0$';
            document.getElementById('total-price').textContent = '0$';
            document.getElementById('proceed-to-payment').textContent = 'Перейти к оплате (0$)';
        });


    const serviceCheckboxes = document.querySelectorAll('.services-list input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrices);
    });

    function updatePrices() {
        let extraPrice = 0;
        

        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                extraPrice += parseInt(checkbox.dataset.price) || 0;
            }
        });
        
        const totalPrice = basePrice + extraPrice;
        
        document.getElementById('base-price').textContent = `${basePrice}$`;
        document.getElementById('extra-price').textContent = `${extraPrice}$`;
        document.getElementById('total-price').textContent = `${totalPrice}$`;
        document.getElementById('proceed-to-payment').textContent = `Перейти к оплате (${totalPrice}$)`;
    }


    document.getElementById('proceed-to-payment').addEventListener('click', function() {
        alert('Рейс успешно забронирован!');
    });
});