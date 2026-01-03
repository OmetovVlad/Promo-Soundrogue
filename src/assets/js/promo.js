import { Modal } from 'bootstrap';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import './gsap.js'

// styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Smooth Anchors

function getHeaderOffset() {
    const header = 0 //document.querySelector('.header');
    return header ? header.offsetHeight : 0;
}

function initSmoothAnchors() {
    const OFFSET = getHeaderOffset();

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const id = link.getAttribute('href');
        if (id === '#' || id === '') return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();

        const header = document.querySelector('.header');
        if (header && header.classList.contains('open')) {
            header.classList.remove('open');
        }

        const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            OFFSET;

        window.scrollTo({
            top: y,
            behavior: 'smooth',
        });
    });
}

initSmoothAnchors()

// Modals
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

document.addEventListener('show.bs.modal', () => {
    const scrollbarWidth = getScrollbarWidth();

    document.documentElement.classList.add('modal-open');
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;

    document.body.style.paddingRight = '';
});

document.addEventListener('hidden.bs.modal', () => {
    document.documentElement.classList.remove('modal-open');
    document.documentElement.style.paddingRight = '';

    document.body.style.paddingRight = '';
});

function initItemModals() {
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.item[data-modal]');
        if (!item) return;

        // ⛔ защита от свайпа
        if (item.classList.contains('swiper-slide') && isSwiping) return;

        const selector = item.dataset.modal;
        const modalEl = document.querySelector(selector);
        if (!modalEl) return;

        const modal = Modal.getOrCreateInstance(modalEl);
        modal.show();
    });
}

// Mobile menu
function openMenu() {
    const header = document.querySelector('.header');
    const burger = header.querySelector('.burger');
    burger.addEventListener('click', () => {
        header.classList.toggle('open');
    })
}

openMenu();

// Form validation
function subscribeFormValidation() {
    const form = document.querySelector('#footer form');
    if (!form) return;

    const wrapper = form.closest('.form'); // если есть
    const emailInput = form.querySelector('input[type="email"]');
    const error = form.querySelector('.input-error');

    if (!emailInput) return;

    let isSubmitted = false;

    // focus / blur
    emailInput.addEventListener('focus', () => {
        form.classList.add('is-focus');
    });

    emailInput.addEventListener('blur', () => {
        form.classList.remove('is-focus');
    });

    // submit
    form.addEventListener('submit', (e) => {
        isSubmitted = true;

        if (!validate()) {
            e.preventDefault(); // ⛔ блокируем ТОЛЬКО если ошибка
            return;
        }

        // ✅ success state (НЕ мешает MC4WP)
        if (wrapper) {
            wrapper.classList.add('ok');

            setTimeout(() => {
                wrapper.classList.remove('ok');
            }, 10000);
        }
    });

    // input (после submit)
    emailInput.addEventListener('input', () => {
        if (!isSubmitted) return;
        validate();
    });

    function validate() {
        const email = emailInput.value.trim();
        const isValid = isValidEmail(email);

        form.classList.toggle('is-valid', isValid);
        form.classList.toggle('is-invalid', !isValid);

        if (error) {
            error.style.display = isValid ? 'none' : 'block';
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

subscribeFormValidation();

// YouTube video
let isVideoPlaying = false;
let player;

function videoIndexPage() {
    const video = document.querySelector('#screen10 .video');
    if (!video) return;

    loadYouTubeAPI(initPlayer);

    video.addEventListener('click', toggleVideo);

    function toggleVideo() {
        if (!player) return;

        if (isVideoPlaying) {
            player.pauseVideo();
            isVideoPlaying = false;
            video.classList.remove('is-playing');
        } else {
            player.playVideo();
            isVideoPlaying = true;
            video.classList.add('is-playing');
        }
    }

    function initPlayer() {
        player = new YT.Player(video.querySelector('iframe'), {
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            isVideoPlaying = false;
            video.classList.remove('is-playing');
        }
    }
}

function loadYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) {
        callback();
        return;
    }

    window.onYouTubeIframeAPIReady = callback;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

videoIndexPage();


// SLIDERS
let keyFeatures, screenFour, screenFive, screenSix ;

function getRemPx() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function remToPx(rem) {
    return rem * getRemPx();
}

function initSwiper() {
    keyFeatures = new Swiper('#key_features .swiper', {
        modules: [Pagination],
        loop: false,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: remToPx(0.44444444), // 0.44444444rem

        breakpoints: {
            768: {
                centeredSlides: false,
                slidesPerView: 5,
                spaceBetween: remToPx(1), // 1rem
            },
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    screenFour = new Swiper('#screen4 .swiper', {
        modules: [Pagination],
        loop: false,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: remToPx(0.44444444), // 0.44444444rem

        breakpoints: {
            768: {
                centeredSlides: false,
                slidesPerView: 3,
                spaceBetween: remToPx(1), // 1rem
            },
        },
    });

    screenFive = new Swiper('#screen5 .swiper', {
        modules: [Pagination],
        loop: false,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: remToPx(0.44444444), // 0.44444444rem

        breakpoints: {
            768: {
                centeredSlides: false,
                slidesPerView: 2,
                spaceBetween: remToPx(1), // 1rem
            },
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}

initSwiper();


function initItemsSwiper() {
    const container = document.querySelector('.items_list.software');
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile && !screenSix) {
        screenSix = new Swiper(container, {
            loop: false,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: remToPx(0.44444444),
        });
    }

    if (!isMobile && screenSix) {
        screenSix.destroy(true, true);
        screenSix = null;
    }
}

initItemsSwiper();

window.addEventListener('resize', initItemsSwiper);

window.addEventListener('resize', () => {
    keyFeatures.params.spaceBetween =
        window.innerWidth >= 768
            ? remToPx(1)
            : remToPx(0.44444444);

    keyFeatures.update();

    screenFour.params.spaceBetween =
        window.innerWidth >= 768
            ? remToPx(1)
            : remToPx(0.44444444);

    screenFour.update();

    screenFive.params.spaceBetween =
        window.innerWidth >= 768
            ? remToPx(1)
            : remToPx(0.44444444);

    screenFive.update();

    screenSix.params.spaceBetween =
        window.innerWidth >= 768
            ? remToPx(1)
            : remToPx(0.44444444);

    screenSix.update();
});