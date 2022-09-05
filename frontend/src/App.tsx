import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Lobby from './components/Lobby/Lobby';
import Playground from './components/Playground/Playground';
import NotFound from './components/NotFound/NotFound';
import Notification from './components/Notification/Notification';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/lobby/:room" component={Lobby} />
          <Route exact path="/playground" component={Playground} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
      <Notification />
    </div>
  );
}

export default App;
