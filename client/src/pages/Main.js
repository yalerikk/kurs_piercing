import React from "react";
import molly from "../assets/images/molly.jpg";

// css
import "../styles/about.css";
import "../styles/services.css";

import ServiceBar from "../components/ServiceBar";
import ServiceTypeBar from "../components/ServiceTypeBar";
import ServiceSpace from "../components/ServiceSpace";

const Main = () => {
  return (
    <div>
      {/* ABOUT */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="section-title">
                <h1 className="display-4 fw-bold">О мастере</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="about-container col-lg-6 text-center">
              <img src={molly} alt="Молли" className="about-image" />
              <div className="about-desc">
                <p className="about-p hello-text">Всем привет, я Молли</p>
                <p className="about-p">
                  Я сертифицированная пирсерша. Занимаюсь пирсингом уже не
                  первый год и обожаю свое дело.
                </p>
              </div>
            </div>
            <div className="about-container col-lg-5">
              <div>
                <p className="about-p about-text">
                  Все процедуры выполняются безопасно, стерильно и красиво. Я
                  делаю пирсинг только так)
                  <br />
                  <br /> В работе использую только украшения из титана, который
                  известен своей безопасностью и гипоаллергенностью. Каждая
                  процедура выполняется с вниманием и заботой о клиентах. Вы
                  можете быть уверены в безопасности прокола!
                  <br />
                  <br /> Я поддерживаю контакт с вами на протяжении всего
                  процесса заживления и всегда готова ответить на ваши вопросы
                  или помочь, если возникнут сложности. Предоставляю бесплатные
                  консультации по выбору места прокола и типа украшения, с
                  удовольствием рассказываю о всех нюансах и особенностях. Ведь
                  мне важно, чтобы каждый клиент чувствовал себя комфортно и
                  уверенно в своем выборе!
                  <br />
                  <br /> Для каждой процедуры я обеспечиваю строгую стерилизацию
                  инструментов и использую только одноразовые расходники. Моя
                  цель – сделать профессиональный пирсинг доступным, предлагая
                  конкурентоспособные цены. Я уверена, что качество моего
                  сервиса вас приятно удивит.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="services-title section-title">
                <h1 className="display-4 fw-bold">Услуги и цены</h1>
              </div>
            </div>
          </div>
          <div className="row g-0 services-table">
            <div className="col-12">
              <div className="service-type-bar text-center">
                <ServiceTypeBar />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="service-bar text-center">
                <ServiceBar />
              </div>
            </div>
            <div className="col-lg-9">
              <div className="service-space text-center">
                <ServiceSpace />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
