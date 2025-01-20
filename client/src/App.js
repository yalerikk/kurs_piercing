import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <BrowserRouter>
      <header className="header">
        <NavBar />
      </header>
      <main className="main">
        <AppRouter />
      </main>
      {/*  
      <footer className="footer">
        <h1>Footer</h1>
      </footer>
      */}
    </BrowserRouter>
  );
};

export default App;
