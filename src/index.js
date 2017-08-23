import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Container from './components/app/App'
import Home from './components/home/Home'
import About from './components/about/About'
import CamViewContainer from './containers/camviewcontainer/CamViewContainer'
import Room from './containers/roomcontainer/RoomContainer'
import Conference from './components/conference/Conference'
import './index.css'
import store from './store'

const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact strict path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route path='room/:room' component={Room} />
          <Route exact path='/camera' component={CamViewContainer} />
          <Route exact path='/conference' component={Conference} />
        </Switch>
      </Container>
    </Router>
  </Provider>
)

export default App

render(<App />, document.getElementById('root'))
