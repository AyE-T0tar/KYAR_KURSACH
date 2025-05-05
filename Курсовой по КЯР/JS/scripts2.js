document.addEventListener('DOMContentLoaded', function() {
    // Загрузка популярных рейсов
    loadPopularFlights();
    
    // Обработка формы поиска
    const searchForm = document.querySelector('.search-form form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
    }
});

function loadPopularFlights() {
    fetch('../XML/popular_flights.xml')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            displayFlights(xml, 'flightList');
        })
        .catch(error => {
            console.error('Error:', error);
            const fallbackData = `
                <popularFlights>
                    <flight>
                        <route>Минск → Санкт-Петербург</route>
                        <time>10:50 → 14:20</time>
                        <plane>Boeing 737</plane>
                        <departure>2025-12-06</departure>
                        <price>120</price>
                    </flight>
                </popularFlights>
            `;
            const parser = new DOMParser();
            const xml = parser.parseFromString(fallbackData, "text/xml");
            displayFlights(xml, 'flightList');
        });
}

function displayFlights(xml, targetId) {
    const flights = xml.getElementsByTagName('flight');
    const container = document.getElementById(targetId);
    
    for (let flight of flights) {
        const route = flight.getElementsByTagName('route')[0].textContent;
        const time = flight.getElementsByTagName('time')[0].textContent;
        const plane = flight.getElementsByTagName('plane')[0].textContent;
        const departure = flight.getElementsByTagName('departure')[0].textContent;
        const price = flight.getElementsByTagName('price')[0].textContent + '$';
        
        const dateObj = new Date(departure);
        const formattedDate = dateObj.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${route}</td>
            <td>${time}</td>
            <td>${formattedDate}</td>
            <td>${plane}</td>
            <td>${price}</td>
            <td><button class="book-btn" data-route="${route}" data-time="${time}" 
                data-plane="${plane}" data-price="${price}" data-date="${departure}">
                Выбрать
            </button></td>
        `;
        container.appendChild(row);
    }

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const params = new URLSearchParams();
            params.append('route', this.dataset.route);
            params.append('time', this.dataset.time);
            params.append('plane', this.dataset.plane);
            params.append('price', this.dataset.price);
            params.append('date', this.dataset.date);
            
            window.location.href = `booking.html?${params.toString()}`;
        });
    });
}

function handleSearchSubmit(e) {
    e.preventDefault();
    const from = this.querySelector('input[placeholder="Откуда"]').value;
    const to = this.querySelector('input[placeholder="Куда"]').value;
    const date = this.querySelector('input[type="date"]').value;
    
    sessionStorage.setItem('searchParams', JSON.stringify({ from, to, date }));
    window.location.href = 'booking.html';
}