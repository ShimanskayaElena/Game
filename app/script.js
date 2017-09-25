'use strict';  
// Был применён шаблон проектирования - "Посредник"

// какое-либо приложение, например - игра    
var GAME = GAME || {}; // глобальный объект
    
// шаблон создания пространства имён    
GAME.namespace = function (ns_string) {
    var parts = ns_string.split('.'), // преобразование строки в массив
        parent = GAME,
        i;

    // отбрасываем начальный префикс - имя глобального объекта
    if (parts[0] === "GAME") {
        parts = parts.slice(1); // копирование массива начинается со второго элемента
    }

    for (i = 0; i < parts.length; i += 1) {
        // создать сойство, если оно отсутствует
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {}; // 'GAME.modules'
        }
        parent = parent[parts[i]]; // 'GAME.modules.airport'
    }
    return parent;
}; // end of the template creating a namespace
       
// один из возможных модулей
var airport = GAME.namespace('GAME.modules.airport');    

// определение модуля - шаблон "Модуль"     
airport = (function(){   
    
    // частное свойство - очередь из самолётом, ожидающих разрешения на взлёт
    let stackAircrafts = [];  
    
    // реализация процедуры инициализации - создание представления самолётов в виде набора кнопок      
    let div = ( function() {
   
        var div, input, frag; 
        frag = document.createDocumentFragment();
        div = document.createElement('div');
    
        for (let i=1; i<8; i++) {
            input = document.createElement('input');
            input.setAttribute('id', 'aircraft_' + i);
            input.setAttribute('value', 'start Aircraft_' + i);
            input.setAttribute('type', 'button');
            div.appendChild(input);
        }
        frag.appendChild(div);
        document.body.appendChild(frag);   
        return div; 
    }());    
    
    // взлётная полоса
    let runway = {
        // характеристика доступности взлётной полосы 
        access: true, // изначально свободная
        // изменение доступности взлётной полосы
        changeAccessibility: function() {
            this.access = !this.access;
        }
    };  
        
    // самолёт, который отправили на взлёт
    let aircraft = {
        id: 0, 
        getId: function() {
            // исходный элемент, на котором произошло событие   
            event = event || window.event; //  для IE<9
            let target = event.target || event.srcElement;
            return this.id = target.id;  
        }
    };
 
    // экран 
    let screen = {
        setMessage: function(msg, color) {
            let div = document.createElement('div'); 
            div.style.color = color || '#000';
            div.style.marginTop = '10px';
            div.innerHTML = msg;
            document.body.appendChild(div);
        }
    };        
        
    // объект-посредник
    let mediator = {
        // разрешить взлёт самолёта
        allow: function() {   
            // определяем номер самолёта, который отправили на взлёт
            aircraft.getId();
            // проверяем состояние взлётной полосы
            if (runway.access) {
                document.getElementById(aircraft.id).style.visibility = 'hidden';
                // даём разрешение на взлёт  
                takeoff.allow(aircraft.id);
                screen.setMessage('Самолёт  ' + aircraft.id + '  находиться на взлётной полосе.', 'green');
                // изменяем состояние взлётной полосы
                runway.changeAccessibility();
            } 
            else {
                screen.setMessage('Взлётная полоса занята, необходимо подождать.', 'red');
                // формируем очередь из самолётов, ожидающих разрешения на взлёт
                stackAircrafts.push(aircraft.id);
                document.getElementById(aircraft.id).style.visibility = 'hidden'; 
                screen.setMessage('Самолёт ' + aircraft.id + ' ожидает своей очереди взлететь.');
            }
        },
    
        // изменяем состояние взлётной полосы
        changeAccessibility: function(aircraft) { 
            screen.setMessage('Самолёт  ' + aircraft + '  взлетел!', 'green');
            runway.changeAccessibility();

            if (stackAircrafts.length) {
                screen.setMessage('самолёты, ожидающие разрешения на взлёт: ' + stackAircrafts);
                // изменяем состояние взлётной полосы и извлекаем из очереди первый самолёт
                runway.changeAccessibility();
                let aircraft = stackAircrafts.shift(); 
                // и отправляем его на взлёт
                screen.setMessage('самолёт  ' + aircraft + '  находиться на взлётной полосе.', 'green');
                takeoff.allow(aircraft);
                return stackAircrafts;
            } else {
                screen.setMessage('взлётная полоса свободна!', 'green');
            }
        }
    }; // end mediator

    // объект - пилот
    let takeoff = {
        // взлёт самолёта
        allow: function(craft) {
            let promise = new Promise((resolve, reject) => {

                setTimeout((craft) => {
                    let result = craft;
                    resolve(result);
                }, 10000);
            });
            promise
                .then( 
                    result => { // result - аргумент resolve
                        // взлётная полоса становится свободной
                        mediator.changeAccessibility(craft);
                    },
                    error => {
                        console.log(takeoff.error + ' - ошибка при взлёте самолёта!');
                    });
        } 
    }; // end takeoff
    // шаблон открытия модуля
    return {
        div : div, // интерфейс игры
        allow : mediator.allow // реакции на возможные действия пользователя
    };    
  
}()); // end of the template "Module"   
    
// если диспетчер разрешил взлёт самолёта
airport.div.addEventListener('click', airport.allow, false);
