import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initHeaderScroll() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('#hero');

    if (!header || !hero) return;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    let lastScroll = 0;
    let isHidden = false;

    const showHeader = () => {
        if (!isHidden) return;
        isHidden = false;

        gsap.to(header, {
            yPercent: 0,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const hideHeader = () => {
        if (isHidden) return;
        isHidden = true;

        gsap.to(header, {
            yPercent: -100,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    // 1️⃣ Desktop: absolute → fixed после hero
    if (isDesktop) {
        ScrollTrigger.create({
            trigger: hero,
            start: 'bottom top',
            onEnter: () => {
                header.classList.add('is-fixed');
                gsap.set(header, {
                    yPercent: -100,
                });
                showHeader();
            },
            onLeaveBack: () => {
                header.classList.remove('is-fixed');
                gsap.set(header, {
                    yPercent: 0,
                });
                showHeader();
            },
        });
    }

    // 2️⃣ Скрытие / показ по направлению скролла
    ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: self => {
            const current = self.scroll();

            // пока в hero — всегда показываем
            if (current <= hero.offsetHeight) {
                showHeader();
                lastScroll = current;
                return;
            }

            if (current > lastScroll) {
                hideHeader(); // вниз
            } else {
                showHeader(); // вверх
            }

            lastScroll = current;
        },
    });
}

initHeaderScroll();


function initFixedButton() {
    const button = document.querySelector('.fixedButton');
    if (!button) return;

    // начальное состояние (скрыта)
    gsap.set(button, {
        y: 80,
        opacity: 0,
        pointerEvents: 'none',
    });

    ScrollTrigger.create({
        start: () => `${150 * (window.innerHeight / 100)}px top`,
        end: 'max',

        onEnter: () => {
            gsap.to(button, {
                y: 0,
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.4,
                ease: 'power2.out',
            });
        },

        onLeaveBack: () => {
            gsap.to(button, {
                y: 80,
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.3,
                ease: 'power2.in',
            });
        },
    });
}

initFixedButton();
