import React, { useEffect } from "react";
import { LOGIN_ROUTE, MAIN_ROUTE, REG_ROUTE } from "../utils/consts";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import "../styles/auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  useEffect(() => {
    // Устанавливаем активное состояние формы в зависимости от маршрута
    const authContainer = document.getElementById("auth-container");
    if (isLogin) {
      authContainer.classList.remove("active");
    } else {
      authContainer.classList.add("active");
    }
  }, [isLogin]);

  const handleSignUp = (event) => {
    event.preventDefault();
    const userName = event.target[0].value; // Имя
    const userSurname = event.target[1].value; // Фамилия
    const userEmail = event.target[2].value; // Почта
    const userPassword = event.target[3].value; // Пароль

    // Логика создания пользователя
    console.log({ userName, userSurname, userEmail, userPassword });
    // Перенаправление на страницу авторизации после успешной регистрации
    navigate(LOGIN_ROUTE);
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    const userEmail = event.target[0].value; // Почта
    const userPassword = event.target[1].value; // Пароль

    // Логика входа пользователя
    console.log({ userEmail, userPassword });
    // Перенаправление на нужную страницу после входа
    navigate(REG_ROUTE); // Замените на нужный маршрут
  };

  const handleRegisterClick = () => {
    navigate(REG_ROUTE);
  };

  const handleLoginClick = () => {
    navigate(LOGIN_ROUTE);
  };

  return (
    <div className="authorization-container">
      <div className="auth-container" id="auth-container">
        <div className={`form-container sign-up ${!isLogin ? "active" : ""}`}>
          <form onSubmit={handleSignUp}>
            <h1 className="auth-h1">Создать аккаунт</h1>
            <input type="text" placeholder="Имя" required />
            <input type="text" placeholder="Фамилия" required />
            <input type="email" placeholder="Почта" required />
            <input type="password" placeholder="Пароль" required />
            <button type="submit">Регистрация</button>
          </form>
        </div>
        <div className={`form-container sign-in ${isLogin ? "active" : ""}`}>
          <form onSubmit={handleSignIn}>
            <h1 className="auth-h1">Авторизация</h1>
            <input type="email" placeholder="Почта" required />
            <input type="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="auth-h1">Добро пожаловать!</h1>
              <p>
                Введите свои личные данные, чтобы использовать все возможности
                сайта
              </p>
              <button className="hidden" onClick={handleLoginClick}>
                Войти
              </button>
              <NavLink to={MAIN_ROUTE} className="exit-link">
                Выйти
              </NavLink>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="auth-h1">Привет, друг!</h1>
              <p>Зарегистрируйтесь, чтобы использовать все функции сайта</p>
              <button className="hidden" onClick={handleRegisterClick}>
                Регистрация
              </button>
              <NavLink to={MAIN_ROUTE} className="exit-link">
                Выйти
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
