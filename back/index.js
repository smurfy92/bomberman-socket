const app = require('express')()
const port = 8000
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log("got 1 connection")
})

const map = [
  ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e'],
  ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
  ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  ['c', 's', 'c', 'c', 's', 'c', 's', 'c'],
  ['c', 's', 'c', 's', 'c', 'c', 's', 'c'],
  ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
  ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e']
]
const env = {
  map:[
    ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e'],
    ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
    ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
    ['c', 's', 'c', 'c', 's', 'c', 's', 'c'],
    ['c', 's', 'c', 's', 'c', 'c', 's', 'c'],
    ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
    ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
    ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e']
  ],
  explosionMap:[
    ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e'],
    ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
    ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
    ['c', 's', 'c', 'c', 's', 'c', 's', 'c'],
    ['c', 's', 'c', 's', 'c', 'c', 's', 'c'],
    ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
    ['e', 's', 'c', 's', 's', 'c', 's', 'e'],
    ['e', 'e', 'c', 'c', 'c', 'c', 'e', 'e'],
  ],
  player:{
    pos:{
      y: 7,
      x: 0
    },
    fireRange: 1
  }
}

updatePlayer = (oldY, oldX, newY, newX) => {
  if (env.map[oldY][oldX] == 'd')
  {
    env.map[oldY][oldX] = 'e';
    env.player.fireRange++;
  }		
  env.player.pos.y = newY
  env.player.pos.x = newX
}

isValidMove = (y, x) => {
  if (env.map[y] && env.map[y][x] && (env.map[y][x] === 'e' || env.map[y][x] === 'b' || env.map[y][x] === 'd'))
    return true;
  return false;
}

movePlayer = (direction) => {
  if (direction === 'up'){
    if (isValidMove(env.player.pos.y - 1, env.player.pos.x)){
      updatePlayer(env.player.pos.y, env.player.pos.x, env.player.pos.y - 1, env.player.pos.x)
    }
  }
  if (direction === 'down'){
    if (isValidMove(env.player.pos.y + 1, env.player.pos.x)){
      updatePlayer(env.player.pos.y, env.player.pos.x, env.player.pos.y + 1, env.player.pos.x)
    }
  }
  if (direction === 'left'){
    if (isValidMove(env.player.pos.y, env.player.pos.x - 1)){
      updatePlayer(env.player.pos.y, env.player.pos.x, env.player.pos.y, env.player.pos.x - 1)
    }
  }
  if (direction === 'right'){
    if (isValidMove(env.player.pos.y, env.player.pos.x + 1)){
      updatePlayer(env.player.pos.y, env.player.pos.x, env.player.pos.y, env.player.pos.x + 1)
    }
  }
}

const parsemap = () => {
  let parsedMap = []
  for (var y = 0; y < env.map.length; y++){
    var line = []
    for (var x = 0; x < env.map[y].length; x++){
      if (y === env.player.pos.y && x === env.player.pos.x)
        line.push('p')
      else
        line.push(env.map[y][x])
    }
    parsedMap.push(line);
  }
  return parsedMap
}

io.on('connection', function (socket) {
    socket.emit('map', parsemap());
  
    socket.on('update', function (data) {
      console.log(data);
      if(data.direction)
        movePlayer(data.direction)
      console.log("map mis a jour")
      socket.emit('map', parsemap());  
    });

    socket.on('getMap', function (data) {
      console.log("on resend map")
      socket.emit('map', parsemap());  
    });


  });