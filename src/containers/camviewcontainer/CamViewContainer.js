import React, { Component } from 'react';
import { connect } from 'react-redux'
import CamView from '../../components/camview/CamView';
import store from '../../store';

class CamViewContainer extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    value: new Date() - new Date().setHours(0, 0, 0, 0)
  }
  static contextTypes = {
    router: React.PropTypes.object
  }
  setRoom = () => this.setState({value: new Date() - new Date().setHours(0, 0, 0, 0)})
  joinRoom = e => {
    e.preventDefault();
    this.context.router.push('r/' + this.state.value);
  }
  handleChange = e => this.setState({value: e.target.value})
  render(){
    return (
      <CamView
        roomId={this.state.value}
        handleChange={this.handleChange}
        joinRoom={this.joinRoom}
        setRoom={this.setRoom}
        rooms={this.props.rooms}
        ></CamView>
    );
  }
}
const mapStateToProps = store => ({rooms: new Set([...store.rooms])});
export default connect(mapStateToProps)(CamViewContainer);
