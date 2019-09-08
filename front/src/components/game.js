import React, { Component } from "react";
import Constants from '../assets/Constants'
import { socket } from '../other/socket'
import './styles.css'

const _ = require('lodash');

const VALID_CODES = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
}


class Game extends Component {
  constructor() {
    super();
    this.state = {
      data: false,
    };
  }

  componentDidMount = () => {
    socket.on("map", data => {
      console.log("on a la map");
      this.setState({ data: data })
      document.addEventListener("keydown", this._handlePress, false);
    });
  }

  _handlePress = (event) => {
    console.log(event.keyCode);
    if(_.has(VALID_CODES,event.keyCode)){
      console.log("on emit")
      socket.emit('update', {direction: VALID_CODES[event.keyCode]})
      event.preventDefault()
    }
  }

  generateMap = () => {
    if(!this.state.data){
      socket.emit('getMap')
      return
    }
      
    return (
      <div className="map">
        {this.state.data.map((l, y) => {
            var line = [];
            l.forEach((box, x) => {
              if (box === 'p')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.PLAYER}/>)
              if (box  === 'x')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.FIRE}/>)
              if (box === 'e')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.EMPTY}/>)
              if (box === 's')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.STONE}/>)
              if (box === 'b')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.BOMB}/>)
              if (box === 'c')
                line.push(<img key={x+y}className="box" alt="toto" src={Constants.CRATE}/>)
              if (box === 'd')
                line.push(<img key={x+y} className="box" alt="toto" src={Constants.FIRE}/>)
            })
            return (<div className="line">{line}</div>)			
          })
        }
        </div>
    )
	}
  render() {
    console.log("game");
    const { toggleGame } = this.props;
    console.log("state", this.state);
    return (
        <div style={{ textAlign: "center" }}>
         <button onClick={()=>toggleGame()}>Disconnect</button>
          {this.generateMap()}
        </div>
    );
  }
}
export default Game;