import React from 'react'
import './CamView.css'
import { Button } from 'react-bootstrap'

const CamView = props => (
  <div className='CamView'>
    <header className='CamView-header'>
      <h2>CamView</h2>
      <p>Enter Connect ID</p>
      <form onSubmit={props.joinRoom}>
        <input type="text" name="room" value={props.roomId} onChange={props.handleChange} pattern="^\w+$" maxLength="10" required autoFocus title="Room name should only contain letters or numbers." />
        <Button bsStyle="primary" type="submit">join room</Button>
        <button className="primary-button" onClick={props.setRoom}>Random</button>
        </form>
    </header>
  </div>
)
CamView.propTypes = {
handleChange: React.PropTypes.func.isRequired,
joinRoom: React.PropTypes.func.isRequired,
setRoom: React.PropTypes.func.isRequired,
roomId: React.PropTypes.number.isRequired,
rooms: React.PropTypes.object.isRequired
}

export default CamView
