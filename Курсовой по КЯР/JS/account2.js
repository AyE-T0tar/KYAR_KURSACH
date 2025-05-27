document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных пользователя при открытии страницы
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userNameElement = document.querySelector('.user-name');
        const userEmailElement = document.querySelector('.user-email');
        if (userNameElement) userNameElement.textContent = user.name;
        if (userEmailElement) userEmailElement.textContent = user.email;
        
        // Заполнение формы профиля
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');
        if (fullNameInput) fullNameInput.value = user.name;
        if (emailInput) emailInput.value = user.email;
    }

    // Переключение между разделами и инициализация "глазика"
    const menuLinks = document.querySelectorAll('.account-menu a');
    const accountSections = document.querySelectorAll('.account-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаляем активный класс у всех ссылок
            menuLinks.forEach(item => item.classList.remove('active'));
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Скрываем все разделы
            accountSections.forEach(section => section.classList.remove('active'));
            // Показываем нужный раздел
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.add('active');
                // Инициализация "глазика" при переключении на настройки
                if (this.getAttribute('href') === '#settings' && targetSection.querySelector('#password')) {
                    const passwordInput = targetSection.querySelector('#password');
                    if (passwordInput && !passwordInput.parentElement.classList.contains('password-wrapper')) {
                        addPasswordToggle(passwordInput);
                    }
                }
            }
        });
    });
    
    // Валидация пароля и добавление "глазика" при загрузке
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        addPasswordToggle(passwordInput);

        // Валидация пароля
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const isLengthValid = password.length >= 5;
            const hasNumber = /\d/.test(password);
            
            // Обновляем подсказки
            const lengthHint = document.getElementById('length-hint');
            const numberHint = document.getElementById('number-hint');
            
            if (lengthHint) lengthHint.className = isLengthValid ? 'valid' : 'invalid';
            if (numberHint) numberHint.className = hasNumber ? 'valid' : 'invalid';
        });
    }

    // Функция добавления "глазика" к полю пароля
    function addPasswordToggle(inputElement) {
        const wrapper = document.createElement('div');
        wrapper.className = 'password-wrapper';
        
        const toggle = document.createElement('span');
        toggle.className = 'toggle-password';
        toggle.innerHTML = '👁️';
        toggle.addEventListener('click', function() {
            if (inputElement.type === 'password') {
                inputElement.type = 'text';
                toggle.innerHTML = '👁️';
            } else {
                inputElement.type = 'password';
                toggle.innerHTML = '👁️';
            }
        });
        
        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(inputElement);
        wrapper.appendChild(toggle);
    }
    
    // Функция валидации пароля
    function validatePassword(password) {
        const isLengthValid = password.length >= 5;
        const hasNumber = /\d/.test(password);
        return { isLengthValid, hasNumber, isValid: isLengthValid && hasNumber };
    }

    // Обработка формы профиля
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('full-name')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;
            const passport = document.getElementById('passport')?.value;
            
            // Проверка на существующий email
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const existingUser = users.find(user => user.email === email && user.email !== currentUser.email);
            
            if (existingUser) {
                alert('Этот email уже используется другим пользователем. Пожалуйста, выберите другой email.');
                document.getElementById('email').focus();
                return;
            }
            
            // Обновляем данные пользователя
            const updatedUser = { name: fullName, email, phone, passport };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Обновляем массив users
            users = users.map(user => user.email === currentUser.email ? { ...user, name: fullName, email } : user);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновляем отображение в боковой панели
            const userNameElement = document.querySelector('.user-name');
            const userEmailElement = document.querySelector('.user-email');
            if (userNameElement) userNameElement.textContent = fullName;
            if (userEmailElement) userEmailElement.textContent = email;
            
            alert('Данные профиля успешно обновлены!');
        });
    }

    // Обработка формы настроек (сохранение нового пароля)
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const passwordInput = document.getElementById('password');
            const newPassword = passwordInput?.value;
            
            // Валидация нового пароля
            if (!newPassword) {
                alert('Пожалуйста, введите новый пароль.');
                passwordInput.focus();
                return;
            }
            
            const { isValid } = validatePassword(newPassword);
            if (!isValid) {
                alert('Пароль должен содержать не менее 5 символов и включать цифры.');
                passwordInput.focus();
                return;
            }
            
            // Обновляем пароль в localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUser = JSON.parse(localStorage.getItem('user'));
            
            // Обновляем пароль в массиве users
            users = users.map(user => 
                user.email === currentUser.email ? { ...user, password: newPassword } : user
            );
            localStorage.setItem('users', JSON.stringify(users));
            
            // Очищаем поле ввода
            passwordInput.value = '';
            
            alert('Пароль успешно обновлен!');
        });
    }
    
    // Выход из аккаунта
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                // Очищаем данные пользователя
                localStorage.removeItem('user');
                // Перенаправляем на главную страницу
                window.location.href = '../HTML/Main.html';
            }
        });
    }
});