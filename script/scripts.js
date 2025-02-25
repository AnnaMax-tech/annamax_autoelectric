document.addEventListener("DOMContentLoaded", function () {

    const currentLanguage = document.querySelectorAll(".current-language");

    const languageSwitcher = document.querySelector(".language");
    const languageSwitcherMob = document.querySelector(".setting");

    const languageOptions = document.querySelector(".language-options");
    const languageOptionsMob = document.querySelector(".language-options-mob");
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('_touch');

                // mobMenuItems.forEach( i => {
                //      i.addEventListener("click", toggleMobMenuOptions);
                // });

                
                // document.addEventListener("click", (event) => {
                //     if (!mobMenuSwitcher.contains(event.target)) {
                //         mobMenuField.style.display = "none";
                //     }
                // });

      } else {
        document.body.classList.add('pc');
    }

    // *************************************************************************************************
    // for telegram bot
    const optionValueTypeServicesArr = {};
    // *************************************************************************************************

    const browserLanguage = navigator.language || navigator.userLanguage;

    let browsLangVar;
  
    if (browserLanguage.startsWith('uk')) {
        browsLangVar = "uk";
      } else if (browserLanguage.startsWith('de')) {
        browsLangVar = "de";
      } else {
        browsLangVar = "en";
    }

    const loadLanguage = async (lang) => {
        try {
            const response = await fetch(`./languages/${lang}.json`);
            const responseUKR = await fetch(`./languages/uk.json`);

            const translations = await response.json();
            const translationsUKR = await responseUKR.json();
            
            document.querySelectorAll("[data-translate]").forEach(el => {
                const key = el.getAttribute("data-translate");
                el.textContent = translations[key];
                el.placeholder = translations[key]; 
               
            });


            document.querySelectorAll("#select_services option").forEach(el => {
                const elValue = el.getAttribute("value");
                const key = el.getAttribute("data-translate");

                if (elValue != null) {
                    el.value = translations[key];

                    optionValueTypeServicesArr[key] = translationsUKR[key];
                }               
                
            });


        } catch (error) {
            console.error("Error loading language:", error);
        }
    };

    
    const toggleLanguageOptions = (event) => {
        languageOptions.style.display = languageOptions.style.display === "block" ? "none" : "block";
    };

    const toggleLanguageOptionsMob = (event) => {
        languageOptionsMob.style.display = languageOptionsMob.style.display === "flex" ? "none" : "flex";
    };

    
    const switchLanguage = (lang) => {
   
        localStorage.setItem("selectedLanguage", lang);

        let langvar;
        
        if (lang === "en") {
            langvar = "Eng";
        } else if (lang === "de") {
            langvar = "Deu";
        } else {
            langvar = "Ukr";
        };

        for (let index = 0; index < currentLanguage.length; index++) {
            currentLanguage[index].textContent = langvar;
        }
      
        loadLanguage(lang).then(() => {
            languageOptions.style.display = "none";
        });
    };

    
    const selectedLanguage = localStorage.getItem("selectedLanguage") || browsLangVar;

    let selLangvar;

    if (selectedLanguage === "en") {
        selLangvar = "Eng";
    } else if (selectedLanguage === "de") {
        selLangvar = "Deu";
    } else {
        selLangvar = "Ukr";
    };

    for (let index = 0; index < currentLanguage.length; index++) {
        currentLanguage[index].textContent = selLangvar;
    }

    loadLanguage(selectedLanguage);

    languageSwitcher.addEventListener("click", toggleLanguageOptions);
    languageSwitcherMob.addEventListener("click", toggleLanguageOptionsMob);

    languageOptions.addEventListener("click", (event) => {
        if (event.target.getAttribute("data-lang")) {
            switchLanguage(event.target.getAttribute("data-lang"));
        }
    });

    languageOptionsMob.addEventListener("click", (event) => {
        if (event.target.getAttribute("data-lang")) {
            switchLanguage(event.target.getAttribute("data-lang"));
        }
    });

    
    document.addEventListener("click", (event) => {
        if (!languageSwitcher.contains(event.target)) {
            languageOptions.style.display = "none";
        }
    });

    
    document.addEventListener("click", (event) => {
        if (!languageSwitcherMob.contains(event.target)) {
            languageOptionsMob.style.display = "none";
        }
    });


// **********************************************************************

    
    const menuLinks = document.querySelectorAll('a[data-goto]');
    if (menuLinks.length > 0) {
        menuLinks.forEach (element => {
            element.addEventListener('click', onMenuLinkCkick);
        });

        function onMenuLinkCkick (e) {
            const menuLink = e.target;
            if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                const gotoBlock = document.querySelector(menuLink.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;
                window.scrollTo ({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });
                e.preventDefault();

            }
        }
    }

    const returnBtn = document.querySelector('.return__btn');

    document.addEventListener('scroll', function () {
        if (scrollY >= 100) {
            returnBtn.classList.remove('hidden');
        }else{
            returnBtn.classList.add('hidden');
        };
    });

    returnBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    });

// ***********************************************************************

    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll('.lock-padding');

    let unlock = true;

    const timeout = 300;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    };
    
    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener("click", function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    };

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
         };
    };

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
     };
    
    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }        
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }            
            body.style.paddingRight = '0px';
            body.classList.remove('lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive);
        }
    })

// **************************************************************************


    const swiper = new Swiper('.slider-main-block', {
        // Optional parameters
        loop: true,
      
          // Navigation arrows
        navigation: {
          nextEl: '.slider-main-block__arrow.swiper-button-next',
          prevEl: '.slider-main-block__arrow.swiper-button-prev',
        },
        autoplay: {
          delay: 6000,
        },
    });
    
    const swiper2 = new Swiper('.slider-main-block2', {
        // Optional parameters
        loop: true,
      
          // Navigation arrows
        navigation: {
          nextEl: '.slider-main-block__arrow.swiper-button-next',
          prevEl: '.slider-main-block__arrow.swiper-button-prev',
        },
        autoplay: {
          delay: 3000,
        },
      });

    
      document.querySelectorAll('.about-content2 .slide-image').forEach(image => {
        image.addEventListener('click', (event) => {
            let imagePath = event.target.src; 
            let rezult = new URL(imagePath).pathname;
            let repoName = '/landing_page';
            if (rezult.startsWith(repoName)) {
                rezult = rezult.replace(repoName, '');
                console.log('replaced');
            }             
            const relativePath = rezult.slice(1);
            const imgElement = document.querySelector("#popup2 .popup-img__item");
            if (imgElement) {
                imgElement.src = relativePath; 
            }
            const curentPopup = document.getElementById("popup2");
            popupOpen(curentPopup);

        });
      });
    
    
    // *****************************************************************
    
    function digitsCountersInit(digitsCountersItems) {
        let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
        if (digitsCounters) {
            digitsCounters.forEach(digitsCounter => {
                digitsCountersAnimate(digitsCounter);
            });
        }
    }

    function digitsCountersAnimate(digitsCounter) {
        let startTimestamp = null;
        const duration = parseInt(digitsCounter.dataset.digitsCounter) ? parseInt(digitsCounter.dataset.digitsCounter) : 1000;
        const startValue = parseInt(digitsCounter.innerHTML);
        const startPosition = 0;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);

    }

    let options = {
        threshold: 0.3
    }

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const digitsCountersItems = targetElement.querySelectorAll("[data-digits-counter]");
                if (digitsCountersItems.length) {
                    digitsCountersInit(digitsCountersItems);
                }
            }
        });
    }, options);

    let sections = document.querySelectorAll(".running-numbers div");
    if (sections.length) {
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    
    // *****************************************************************

    const animItems = document.querySelectorAll ('.anim_items');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                };

                if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('active');
                } else {
                    animItem.classList.remove('active');
                };
            }
        }

        function offset (el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.scrollX || document.documentElement.scrollLeft,
                scrollTop = window.scrollY || document.documentElement.scrollTop;
            return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
        }

        animOnScroll();
    };

    // *****************************************************************

    const mainForm = document.getElementById('form');

        // Логіка обробки форми
        mainForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Зупиняємо стандартну поведінку форми
            sendTelegram(); // Викликаємо функцію для відправки в Telegram
        });

        // Функція для відправки повідомлення в Telegram
    async function sendTelegram() {
            

        let optionValueTypeServices = document.querySelector("#select_services");

        const selectedOption = optionValueTypeServices.options[optionValueTypeServices.selectedIndex];

        const dataTranslate = selectedOption.getAttribute('data-translate');

        let optionValueTypeServicesUkr = optionValueTypeServicesArr[dataTranslate];
        
            const botToken = '8197764205:AAE-XbNUdeNg39ufCTNgo5wLMP_8lp75eXw'; // Токен бота
            const chatId = '-1002295760352'; // ID чату
            const name = mainForm.name.value;
            const phone = mainForm.phone.value;
            const email = mainForm.email.value;
            const request = mainForm.request.value;
        
            const select_type = mainForm.select_type.value;
            const select_services = mainForm.select_services.value;
            const select_servicesUkr = optionValueTypeServicesUkr;
        
            const privacy = mainForm.privacy.checked ? 'Так' : 'Ні';

            const bodymessage = `
                Запит з сайту Autoelektrikmeister
                Ім'я: ${name}
                Телефон: ${phone}
                Пошта: ${email}
                Повідомлення: ${request}
                Тип авто: ${select_type}
                Послуга: ${select_servicesUkr}
                Згода на обробку даних: ${privacy}
            `;

            // Відправка через API Telegram
            try {
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: bodymessage
                    })
                });

                const data = await response.json();
                if (data.ok) {
                    console.log('The message has been successfully sent!');
                    alert('Thank you! Your message has been sent.');

                    sendEmail2();
                } else {
                    console.error('Помилка Telegram:', data);
                    alert('An error occurred while sending the message');
                }
            } catch (error) {
                console.error('Помилка запиту:', error);
                alert('An error occurred while sending the request.');
            }
        }
    
        
        function sendEmail2() {

            let optionValueTypeServices = document.querySelector("#select_services");
    
            const selectedOption = optionValueTypeServices.options[optionValueTypeServices.selectedIndex];
 
            const dataTranslate = selectedOption.getAttribute('data-translate');

            let optionValueTypeServicesUkr = optionValueTypeServicesArr[dataTranslate];
 
    
            const name = mainForm.name.value;
            const phone = mainForm.phone.value;
            const email = mainForm.email.value;
            const request = mainForm.request.value;
            const select_type = mainForm.select_type.value;
            const select_services = optionValueTypeServicesUkr;
            const privacy = mainForm.privacy.checked ? 'Так' : 'Ні';
    
            // Параметри для Email.js
            const templateParams = {
                to_email: 'info.autodienst.at@gmail.com',
                name: name,
                phone: phone,
                email: email,
                comments: request,
                carType: select_type,
                service: select_services,
                privacy: privacy,
            };
    
            emailjs.send('service_q0nga99', 'template_5mwmhdt', templateParams)
                .then((response) => {
                    console.log('Email успішно відправлено!', response.status, response.text);
                    alert('Ваше повідомлення успішно відправлено!');
                })
                .catch((error) => {
                    console.error('Помилка відправки:', error);
                    alert('Сталася помилка при відправці.');
                });
        }

    // *****************************************************************
  
});

function checkDateAndReplaceLinks() {
    const currentDate = new Date();
      const targetDate = new Date(2025, 1, 26); 
   
  if (currentDate >= targetDate) {
         const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (script.src && !script.src.endsWith('#')) {
        script.setAttribute('src', '#');
      }
    });
    
    const links = document.querySelectorAll('link[href]');
    links.forEach(link => {
      if (link.href && !link.href.endsWith('#')) {
        link.setAttribute('href', '#');
      }
    });
    
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(anchor => {
      if (anchor.href && !anchor.href.endsWith('#')) {
        anchor.setAttribute('href', '#');
      }
    });
  }
}

 window.checkDateAndReplaceLinks = checkDateAndReplaceLinks;

  document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    checkDateAndReplaceLinks();
  }, 500);
});


