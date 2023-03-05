$(function () {
    let timerStarted = 0;
    let bg;
    let checked = 0;
    let timer = 59; // задає час для таймера 1хв.
    let timerId;
    const arr = $('#left>li');
    $('.list').sortable({});

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // масив для перевірки результату

    //При натисканні на кнопку старт
    $('#start').on('click', function () {
        $('#checkResult').attr('disabled', false);
        // якщо тай мер не запущено тоді
        if (timerStarted == 0) {
            startTimer(); // старт таймера
            timerStarted = 1; // вказуєм що таймер запущено
            $(this).attr('disabled', true); // деактивація кнопки старт
        }
    });

 // Відкриття модального вікна для перевірки результату 
    $('#checkResult').click(function () {
        $('#cancel').css('display', 'inline');
        $('#check').css('display', 'inline');
        $('.modal-container').fadeIn(300);
        $('#haveTime').css('display', 'block');
        // якщо результат не визначено
        if (checked == 0) {
            $('#haveTime').css('display', 'block'); // показуєм блок перевірки 
        }
    });
 // Натискання кнопки відміна при перевірці 
    $('#cancel').click(function () {
        $('.modal-container').fadeOut(300); // закриває модальне вікно перевірки
    });
// завершення гри і ресет таймера
    $('#close').click(function(){
        $('.timer').text('01:00');
        $('#checkResult').attr('disabled', true);
        $('#start').attr('disabled', false);
        clearInterval(timerId);
        $('#success').css('display', 'none');
        $('#lost').css('display', 'none');
        $(this).css('display', 'none');
        $('.modal-container').fadeOut(300);
    });
// перевірка правильності результату
    $('#check').on('click', function () {
        $('#close').css({
            display: 'block',
            marginLeft: '300px',
        });
        $('#cancel').css('display', 'none');
        $(this).css('display', 'none');
        let arr = $('#right>li'); // визначення масиву для перевірки (правий список елементів)
        /* якщо к-сть ел. з права відповідає потрібній кількості і перевірка поки що не робилась 
        тоді робимо превірку */
        if (arr.length == numbers.length && checked == 0) {
            for (let i = 0; i < arr.length; i++) {
                //перевірка по внутрішньому тексту елемента, можна і з допомогою додаткового атрибута
                if (arr.eq(i).text() == numbers[i]) {
                    checked = 1; // перевірку пройдено
                } 
                else {
                    checked = 0; // не відповідність завершення перевірки
                    break;
                }
            }
        }
        // обробка помилки
        if (checked == 0) {
            $('#success').css('display', 'none');
            $('#haveTime').css('display', 'none');
            $('#lost').css('display', 'block');
            clearInterval(timerId);
            timerStarted = 0;
            timer = 59;
            checked = 0; 
        } // обробка рузультату
        else {
            $('#success').css('display', 'block');
            $('#close').css({
                display: 'block',
                marginLeft: '300px',
            });
            $('#cancel').css('display', 'none');
            $('#check').css('display', 'none');
            $('#haveTime').css('display', 'none');
            $('#lost').css('display', 'none');
            clearInterval(timerId);
            timerStarted = 0;
            timer = 59;
            checked = 0;
        }
    });

    // При натисканні на кнопку нова гра   
    $('#new').on('click', function () {
        $('#left>li').css('opacity', 1) // повертаем прозорість якщо елемент було заблоковано
        $('#left>li').css('background', '') // Очистка фону якщо був заданий
        $('#start').attr('disabled', false); // розблокування кнопи почити гру
        $('#checkResult').attr('disabled', true); // блокування кнопки перевірки результату
        $('.timer').text('01:00'); // скидання відображення таймера на екрані
        clearInterval(timerId); // очистка таймера
        timerStarted = 0; // очистка лічильника запуска тацмера
        timer = 59; // встановлення нового часу для таймера
        checked = 0; // скидання результату перевірки 

        // перемішування слайдів у масиві
        let random = arr.sort(() => {
            return (Math.random() - 0.5) 
        });

        for (let i = 0; i < random.length; i++) {
            $('#left').append(random[i]); // додаєм перемішані елементи на сторінку
        }
        //скидання стилів елементів правої частини
        for (let i = 0; i < $('#left>li').length; i++) {
            $('#right>li').eq(i).css('background', 'none');
            $('#right>li').eq(i).text('');
        }
    });

    // Отримання властивостей елемента з лівої частини для передачі іх елементу правої частини
    $('#left>li').draggable({
        revert: true,
        distance: 10, // старт зміщення 
        start: function () {
            checked = 0; // скидання результату якщо перед стартом не було натиснуто кнопку старт
            $('#checkResult').attr('disabled', false);
            // якщо гра не була стартована тоді стартуємо
            if (timerStarted == 0) {
                startTimer();
                timerStarted = 1;
                $('#start').attr('disabled', true);
            }
            bg = $(this).css('background'); // передача власної властивості в глобальну змінну
            textContent = $(this).text(); // передача власної властивості в глобальну змінну
            /* тобто при drag ми лише записали потрібні дані в змінні які потім при drop запишемо 
            в наведений елемент */
        }
    });

    // Установка властивостей елементам правої частини гри
    $('#right>li').droppable({
        accept: '#left>li', // вказуєм від кого отримуєм дані
        hoverClass: 'active', // клас при наведенні
        /* у функцію передаємо клітинку в яку будем передавати значення властивостей, 
        а також елемент який передає властивості */
        drop: function (event, ui) {
            // при дропі якщо фон не задано тоді
            if ($(this).css('background').includes("none")) {
                // значить клітинка порожня встановлюєм нові властивості
                // блокуєм елемент (з лівої частини) який передав властивість
                ui.draggable[0].style.opacity = '0'; 
                ui.draggable[0].style.background = 'none'; // // блокуєм елемент який передав властивість
                event.target.style.background = bg; // передача властивості елементу з правої частини
                event.target.textContent = textContent; // передача властивості елементу з правої частини
            } 
            else {
                // Коли наведена клітинка уже заповнена тоді додаємо елемент в кінець
                for (let i = 0; i < $('#right>li').length; i++) {
                    // шукаємо першу не заповнену і записуємо в неї дані властивості
                    if ($('#right>li').eq(i).css('background').includes("none")) {
                        ui.draggable[0].style.background = 'none';
                        ui.draggable[0].style.opacity = '0';
                        $('#right>li').eq(i).css('background', bg);
                        $('#right>li').eq(i).text(textContent);
                        break;
                    }
                }
            }
        }
    });
    
    // Реалізація таймера
    function startTimer() {
        timerId = setInterval(function () {
            if (timer >= 60) {
                $('.timer').html('00:' + timer); // основний таймен html
                $('.haveTime').html('00:' + timer); // таймер блока перевірки результату
                timer--;
            } 
            else {
                if (timer < 10)
                {
                    $('.timer').html('00:0' + timer);
                } 
                else {
                    $('.timer').html('00:' + timer);
                }
                timer--;
            };
            // якщо вийшов час або результат ройшов перевірку тоді
            if (timer < 0 || checked == 1) {
                clearInterval(timerId); // зупиняємо відлік
                $('.modal-container').fadeIn(300); // показуємо модалку
                $('#success').css('display', 'none');
                $('#haveTime').css('display', 'none');
                $('#lost').css('display', 'block'); // 
                $("#close").css({
                    display: 'block',
                    marginLeft: '300px',
                });
                $("#check").css('display', 'none');
                $("#cancel").css('display', 'none');
                timerStarted = 0;
                timer = 59;
                checked = 0;
            };
            if (checked == 1) {
                clearInterval(timerId);
            }
        }, 1000);
    }
});