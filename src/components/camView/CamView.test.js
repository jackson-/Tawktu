import React from 'react'
import ReactDOM from 'react-dom'
import CamView from './CamView'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<CamView />, div)
})
