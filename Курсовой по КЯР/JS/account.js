document.addEventListener('DOMContentLoaded', function() {
    // Проверка, авторизован ли пользователь
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Если пользователь уже авторизован, перенаправляем в личный кабинет
        window.location.href = 'account.html';
        return;
    }

    // Элементы форм
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const switchToLogin = document.getElementById('switch-to-login');
    const switchToRegister = document.getElementById('switch-to-register');
    const passwordInput = document.getElementById('password');
    const loginPasswordInput = document.getElementById('login-password');
    const strengthBar = document.getElementById('password-strength-bar');

    // Добавляем "глазик" для поля пароля регистрации
    if (passwordInput) {
        addPasswordToggle(passwordInput);
    }

    // Добавляем "глазик" для поля пароля входа
    if (loginPasswordInput) {
        addPasswordToggle(loginPasswordInput);
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

    // Визуальная индикация пароля (если есть поле пароля и индикатор)
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const { isLengthValid, hasNumber, isValid } = validatePassword(password);
            
            // Обновляем подсказки
            const lengthHint = document.getElementById('length-hint');
            const numberHint = document.getElementById('number-hint');
            
            if (lengthHint) lengthHint.className = isLengthValid ? 'valid' : 'invalid';
            if (numberHint) numberHint.className = hasNumber ? 'valid' : 'invalid';
            
            // Обновляем индикатор сложности
            if (password.length === 0) {
                strengthBar.className = 'password-strength-bar';
            } else if (!isLengthValid) {
                strengthBar.className = 'password-strength-bar weak';
            } else if (!hasNumber) {
                strengthBar.className = 'password-strength-bar medium';
            } else {
                strengthBar.className = 'password-strength-bar strong';
            }
            
            // Изменяем стиль поля
            if (password.length === 0) {
                passwordInput.classList.remove('input-error', 'input-success');
            } else if (isValid) {
                passwordInput.classList.remove('input-error');
                passwordInput.classList.add('input-success');
            } else {
                passwordInput.classList.remove('input-success');
                passwordInput.classList.add('input-error');
            }
        });
    }

    // Переключение между формами
    if (switchToLogin && switchToRegister) {
        switchToLogin.addEventListener('click', function() {
            if (registerForm) registerForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });

        switchToRegister.addEventListener('click', function() {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        });
    }

    // Обработка регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            
            // Валидация пароля
            if (!password || !validatePassword(password).isValid) {
                alert('Пароль должен содержать не менее 5 символов, включая цифры');
                if (passwordInput) passwordInput.focus();
                return;
            }

            // Проверка на существующий email
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(user => user.email === email);
            
            if (existingUser) {
                alert('Пользователь с таким email уже зарегистрирован. Пожалуйста, используйте другой email или войдите.');
                document.getElementById('email').focus();
                return;
            }

            // Сохраняем нового пользователя
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Сохраняем текущего пользователя для отображения в личном кабинете
            localStorage.setItem('user', JSON.stringify({ name, email }));
            
            console.log('Регистрация:', { name, email, password });
            alert('Регистрация успешна! Перенаправляем в личный кабинет...');
            
            // Перенаправление на страницу личного кабинета
            window.location.href = 'account.html';
            
            registerForm.reset();
        });
    }

    // Обработка входа
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            
            // Проверка существования пользователя
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);
            
            if (!user) {
                alert('Неверный email или пароль. Пожалуйста, попробуйте снова.');
                return;
            }
            
            // Сохраняем данные текущего пользователя
            localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
            
            console.log('Вход:', { email, password });
            alert('Вход выполнен успешно! Перенаправляем в личный кабинет...');
            
            // Перенаправление на страницу личного кабинета
            window.location.href = 'account.html';
        });
    }
});