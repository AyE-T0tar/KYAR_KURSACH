document.addEventListener('DOMContentLoaded', function() {
  loadFlightsData();


  const searchForm = document.querySelector('.search-form form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveSearchParams();
      window.location.href = 'booking.html';
    });
  }

  fillSearchForm();
});


function loadFlightsData() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '../XML/flights.xml', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const xml = xhr.responseXML;
        

        if (xml.querySelector('parsererror')) {
          console.error('Ошибка в структуре XML');
          loadFallbackData();
          return;
        }
        
        displayFlights(xml);
      } else {
        console.error('Ошибка загрузки XML:', xhr.statusText);
        loadFallbackData();
      }
    }
  };
  xhr.send(null);
}


function displayFlights(xml) {
  const flights = xml.querySelectorAll('flight');
  const tbody = document.getElementById('flights-body');
  
  if (!tbody) {
    console.error('Элемент #flights-body не найден!');
    return;
  }

  tbody.innerHTML = '';

  flights.forEach(flight => {
    const route = flight.querySelector('route')?.textContent || 'Нет данных';
    const time = flight.querySelector('time')?.textContent || 'Нет данных';
    const plane = flight.querySelector('plane')?.textContent || 'Нет данных';
    const price = flight.querySelector('price')?.textContent || '0';
    const departure = flight.querySelector('departure')?.textContent || 'Нет данных';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${route}</td>
      <td>${time}</td>
      <td>${departure}</td>
      <td>${plane}</td>
      <td>${price}$</td>
      <td>
        <button class="select-btn" 
          data-route="${route}"
          data-time="${time}"
          data-plane="${plane}"
          data-price="${price}"
          data-departure="${departure}">
          Выбор
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });


  setupEventListeners();
}


function loadFallbackData() {
  const fallbackData = `
    <flights>
      <flight>
        <route>Минск → Москва (резервные данные)</route>
        <time>10:00 → 12:30</time>
        <plane>Boeing 737</plane>
        <price>150</price>
        <departure>2025-01-01</departure>
      </flight>
    </flights>
  `;
  const parser = new DOMParser();
  const xml = parser.parseFromString(fallbackData, "text/xml");
  displayFlights(xml);
}


function saveSearchParams() {
  const from = document.querySelector('input[placeholder="Откуда"]')?.value;
  const to = document.querySelector('input[placeholder="Куда"]')?.value;
  const date = document.querySelector('input[type="date"]')?.value;

  if (from || to || date) {
    sessionStorage.setItem('searchParams', JSON.stringify({
      from: from,
      to: to,
      date: date
    }));
  }
}


function fillSearchForm() {
  if (!window.location.pathname.includes('booking.html')) return;

  const searchParams = JSON.parse(sessionStorage.getItem('searchParams')) || {};
  if (searchParams.from) document.getElementById('from').value = searchParams.from;
  if (searchParams.to) document.getElementById('to').value = searchParams.to;
  if (searchParams.date) document.getElementById('date').value = searchParams.date;
}


function setupEventListeners() {

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const from = document.getElementById('from').value.toLowerCase();
      const to = document.getElementById('to').value.toLowerCase();
      const date = document.getElementById('date').value;
      
      const rows = document.querySelectorAll('#flights-body tr');
      rows.forEach(row => {
        const route = row.cells[0].textContent.toLowerCase();
        const departure = row.cells[2].textContent;
        
        const show = (!from || route.includes(from)) && 
                    (!to || route.includes(to)) &&
                    (!date || departure === date);
        row.style.display = show ? '' : 'none';
      });
    });
  }


  document.getElementById('flights-body')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('select-btn')) {
      const { route, time, plane, price, departure } = e.target.dataset;
      window.location.href = `buybilet.html?route=${encodeURIComponent(route)}&time=${encodeURIComponent(time)}&plane=${encodeURIComponent(plane)}&price=${encodeURIComponent(price)}&departure=${encodeURIComponent(departure)}`;
    }
  });
}