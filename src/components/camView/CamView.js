import React from 'react'
import './CamView.css'
import { Button } from 'react-bootstrap'

const About = props => (
  <div className='About'>
    <header className='About-header'>
      <h2>CamView</h2>
      <p>Enter Connect ID</p>
      <form onSubmit={props.joinRoom}>
        <input type="text" name="room" value={props.roomId} onChange={props.handleChange} pattern="^\w+$" maxLength="10" required autoFocus title="Room name should only contain letters or numbers." />
        <Button bsStyle="primary">join room</Button>
        <Button>random</Button>
        </form>
    </header>
  </div>
)

export default About
