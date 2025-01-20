import React, { useContext } from "react";
import { Context } from "../index";
// MASTER_ROUTE, CLIENT_ROUTE, LOGIN_ROUTE, REG_ROUTE, 
import { MAIN_ROUTE } from "../utils/consts";
import { useLocation } from "react-router-dom";

import "../styles/NavBar.css";

const NavBar = () => {
  const { user } = useContext(Context);
  const location = useLocation();
  //const userRole = user.isAuth ? getUserRoleFromToken(user.token) : null; // Предполагается, что токен хранится в user

  // Условие для скрытия NavBar на страницах авторизации и регистрации
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/reg";

  if (isAuthPage) {
    return null; // Не отображаем NavBar на страницах авторизации и регистрации
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href={MAIN_ROUTE}>
          Piersuck
        </a>

        {/* Toggle btn */}
        <button
          className="navbar-toggler shadow-none border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* SideBar */}
        <div
          className="sidebar offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          {/* SideBar header */}
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Piersuck
            </h5>
            <button
              type="button"
              className="btn-close shadow-none"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          {/* SideBar body */}
          <div className="offcanvas-body">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  О мастере
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Услуги и цены
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#portfolio">
                  Портфолио
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#faq">
                  FAQ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#reviews">
                  Отзывы
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Контакты
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link login-link"
                  /*
                  href={
                    user.isAuth
                      ? userRole === 1
                        ? MASTER_ROUTE
                        : CLIENT_ROUTE
                      : AUTH_ROUTE
                  }
                  
                >
                  {user.isAuth
                    ? userRole === 1
                      ? "Кабинет"
                      : "Кабинет" // клиента
                    : "Вход"}
                    */
                  href={user.isAuth ? "/cabinet" : "/login"}
                >
                  {user.isAuth ? "Кабинет" : "Вход"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
