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

function App() {
  const [reviews, setReviews] = useState([]);
  const currentYear = new Date().getFullYear();

  // 20 фото галереи
  const galleryImages = Array.from({ length: 20 }, (_, i) => ({
    src: `/img/gallery-${i + 1}.jpg`,
    alt: `Работа ${i + 1}`,
  }));

  // сертификаты
  const certificateImages = Array.from({ length: 5 }, (_, i) => ({
    src: `/img/cert-${i + 1}.jpg`,
    alt: `Сертификат ${i + 1}`,
  }));

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
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

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
/>

  <div className="logo-text">
    <div className="logo-name">ИРИНА РОЩУПКИНА</div>
    <div className="logo-sub">Hair &amp; Make-Up Artist</div>
  </div>
</div>


          {/* МЕНЮ */}
          <nav className="main-nav">
            <a href="#works">МОИ РАБОТЫ</a>
            <a href="#prices">ЦЕНЫ</a>
            <a href="#about">ОБО МНЕ</a>
            <a href="#benefits">ПРЕИМУЩЕСТВА</a>
            <a href="#certificates">СЕРТИФИКАТЫ</a>
            <a href="#reviews">ОТЗЫВЫ</a>
            <a href="#contacts">КОНТАКТЫ</a>
          </nav>

          {/* ТЕЛЕФОН */}
          <div className="header-contacts">
            <a href="tel:+79161694271" className="header-phone">
              +7 (916) 169 42 71
            </a>
            <span className="header-city">Москва</span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="hero-section">
          <div className="hero-inner hero-inner-centered">
            {/* Соцсети слева */}
            <div className="hero-social-column">
              <a
                href="https://vk.com/your_profile"
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
                Макияж и причёска по модным
                <br />
                трендам 2025 за
                <br />
                10&nbsp;000&nbsp;₽ в Москве!
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
              {galleryImages.map((img, index) => (
                <div className="work-card" key={index}>
                  <img src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ЦЕНЫ */}
        <section
          id="prices"
          className="section section-contrast reveal-section"
        >
          <div className="section-inner">
            <h2 className="section-title">Цены</h2>
            <p className="section-subtitle">
              Выберите формат, который подойдёт под ваше событие.
            </p>

            <div className="price-grid">
              {/* Базовый образ */}
              <div className="price-card">
                <div className="price-name">ДНЕВНОЙ/ВЕЧЕРНИЙ ОБРАЗ</div>
                <div className="price-tag">
                  мероприятие, фотосессия, свидание, деловая съёмка
                </div>
                <ul className="price-list">
                  <li>
                    Макияж 6000 р
                  </li>
                  <li>МАКИЯЖ + Прическа  10 000</li>
                </ul>
                <div className="price-value">от 6 000 ₽</div>
                <a href="#contacts" className="btn btn-outline">
                  Записаться на образ
                </a>
              </div>

              {/* СВАДЕБНЫЙ ОБРАЗ */}
              <div className="price-card">
                <div className="price-name">Свадебный образ</div>
                <div className="price-tag">
                  макияж и причёска для самого важного дня
                </div>
                <ul className="price-list">
                  <li>
                    Профессиональный свадебный макияж с учётом ваших
                    пожеланий, стиля платья и формата торжества.
                  </li>
                  <li>
                    Подбор косметики с учётом освещения, фотосъёмки и
                    длительности мероприятия.
                  </li>
                  <li>
                    Пробный образ (макияж + причёска), чтобы заранее
                    утвердить идеальный вариант и чувствовать себя уверенно.
                  </li>
                  <li>
                    Макияж для мамы и гостей — по желанию, в едином стиле с
                    невестой.
                  </li>
                  <li>
                    Выезд на дом или место торжества возможен и
                    оплачивается отдельно.
                  </li>
                </ul>

                <div className="price-value">
                  Пробный свадебный макияж — 6 000 ₽
                </div>
                <p className="price-note">
                  Пробный образ (макияж + причёска) — 10 000 ₽
                </p>

                <div className="price-value">
                  Свадебный макияж в день торжества —  8000 ₽
                </div>
                <p className="price-note">
                  Свадебный образ (макияж + причёска) — 15 000 ₽
                </p>

                <p className="price-note">
                  Макияж для мамы и гостей — от 5 000 ₽. Выезд на дом или
                  площадку — по индивидуальному расчёту.
                </p>

                <p className="price-note">
                  🔥 При заказе пробного и свадебного макияжа вместе
                  действует скидка 10%!
                </p>

                <a href="#contacts" className="btn btn-outline">
                  Забронировать свадебную дату
                </a>
              </div>

              {/* ВЫПУСКНОЙ ОБРАЗ */}
            {/* ВЫПУСКНОЙ ОБРАЗ */}
<div className="price-card">
  <div className="price-name">Выпускной образ</div>
  <div className="price-tag">
    будь звездой своего выпускного вечера
  </div>
  <ul className="price-list">
    <li>
      Профессиональный макияж, который подчеркнёт красоту и
      продержится весь вечер.
    </li>
    <li>
      Укладка волос под платье и формат выпускного: локоны,
      пучок или гладкая укладка.
    </li>
    <li>
      Пробный макияж по желанию, чтобы заранее утвердить образ.
    </li>
    <li>Используется стойкая профессиональная косметика.</li>
  </ul>

  {/* Цены отдельными строками, выделены цветом */}
  <div className="price-lines">
    <div className="price-line">Пробный макияж — 5 000 ₽</div>
    <div className="price-line">Выпускной макияж — 7 000 ₽</div>
    <div className="price-line">Укладка — 5 000 ₽</div>
  </div>

  <a href="#contacts" className="btn btn-outline">
    Забронировать выпускной
  </a>
</div>


              {/* ЛИФТИНГ-МАKИЯЖ */}
              <div className="price-card">
                <div className="price-name">Лифтинг-макияж</div>
                <div className="price-tag">
                  визуальное омоложение и свежий взгляд
                </div>
                <ul className="price-list">
                  <li>
                    Лифтинг-эффект с помощью специальных техник макияжа.
                  </li>
                  <li>
                    Коррекция и выравнивание тона кожи, естественное
                    свечение без перегруза.
                  </li>
                  <li>
                    Лёгкий лифтинг-контуринг и деликатная проработка скул.
                  </li>
                  <li>
                    Акцент на выразительном взгляде и ощущении свежести.
                  </li>
                  <li>
                    Профессиональная стойкая косметика премиум-класса.
                  </li>
                </ul>
                <div className="price-value">Лифтинг-макияж — 7 000 ₽</div>
                <p className="price-note">
                  Лифтинг-макияж + укладка — 12 000 ₽. Возможен выезд к
                  клиенту (оплачивается отдельно).
                </p>
                <a href="#contacts" className="btn btn-outline">
                  Записаться на лифтинг-макияж
                </a>
              </div>
            </div>
          </div>
        </section>
{/* ОБО МНЕ */}
<section
  id="about"
  className="section section-soft reveal-section about-section"
>
  <div className="section-inner about-layout">
    {/* Карточка с фото визажиста */}
    <div className="about-photo-card">
      <div className="about-badge">Стилист и визажист</div>
      <div className="about-photo-glow" />
      <img
        src="/img/about-irina.jpg"
        alt="Ирина Рощупкина — стилист и визажист"
        className="about-photo-img"
      />
      <div className="about-name">Ирина Рощупкина</div>
    </div>

    {/* Текст + соцсети */}
    <div className="about-right">
      <div className="about-text-block">
        <h2 className="section-title">Обо мне</h2>
        <p>
          Я — стилист и визажист со знаниями дерматологии и косметической
          химии. До того как макияж стал моей профессией, я более пяти лет
          изучала кожу и формулы косметических средств. Это позволяет мне
          не только создавать эстетически выразительные образы, но и
          понимать, что действительно нужно вашей коже, а каких компонентов
          стоит избегать.
        </p>
        <p>
          Мой подход основан на убеждении, что макияж меняет не только
          внешность, но и внутреннее состояние. В работе я ценю
          индивидуальность, мягко подчеркиваю достоинства и аккуратно
          нивелирую нюансы, сохраняя природную гармонию и живость лица.
        </p>
      </div>

      <div className="about-side-card">
        <h3>Соцсети</h3>
        <p>
          Больше работ, разбор косметики и полезные советы по уходу — в моих
          социальных сетях.
        </p>
        <div className="about-links">
          <a
            href="https://www.instagram.com/irina_make.visage/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://t.me/your_profile"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            href="https://vk.com/your_profile"
            target="_blank"
            rel="noreferrer"
          >
            VK
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
 
  {/* ПРЕИМУЩЕСТВА */}
<section
  id="benefits"
  className="benefits-section reveal-section"
>
  <div className="benefits-inner">
    <h2 className="benefits-title">ПРЕИМУЩЕСТВА</h2>
    <p className="benefits-subtitle">
      КАЖДАЯ ДЕВУШКА ДОСТОЙНА ЛУЧШЕГО
    </p>
    <div className="benefits-divider" />

    <div className="benefits-grid">
      <div className="benefit-item">
        <div className="benefit-item-icon">🎁</div>
        <div className="benefit-item-body">
          <div className="benefit-item-title">ПРИЯТНЫЕ БОНУСЫ</div>
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
          <div className="benefit-item-title">КОСМЕТИКА</div>
          <ul className="benefit-item-list">
            <li>
              Профессиональная и люксовая косметика, проверенная временем.
            </li>
            <li>
              Стойкость макияжа на протяжении всего мероприятия и фотосессии.
            </li>
            <li>
              Подбор текстур под тип кожи и освещение: день, вечер, студия.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* СЕРТИФИКАТЫ */}
      <section
  id="certificates"
  className="section section-light reveal-section"
>
  <div className="section-inner">
    <h2 className="section-title">Сертификаты и обучение</h2>
    <p className="section-subtitle">
      Повышаю квалификацию и регулярно прохожу обучение у ведущих визажистов.
      Ниже — часть сертификатов.
    </p>

    <div className="cert-scroll-wrapper">
      <div className="cert-scroll-row">
        {certificateImages.map((cert, index) => (
          <div className="cert-card" key={index}>
            <div className="cert-image-wrap">
              <img src={cert.src} alt={cert.alt} />
            </div>
            <div className="cert-caption">Сертификат {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


        {/* ОТЗЫВЫ */}
        <section
          id="reviews"
          className="section section-light reveal-section"
        >
          <div className="section-inner reviews-layout">
            {/* Левая часть – список отзывов */}
            <div className="reviews-left">
              <h2 className="section-title">Отзывы</h2>
              <p className="section-subtitle">
                Несколько отзывов моих клиенток. Вы тоже можете оставить
                отзыв — он будет виден другим посетителям сайта.
              </p>

              <div className="reviews-grid">
                {reviewsToShow.map((item) => (
                  <div className="review-card" key={item.id}>
                    <div className="review-quote-mark">“</div>
                    <p className="review-text">{item.text}</p>
                    <div className="review-author">
                      <span>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая часть – форма оставить отзыв */}
            <div className="reviews-right">
              <div className="review-form-card">
                <h3>Оставить отзыв</h3>
                <p>
                  Поделитесь своими впечатлениями — это помогает другим
                  девушкам выбрать мастера, а мне становиться ещё лучше.
                </p>

                <form
                  onSubmit={handleReviewSubmit}
                  className="review-form"
                >
                  <label className="form-field">
                    <span>Имя</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Как к вам обращаться"
                    />
                  </label>

                  <label className="form-field">
                    <span>Контакт</span>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Instagram, Telegram или телефон"
                    />
                  </label>

                  <label className="form-field">
                    <span>Отзыв *</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Расскажите, что вам понравилось в образе и работе :)"
                    />
                  </label>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                  >
                    Отправить отзыв
                  </button>

                  <p className="review-form-hint">
                    После отправки ваш отзыв сохраняется в базе и вскоре
                    появляется в списке на этой странице.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* КОНТАКТЫ */}
        <section
          id="contacts"
          className="section section-contrast reveal-section"
        >
          <div className="section-inner contacts-layout">
            <div className="contacts-left">
              <h2 className="section-title">Контакты</h2>
              <p>Телефон / WhatsApp / Telegram:</p>
              <p className="contacts-phone">
                <a href="tel:+79161694271">+7 (916) 169 42 71</a>
              </p>
              <p>Город: Москва</p>
              <p>Работаю по предварительной записи.</p>

              <div className="contacts-buttons">
                <a
                  href="https://wa.me/79161694271"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Написать в WhatsApp
                </a>
                <a
                  href="https://t.me/your_profile"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Написать в Telegram
                </a>
              </div>
            </div>

            <div className="contacts-right">
              <div className="contacts-box">
                <div className="contacts-box-title">
                  Быстрая заявка на макияж
                </div>
                <p>
                  Напишите мне удобный формат, дату и время — я подскажу,
                  какой образ подойдёт именно вам.
                </p>
                <ul>
                  <li>Дата и время мероприятия.</li>
                  <li>
                    Тип события (свадьба, выпускной, фотосессия, деловая
                    встреча и т.п.).
                  </li>
                  <li>Ваши пожелания по макияжу и причёске.</li>
                </ul>
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
              href="https://t.me/your_profile"
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
