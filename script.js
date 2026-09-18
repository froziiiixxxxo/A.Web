// ============================================
// Мобильное меню
// ============================================

const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = burger.classList.contains('active') ? 'hidden' : '';
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// Скрытие шапки при скролле вниз
// ============================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else if (currentScroll < lastScroll) {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ============================================
// Анимация появления элементов при скролле
// ============================================

const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ============================================
// FAQ аккордеон
// ============================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Закрываем все открытые элементы
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Открываем текущий, если он был закрыт
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// Плавная прокрутка к якорям
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Игнорируем пустые якори
        if (href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Добавление активного класса для навигации
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const highlightNav = () => {
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--color-primary)';
                } else {
                    link.style.color = '';
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ============================================
// Параллакс эффект для главного экрана (отключен)
// ============================================

// Эффект отключен, чтобы фото оставалось на месте

// ============================================
// Загрузка изображений с эффектом
// ============================================

const images = document.querySelectorAll('img');

images.forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });

    // Если изображение уже загружено (из кэша)
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    }
});

// ============================================
// Предотвращение мерцания при загрузке
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ============================================
// Обработка ошибок загрузки изображений
// ============================================

images.forEach(img => {
    img.addEventListener('error', () => {
        // Создаем placeholder для отсутствующего изображения
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = '#fff';
        placeholder.style.fontSize = '14px';
        placeholder.style.fontWeight = '600';
        placeholder.textContent = 'Изображение';

        img.parentNode.style.position = 'relative';
        img.style.display = 'none';
        img.parentNode.appendChild(placeholder);
    });
});

// ============================================
// Кастомный курсор для карточек работ (опционально)
// ============================================

const workCards = document.querySelectorAll('.work-card');

workCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.cursor = 'pointer';
    });

    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('work-card__link')) {
            const link = card.querySelector('.work-card__link');
            if (link) {
                link.click();
            }
        }
    });
});

// ============================================
// Дополнительная анимация для статистики
// ============================================

const stats = document.querySelectorAll('.stat__number');
let animated = false;

const animateStats = () => {
    if (animated) return;

    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    const sectionTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75) {
        animated = true;

        stats.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const number = parseInt(text.replace(/\D/g, ''));

            let current = 0;
            const increment = number / 50;
            const duration = 1500;
            const stepTime = duration / 50;

            const counter = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(counter);
                }

                let displayValue = Math.floor(current);
                if (hasPlus) displayValue += '+';
                if (hasPercent) displayValue += '%';

                stat.textContent = displayValue;
            }, stepTime);
        });
    }
};

window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

// ============================================
// Console message
// ============================================

console.log('%c👋 Привет!', 'font-size: 24px; font-weight: bold; color: #7c3aed;');
console.log('%cЭтот сайт разработан с использованием Claude AI', 'font-size: 14px; color: #64748b;');
console.log('%cХочешь такой же? Напиши мне: https://t.me/froziiiixxxxo', 'font-size: 14px; color: #7c3aed;');
