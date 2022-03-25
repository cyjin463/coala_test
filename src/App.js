import React from "react";
import { Route, useLocation } from "react-router-dom";

import Main from "./page/Main";
import Login from "./page/Login";
import Create from "./page/Create";
import Detail from "./page/Detail";
import _Test from "./components/_Test";
import Ranking from "./page/Ranking";
import SearchResult from "./page/SearchResult";
import Header from "./components/Header";
import Edituser from "./page/Edituser";
import Password from "./page/Password";
import Footer from "./components/Footer";
import Alarms from "./page/Alarms";
import Scrap from "./page/Scrap";

function App() {
  const location = useLocation();
  return (
    <div className='App'>
      {location.pathname === "/login" ? null : <Header />}
      <Route path='/' exact component={Main} />
      <Route path='/create' exact component={Create} />
      <Route path='/edit/:pid' exact component={Create} />
      <Route path='/ranking' exact component={Ranking} />
      <Route path='/login' exact component={Login} />
      <Route path='/detail/:pid' exact component={Detail} />
      <Route path='/search/:keyword' exact component={SearchResult} />
      <Route path='/useredit' exact component={Edituser} />
      <Route path='/passedit' exact component={Password} />
      <Route path='/alarms' exact component={Alarms} />
      <Route path='/scrap' exact component={Scrap} />
      {location.pathname === "/login" ? null : <Footer />}
    </div>
  );
}

export default App;
