// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Резервные отзывы, если в Firestore пока пусто
const fallbackReviews = [
  {
    id: "seed-1",
    name: "Анастасия",
    text: "Спасибо большое за образ — макияж выглядел естественно и продержался до поздней ночи.",
  },
  {
    id: "seed-2",
    name: "Екатерина",
    text: "Чувствовала себя настоящей принцессой. Макияж и причёска выдержали и ветер, и дождь.",
  },
  {
    id: "seed-3",
    name: "Мария",
    text: "Образ получился именно таким, как я мечтала — гармонично и очень нежно.",
  },
];

// Вынес галерею и сертификаты ЗА компонент, чтобы они не создавались при каждом рендере
const GALLERY_IMAGES = Array.from({ length: 50 }, (_, i) => ({
  src: `/img/gallery-${i + 1}.jpg`,
  alt: `Работа ${i + 1}`,
}));

const CERTIFICATE_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `/img/cert-${i + 1}.jpg`,
  alt: `Сертификат ${i + 1}`,
}));

function App() {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12); // сколько фото показываем в галерее
  const currentYear = new Date().getFullYear();
  const [menuOpen, setMenuOpen] = useState(false);

  // Анимация появления секций при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".reveal-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Подписка на отзывы из Firestore
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(list);
    });

    return () => unsubscribe();
  }, []);

  // Отправка отзыва в Firestore
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const message = form.message.value.trim();

    if (!message) return;

    try {
      await addDoc(collection(db, "reviews"), {
        name: name || "Гость",
        contact: contact || "",
        text: message,
        createdAt: serverTimestamp(),
      });

      form.reset();
      alert("Спасибо за отзыв! Он появится на странице через пару секунд.");
    } catch (error) {
      console.error("Ошибка при сохранении отзыва:", error);
      alert("Не удалось сохранить отзыв. Попробуйте ещё раз позже.");
    }
  };

  const reviewsToShow = reviews.length ? reviews : fallbackReviews;

  // Отображаем только часть картинок
  const visibleImages = GALLERY_IMAGES.slice(0, visibleCount);
  const canLoadMore = visibleCount < GALLERY_IMAGES.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 12, GALLERY_IMAGES.length)
    );
  };

  return (
    <div className="page">
   {/* ШАПКА */}
<header className="site-header">
  <div className="header-inner">
    {/* ЛОГО */}
    <div className="logo-block">
      <img
        src="/img/logo-irina.png"
        alt="Логотип Ирина Рощупкина"
        className="logo-img"
        loading="lazy"
      />
      <div className="logo-text">
        <div className="logo-name">ИРИНА РОЩУПКИНА</div>
        <div className="logo-sub">Hair &amp; Make-Up Artist</div>
      </div>
    </div>

    {/* МЕНЮ (desktop) — в нужном порядке */}
    <nav className="main-nav">
      <a href="#works">МОИ РАБОТЫ</a>
      <a href="#prices">ЦЕНЫ</a>
      <a href="#about">ОБО МНЕ</a>
      <a href="#certificates">СЕРТИФИКАТЫ</a>
      <a href="#reviews">ОТЗЫВЫ</a>
      <a href="#contacts">КОНТАКТЫ</a>
      <a href="#courses" className="nav-highlight">
        КУРСЫ И ОБУЧЕНИЕ
      </a>
    </nav>

    {/* МОСКВА + ТЕЛЕФОН + БУРГЕР */}
    <div className="header-contacts">
      <span className="header-city">Москва</span>
      <a href="tel:+79161694271" className="header-phone">
        +7 (916) 169 42 71
      </a>

      {/* бургер только для телефона */}
      <button
        className={`burger-btn ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Открыть меню"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  {/* МОБИЛЬНОЕ МЕНЮ — тот же порядок */}
  <nav className={`mobile-nav ${menuOpen ? "is-open" : ""}`}>
    <a href="#works" onClick={() => setMenuOpen(false)}>
      МОИ РАБОТЫ
    </a>
    <a href="#prices" onClick={() => setMenuOpen(false)}>
      ЦЕНЫ
    </a>
    <a href="#about" onClick={() => setMenuOpen(false)}>
      ОБО МНЕ
    </a>
    <a href="#certificates" onClick={() => setMenuOpen(false)}>
      СЕРТИФИКАТЫ
    </a>
    <a href="#reviews" onClick={() => setMenuOpen(false)}>
      ОТЗЫВЫ
    </a>
    <a href="#contacts" onClick={() => setMenuOpen(false)}>
      КОНТАКТЫ
    </a>
    <a
      href="#courses"
      className="nav-highlight"
      onClick={() => setMenuOpen(false)}
    >
      КУРСЫ И ОБУЧЕНИЕ
    </a>

    <span className="mobile-city">Москва</span>
    <a href="tel:+79161694271" className="mobile-phone">
      +7 (916) 169 42 71
    </a>
  </nav>
</header>


      <main>
        {/* HERO */}
        <section id="home" className="hero-section">
          <div className="hero-inner hero-inner-centered">
            {/* Соцсети слева */}
            <div className="hero-social-column">
              <a
                href="https://vk.com/id710212634"
                target="_blank"
                rel="noreferrer"
                aria-label="VK"
              >
                vk
              </a>
              <a
                href="https://www.instagram.com/irina_make.visage/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ig
              </a>
              <a
                href="https://wa.me/79161694271"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                wa
              </a>
            </div>

            {/* Текст по центру */}
            <div className="hero-content hero-content-centered">
              <h1 className="hero-title">
                Ваш стиль — в ритме современных трендов красоты.
              </h1>

              <p className="hero-subline">ВЫЕЗД ПО МОСКВЕ И ОБЛАСТИ</p>

              <div className="hero-actions hero-actions-centered">
                <a href="#contacts" className="btn btn-hero-primary">
                  Записаться &gt;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* МОИ РАБОТЫ */}
        <section
          id="works"
          className="section section-light reveal-section"
        >
          <div className="section-inner section-inner-works">
            <h2 className="section-title section-title-works">МОИ РАБОТЫ</h2>
            <p className="section-subtitle section-subtitle-works">
              <a
                href="https://www.instagram.com/irina_make.visage/"
                target="_blank"
                rel="noreferrer"
              >
                смотреть больше фото в Instagram &gt;
              </a>
            </p>

            <div className="works-grid">
              {visibleImages.map((img) => (
                <div className="work-card" key={img.src}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>

            {canLoadMore && (
              <div className="works-load-more">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleLoadMore}
                >
                  Показать ещё работы
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ЦЕНЫ */}
        <section
          id="prices"
          className="section section-dark section-prices reveal-section"
        >
          <div className="section-inner section-inner-prices">
            <div className="section-header">
              <div className="section-tag">УСЛУГИ</div>
              <h2 className="section-title">ЦЕНЫ И УСЛУГИ</h2>
              <p className="section-description">
                Макияж и причёска для важных событий: свадьба, выпускной, вечер,
                фотосессия. Все образы адаптирую под ваш тип внешности и формат
                мероприятия.
              </p>
            </div>

            <div className="prices-grid">
              {/* СВАДЕБНЫЙ ОБРАЗ */}
              <div className="price-card">
                <h3 className="price-title">Свадебный образ</h3>
                <p className="price-subtitle">
                  Макияж + причёска для невесты, стойкий на весь день
                </p>

                <ul className="price-list">
                  <li>Подбор стиля под платье, образ и локацию.</li>
                  <li>Пробный макияж и простой вариант причёски по договорённости.</li>
                  <li>Фиксация макияжа и причёски на длительное ношение.</li>
                  <li>Профессиональная косметика, стойкие продукты.</li>
                </ul>

                <div className="price-lines">
                  <div className="price-line">
                    Образ невесты (макияж + причёска) —{" "}
                    <p>
                      <b>от 15 000 ₽</b>
                    </p>
                  </div>
                  <div className="price-line">
                    Макияж для невесты —{" "}
                    <p>
                      <b>от 8 000 ₽</b>
                    </p>
                  </div>
                  <div className="price-line">
                    Макияж + причёска для подружки невесты —{" "}
                    <p>
                      <b>от 9 000 ₽</b>
                    </p>
                  </div>
                </div>

                <a href="#contacts" className="btn btn-outline">
                  Записаться на свадебный образ
                </a>
              </div>

              {/* ВЕЧЕРНИЙ ОБРАЗ */}
              <div className="price-card">
                <h3 className="price-title">ДНЕВНОЙ/ВЕЧЕРНИЙ ОБРАЗ</h3>
                <p className="price-subtitle">
                  Макияж и укладка для мероприятия, фотосессии, свидания
                </p>

                <ul className="price-list">
                  <li>Продуманный образ под дресс-код и формат события.</li>
                  <li>Акцент на глаза или губы — по вашим пожеланиям.</li>
                  <li>Фиксация макияжа на длительное ношение.</li>
                </ul>

                <div className="price-lines">
                  <div className="price-line">
                    Макияж —{" "}
                    <p>
                      <b>от 6 000 ₽</b>
                    </p>
                  </div>
                  <div className="price-line">
                    Макияж + лёгкая укладка —{" "}
                    <p>
                      <b>от 10 000 ₽</b>
                    </p>
                  </div>
                </div>

                <a href="#contacts" className="btn btn-outline">
                  Записаться на вечерний образ
                </a>
              </div>

              {/* ВЫПУСКНОЙ */}
              <div className="price-card">
                <h3 className="price-title">Выпускной</h3>
                <p className="price-subtitle">
                  Образ для школьного или вузовского выпускного
                </p>

                <ul className="price-list">
                  <li>Нежный или выразительный макияж по вашим пожеланиям.</li>
                  <li>Учёт дресс-кода, цвета платья и аксессуаров.</li>
                  <li>Только стойкая профессиональная косметика.</li>
                </ul>

                <div className="price-lines">
                  <div className="price-line">
                    Пробный макияж —{" "}
                    <p>
                      <b>5 000 ₽</b>
                    </p>
                  </div>
                  <div className="price-line">
                    Выпускной макияж —{" "}
                    <p>
                      {" "}
                      <b>7 000 ₽</b>
                    </p>
                  </div>
                  <div className="price-line">
                    Укладка —{" "}
                    <p>
                      <b>5 000 ₽</b>
                    </p>
                  </div>
                </div>

                <a href="#contacts" className="btn btn-outline">
                  Забронировать выпускной
                </a>
              </div>

              {/* ЛИФТИНГ-МАKИЯЖ */}
              <div className="price-card">
                <h3 className="price-title">Лифтинг-макияж</h3>
                <p className="price-subtitle">
                  Деликатный возрастной макияж с акцентом на свежесть и ухоженность
                </p>

                <ul className="price-list">
                  <li>Учитываю особенности зрелой кожи и черты лица.</li>
                  <li>Коррекция овала, мягкая работа с тоном и текстурами.</li>
                  <li>Работаю с профессиональными продуктами для возрастного макияжа.</li>
                </ul>

                <div className="price-lines">
                  <div className="price-line">
                    Лифтинг-макияж —{" "}
                    <p>
                      <b>8 000 ₽</b>
                    </p>
                  </div>
                </div>

                <a href="#contacts" className="btn btn-outline">
                  Записаться на лифтинг-макияж
                </a>
              </div>
              {/* FASHION STYLE */}
<div className="price-card">
  <h3 className="price-title">Fashion Style</h3>

  <p className="price-subtitle">
    Fashion style — это идеально подобранные текстуры и цвета, профессиональная
    работа с кожей, графичные стрелки, насыщенные губы или акцент на глаза — мы
    подберём лучший вариант под ваш стиль и мероприятие!
  </p>

  <div className="price-lead">Преимущества:</div>

  <ul className="price-list">
    <li>Современные техники и профессиональная косметика</li>
    <li>Индивидуальный подбор образа под ваше мероприятие</li>
    <li>Стойкость, качество и безупречный результат</li>
  </ul>

  <div className="price-lines">
    <div className="price-line">
      Макияж Fashion Style —{" "}
      <p>
        <b>8 000 ₽</b>
      </p>
    </div>

    <div className="price-line">
      Полный образ (макияж + укладка) —{" "}
      <p>
        <b>13 000 ₽</b>
      </p>
    </div>
  </div>

  <p className="price-note">
    Позвольте себе выделиться и почувствовать себя иконой стиля! Запишитесь на
    макияж или полный образ в Fashion Style и станьте центром внимания.
  </p>

  <a href="#contacts" className="btn btn-outline">
    Записаться на Fashion Style
  </a>
</div>

            </div>
            
          </div>
          
        </section>

        {/* КУРСЫ И ОБУЧЕНИЕ */}
        <section
          id="courses"
          className="section section-light section-courses reveal-section"
        >
          <div className="section-inner section-inner-courses">
            <div className="section-header">
              <div className="section-tag">ОБУЧЕНИЕ</div>
              <h2 className="section-title">КУРСЫ И ОБУЧЕНИЕ</h2>
              <p className="section-description">
                Индивидуальные и мини-группы для тех, кто хочет научиться
                профессиональному макияжу или «макияжу для себя».
              </p>
            </div>

            <div className="courses-grid">
          {/* Курс 1 — Сам себе визажист */}
{/* Курс 1 — Сам себе визажист */}
<div className="course-card">
  <h3 className="course-title">Курс «Сам себе визажист»</h3>

  <p className="course-subtitle">
    Обучение «Сам себе визажист» — сделай макияж своей силой! Мечтаете уверенно
    создавать как дневной нюд, так и роскошный вечерний образ? Приглашаю вас на
    мой авторский мастер-класс: всего за 3–4 часа вы узнаете, как подчеркнуть
    естественную красоту и научитесь тонкостям профессионального визажа!
  </p>

  <div className="course-lead">Что вас ждёт на обучении:</div>

  <ul className="course-list course-list-accent">
    <li>Разбор ваших ошибок и слабых мест (по вашим фото/работам).</li>
    <li>
      Научу выполнять легкий нюдовый макияж и эффектный вечерний look — адаптирую
      для ваших черт лица и стиля.
    </li>
    <li>
      Сделаем разбор вашей косметички: расскажу, что из имеющегося подходит вам,
      а что лучше заменить, дам рекомендации, как правильно выбирать продукты.
    </li>
    <li>
      Пройдем базовый уход за кожей — ведь идеальный макияж начинается с
      грамотного ухода!
    </li>
    <li>
      Разберем анатомию лица — подскажу, на чем сделать акцент и как мастерски
      скрыть небольшие недостатки.
    </li>
    <li>
      Фиксируем все этапы и прорисовываем их на фейсчарте — эта уникальная
      «шпаргалка» останется с вами.
    </li>
    <li>
      Покажу технику на одной половине вашего лица, а вы под моим чутким
      руководством повторите на второй — индивидуальный подход и поддержка
      гарантированы.
    </li>
    <li>Все необходимое — профессиональная косметика и кисти — предоставляю.</li>
    <li>
      Хотите освоить макияж по определенному запросу? Мы обязательно уделим ему
      время!
    </li>
  </ul>

  <div className="course-price">
    Стоимость индивидуального обучения — <b>9 000 ₽</b>
  </div>

  <p className="course-note">
    Это уникальная возможность получить профессиональные навыки и персональные
    рекомендации, которые выделят вас среди других! Запишитесь уже сегодня — я
    помогу вам взглянуть на себя по-новому и почувствовать уверенность в каждом
    штрихе макияжа.
  </p>

  <a href="#contacts" className="btn btn-outline btn-accent">
    Записаться
  </a>
</div>



{/* Курс 2 — Повышение квалификации */}
<div className="course-card">
  <h3 className="course-title">Индивидуальный МК «Повышение квалификации»</h3>

  <p className="course-subtitle">
    Для начинающих и практикующих визажистов. Прокачаем технику, разберём
    актуальные тренды, работу с тоном без эффекта “маски”, симметрию стрелок и
    создадим образы, которые выглядят дорого на фото и в жизни.
  </p>

  <ul className="course-list">
    <li>Разбор ваших ошибок и слабых мест (по вашим фото/работам).</li>
    <li>Современные техники: чистая кожа, правильные текстуры, стойкость.</li>
    <li>Тренды и коммерческие схемы макияжа, которые действительно работают.</li>
    <li>Как делать макияж под съёмку: свет, плотность, финиши, детали.</li>
    <li>Программа полностью под вас — без лишнего, только то, что нужно.</li>
  </ul>

  <div className="course-price">
    Индивидуальный мастер-класс — <b>11 000 ₽</b>
  </div>

  <a href="#contacts" className="btn btn-outline">
    Записаться
  </a>
</div>


              <div className="course-card">
                <h3 className="course-title">Базовый курс визажиста</h3>
                <p className="course-subtitle">
                  Для начинающих мастеров, которые хотят работать с клиентами
                </p>
                <ul className="course-list">
                  <li>Основы колористики и работы с формой лица.</li>
                  <li>Отработка макияжа на моделях.</li>
                  <li>Разбор фотоконтента и портфолио.</li>
                </ul>
                <div className="course-price">
                  Индивидуально и мини-группы — <b>стоимость по запросу</b>
                </div>
                <a href="#contacts" className="btn btn-outline">
                  Узнать детали курса
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ОБО МНЕ */}
        <section
          id="about"
          className="section section-about section-dark reveal-section"
        >
          <div className="section-inner section-inner-about">
            <div className="about-photo">
              <img
                src="/img/irina-portrait.jpg"
                alt="Визажист Ирина Рощупкина"
                loading="lazy"
              />
            </div>
            <div className="about-content">
              <div className="section-tag">ОБО МНЕ</div>
              <h2 className="section-title">ИРИНА РОЩУПКИНА</h2>
              <p className="about-list">
               Я — стилист и визажист со знаниями дерматологии и косметической химии. До того как макияж стал моей профессией, я более пяти лет изучала кожу и формулы косметических средств. Это позволяет мне не только создавать эстетически цепляющие образы, но и понимать, что действительно нужно вашей коже, а каких компонентов в продуктах стоит избегать.
Мой подход основан на убеждении, что макияж способен менять не только внешность, но и внутреннее ощущение себя. Он может стать отправной точкой перемен, источником уверенности и инструментом самовыражения.
В работе я ценю индивидуальность. Я тонко подчеркиваю достоинства и, когда необходимо, аккуратно нивелирую нюансы, сохраняя природную гармонию.
Если вы ищете профессионала, который сочетает художественный вкус и научный подход к коже — вы в надёжных руках.
              </p>
            </div>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА */}
        <section
          id="benefits"
          className="section section-light section-benefits reveal-section"
        >
          <div className="section-inner section-inner-benefits">
            <div className="benefits-header">
              <div className="section-tag">ПОЧЕМУ Я</div>
              <h2 className="section-title">ПРЕИМУЩЕСТВА</h2>
            </div>

            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-item-icon">🎨</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">ИНДИВИДУАЛЬНЫЙ ПОДХОД</div>
                  <ul className="benefit-item-list">
                    <li>Образ создаётся под вашу внешность и событие.</li>
                    <li>Учитываю ваши пожелания по стилю и уровню яркости.</li>
                  </ul>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-item-icon">⏳</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">СТОЙКОСТЬ ОБРАЗА</div>
                  <ul className="benefit-item-list">
                    <li>Макияж и причёска рассчитаны на целый день.</li>
                    <li>Только проверенная профессиональная косметика.</li>
                  </ul>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-item-icon">📍</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">УДОБСТВО</div>
                  <ul className="benefit-item-list">
                    <li>Выезд на дом или в студию при необходимости.</li>
                    <li>
                      В стоимость входят все расходные материалы и одноразовые кисти.
                    </li>
                    <li>
                      Спецусловия для подруг невесты и гостьи выпускниц.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-item-icon">🤍</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">ОТНОШЕНИЕ</div>
                  <ul className="benefit-item-list">
                    <li>Бережное отношение к коже и волосам.</li>
                    <li>
                      Дезинфекция и стерилизация инструментов после каждого клиента.
                    </li>
                    <li>
                      Образ строится вокруг вашей индивидуальности и комфорта.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-item-icon">💎</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">ДЕТАЛИ</div>
                  <ul className="benefit-item-list">
                    <li>Продумываю образ целиком: от макияжа до прядей и аксессуаров.</li>
                    <li>Помогаю с позированием для красивых фото.</li>
                  </ul>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-item-icon">📷</div>
                <div className="benefit-item-body">
                  <div className="benefit-item-title">ОБРАЗ ДЛЯ КАМЕРЫ</div>
                  <ul className="benefit-item-list">
                    <li>Макияж и причёска учитывают особенности фото и видео.</li>
                    <li>Образ будет выглядеть выигрышно как в жизни, так и в кадре.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* СЕРТИФИКАТЫ */}
        <section
          id="certificates"
          className="section section-dark section-certs reveal-section"
        >
          <div className="section-inner section-inner-certs">
            <div className="section-header">
              <div className="section-tag">КВАЛИФИКАЦИЯ</div>
              <h2 className="section-title">СЕРТИФИКАТЫ И ОБУЧЕНИЕ</h2>
              <p className="section-description">
                Постоянно повышаю квалификацию, прохожу обучения у российских и
                зарубежных мастеров. Ниже — часть моих сертификатов.
              </p>
            </div>

            <div className="certs-grid">
              {CERTIFICATE_IMAGES.map((img) => (
                <div className="cert-card" key={img.src}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ОТЗЫВЫ */}
        <section
          id="reviews"
          className="section section-light section-reviews reveal-section"
        >
          <div className="section-inner section-inner-reviews">
            <div className="section-header">
              <div className="section-tag">ОТЗЫВЫ</div>
              <h2 className="section-title">ЧТО ГОВОРЯТ КЛИЕНТЫ</h2>
              <p className="section-description">
                Мне важно, чтобы вы чувствовали себя комфортно и уверенно. Вот
                несколько отзывов клиентов. Оставьте свой — он поможет другим
                девушкам довериться мне в самый важный день.
              </p>
            </div>

            <div className="reviews-grid">
              {reviewsToShow.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-name">{review.name}</div>
                  <p className="review-text">“{review.text}”</p>
                </div>
              ))}
            </div>

            <div className="review-form-block">
              <h3 className="review-form-title">Оставить отзыв</h3>
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    className="input"
                  />
                  <input
                    type="text"
                    name="contact"
                    placeholder="Контакты (телефон или соцсети)"
                    className="input"
                  />
                </div>
                <textarea
                  name="message"
                  className="textarea"
                  placeholder="Ваши впечатления от макияжа, причёски или обучения"
                  rows={4}
                />
                <button type="submit" className="btn btn-primary">
                  Отправить отзыв
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* КОНТАКТЫ */}
        <section
          id="contacts"
          className="section section-dark section-contacts reveal-section"
        >
          <div className="section-inner section-inner-contacts">
            <div className="contacts-content">
              <div className="section-tag">КОНТАКТЫ</div>
              <h2 className="section-title">КАК СО МНОЙ СВЯЗАТЬСЯ</h2>

              <ul className="contacts-list">
                <li>
                  Телефон:{" "}
                  <a href="tel:+79161694271" className="contact-link">
                    +7 (916) 169 42 71
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/79161694271"
                    className="contact-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    написать в WhatsApp
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    href="https://www.instagram.com/irina_make.visage/"
                    className="contact-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @irina_make.visage
                  </a>
                </li>
                <li>
                  Telegram:{" "}
                  <a
                    href="https://t.me/Iriska_ros"
                    className="contact-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @Iriska_ros
                  </a>
                </li>
                <li>Локация: Москва и Долгопрудный, выезд по договорённости.</li>
              </ul>

              <p className="contacts-note">
                Напишите, на какое мероприятие вы планируете образ, дату и время —
                я подберу удобное окно или предложу альтернативу.
              </p>
            </div>

          <div className="contacts-map-wrapper">
  <div className="contacts-address">
    <h3>Адрес студии</h3>
    <p>г. Долгопрудный, ул. Московская, д. 56</p>
    <p>Предварительная запись обязательна.</p>
  </div>

  <div className="contacts-map-wrapper">
  <div className="contacts-map">
    <iframe
      title="Карта локации"
      src="https://yandex.ru/map-widget/v1/?ll=37.526753%2C55.960538&z=16&pt=37.526753,55.960538,pm2rdm"
      width="100%"
      height="100%"
      frameBorder="0"
      loading="lazy"
    ></iframe>
  </div>
</div>

</div>

          </div>
        </section>
      </main>

      {/* ФУТЕР */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>© {currentYear} Ирина Рощупкина. Все права защищены.</div>
          <div className="footer-links">
            <a
              href="https://www.instagram.com/irina_make.visage/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://t.me/Iriska_ros"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
