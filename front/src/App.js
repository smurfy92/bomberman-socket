import React, { Component } from "react";
import Game from './components/game.js'


class App extends Component {
  constructor() {
    super();
    this.state = {
      isGame: false
    };
  }
  componentDidMount() {
  }

  toggleGame = () => {
    this.setState({isGame:!this.state.isGame})
  }
  render() {
    console.log("page d'accueil");
    if(!this.state.isGame)
    {
      return (
        <div style={{ textAlign: "center" }}>
         <button onClick={() => this.toggleGame()}>Play</button>
        </div>
      )
    }else {
      return <Game toggleGame={this.toggleGame}/>
    }
    

  }
}
export default App;