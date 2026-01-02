import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

// styles (ВАЖНО)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function subscribeFormValidation() {
    const form = document.getElementById('subscribe-form');
    if (!form) return;

    const wrapper = form.closest('.form');
    const emailInput = form.querySelector('input[type="email"]');
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
        e.preventDefault();
        isSubmitted = true;

        if (validate()) {
            // ✅ добавляем ok
            if (wrapper) {
                wrapper.classList.add('ok');

                setTimeout(() => {
                    wrapper.classList.remove('ok');
                }, 10000);
            }

            form.submit(); // стандартная отправка
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
let keyFeatures, screenFour, screenFive;

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
});