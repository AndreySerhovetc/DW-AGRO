let swiper = new Swiper('.swiper-container', {
    effect: 'fade',
    pagination: {
        el: '.swiper-pagination',
    },
    autoplay: {
        delay: 4500,
        disableOnInteraction: false,
    },
});

//modal
const modalTrigger = document.querySelector('[data-modal]'),
    modal = document.querySelector('.modal'),
    content = document.querySelector('.modal__content');


function openModal() {
    modal.classList.add('show');
    content.classList.add('popupIn');
    modal.classList.remove('hide');
    content.classList.remove('popupOut');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    content.classList.remove('popupIn');
    modal.classList.add('hide');
    content.classList.add('popupOut');
    document.body.style.overflow = '';
}

modalTrigger.addEventListener('click', openModal)

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
        closeModal();
    }
})

//validate
let phoneField = document.querySelector(".phone");
let im = new Inputmask("+38 (099) 999 99 99");
im.mask(phoneField);

new JustValidate('.js-form', {
    rules: {
        name: {
            required: true,
            minLength: 2
        },

        email: {
            required: true,
            email: true
        },

        phone: {
            required: true
        },

        service: {
            required: true
        },

    },
    messages: {
        name: {
            required: "Поле должно быть заполнино",
            minLength: "Имя должно быть больше двух символов"
        },

        email: {
            required: "Поле должно быть заполнино",
            email: "Поле должно содержать знак @"
        },

        phone: {
            required: "Поле должно быть заполнино"
        },

        service: {
            required: "Поле должно быть заполнино"
        },


    },

    submitHandler: function(form) {
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "php/mail.php", true);
        let formData = new FormData(form);

        xhr.addEventListener("load", function() {
            if (xhr.readyState == 4) {
                switch (xhr.status) {
                    case 200:
                        {
                            console.log("Все харашо");
                            form.reset();
                            break;
                        }
                    case 301:
                        {
                            console.log("Нас перенаправили");
                            break;
                        }
                    case 404:
                        {
                            console.log("Мы ничего не найшли");
                            break;
                        }
                    default:
                        console.log("Ошибка!");
                        break;
                }
            }
        })

        xhr.send(formData);

    },
});
//burger 

let burgerButton = document.querySelector('.burger-menu__button'),
    burgerLine = document.querySelector('.burger-menu__line'),
    burgerMenu = document.querySelector('.burger-menu'),
    burgerList = document.querySelector('.burger-menu');


burgerButton.addEventListener('click', function() {
    burgerButton.classList.toggle('active');
    burgerLine.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    // burgerList.classList.toggle('active');
    if (burgerList.classList.contains('active')) {
        burgerList.style.maxHeight = burgerList.scrollHeight + "px";
    } else {
        burgerList.style.maxHeight = 0;
    }

});
//change lng

const select = document.querySelector('.select-lng')
allLeng = ['en', 'ru', 'ua'];

select.addEventListener('change', changeURLLaguage);



function changeURLLaguage() {
    let lang = select.value;
    localStorage.setItem('lang', lang);
    location.href = window.location.pathname + '#' + lang;
    location.reload();

}

function changeLanguage() {
    let hash = localStorage.getItem('lang');
    console.log(hash);

}