document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы поиска на главной странице
    const searchForm = document.querySelector('.search-form form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const from = this.querySelector('input[placeholder="Откуда"]').value;
            const to = this.querySelector('input[placeholder="Куда"]').value;
            const date = this.querySelector('input[type="date"]').value;
            
            // Сохраняем параметры поиска
            sessionStorage.setItem('searchParams', JSON.stringify({
                from: from,
                to: to,
                date: date
            }));
            
            // Переходим на страницу бронирования
            window.location.href = 'booking.html';
        });
    }

    // Загрузка данных через fetch
    fetch('../XML/flights.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            displayFlights(xml);
            
            // Заполняем форму поиска на странице booking.html
            fillSearchForm();
        })
        .catch(error => {
            console.error('Error loading XML:', error);
            // Fallback data if XML fails to load
            const fallbackData = `
                <flights>
                    <flight>
                        <route>Минск → Санкт-Петербург</route>
                        <time>10:50 → 14:20</time>
                        <plane>Boeing 737</plane>
                        <price>120</price>
                        <departure>2023-11-15</departure>
                    </flight>
                    <flight>
                        <route>Сочи → Санкт-Петербург</route>
                        <time>08:15 → 09:45</time>
                        <plane>Airbus A320</plane>
                        <price>95</price>
                        <departure>2023-11-16</departure>
                    </flight>
                </flights>
            `;
            const parser = new DOMParser();
            const xml = parser.parseFromString(fallbackData, "text/xml");
            displayFlights(xml);
            fillSearchForm();
        });

    function fillSearchForm() {
        // Заполняем форму поиска на странице booking.html
        if (window.location.pathname.includes('booking.html')) {
            const searchParams = JSON.parse(sessionStorage.getItem('searchParams')) || {};
            
            if (searchParams.from) {
                document.getElementById('from').value = searchParams.from;
            }
            if (searchParams.to) {
                document.getElementById('to').value = searchParams.to;
            }
            if (searchParams.date) {
                document.getElementById('date').value = searchParams.date;
            }
        }
    }

    function displayFlights(xml) {
        const flights = xml.getElementsByTagName('flight');
        const tbody = document.getElementById('flights-body');
        
        if (!tbody) return;
        
        for (let flight of flights) {
            const route = flight.getElementsByTagName('route')[0].textContent;
            const time = flight.getElementsByTagName('time')[0].textContent;
            const plane = flight.getElementsByTagName('plane')[0].textContent;
            const price = flight.getElementsByTagName('price')[0]?.textContent || '0';
            const departure = flight.getElementsByTagName('departure')[0]?.textContent || '';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route}</td>
                <td>${time}</td>
                <td>${departure}</td>
                <td>${plane}</td>
                <td>${price}$</td>
                <td><button class="select-btn" 
                    data-route="${route}"
                    data-time="${time}"
                    data-plane="${plane}"
                    data-price="${price}"
                    data-departure="${departure}">Выбор</button></td>
            `;
            tbody.appendChild(row);
        }
        
        setupEventListeners();
    }

    function setupEventListeners() {
        // Поиск рейсов
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const from = document.getElementById('from').value.toLowerCase();
                const to = document.getElementById('to').value.toLowerCase();
                const date = document.getElementById('date').value;
                
                const rows = document.querySelectorAll('#flights-body tr');
                for (let row of rows) {
                    const route = row.cells[0].textContent.toLowerCase();
                    const departure = row.cells[2].textContent;
                    
                    const show = (!from || route.includes(from)) && 
                                 (!to || route.includes(to)) &&
                                 (!date || departure === date);
                    row.style.display = show ? '' : 'none';
                }
            });
        }
        
        // Выбор рейса
        const flightsBody = document.getElementById('flights-body');
        if (flightsBody) {
            flightsBody.addEventListener('click', function(e) {
                if (e.target.classList.contains('select-btn')) {
                    const route = e.target.dataset.route;
                    const time = e.target.dataset.time;
                    const plane = e.target.dataset.plane;
                    const price = e.target.dataset.price;
                    const departure = e.target.dataset.departure;
                    
                    // Перенаправление на страницу бронирования с параметрами
                    window.location.href = `buybilet.html?route=${encodeURIComponent(route)}&time=${encodeURIComponent(time)}&plane=${encodeURIComponent(plane)}&price=${encodeURIComponent(price)}&departure=${encodeURIComponent(departure)}`;
                }
            });
        }
    }
});