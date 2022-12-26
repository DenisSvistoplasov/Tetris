Figure.stateArray = Field.array;

let isStarted = false, isGoingOn = false, isGameOver = false;
let currentFigure = null;
let gameSpeed = Field.speed;

Field.element.style.gridTemplate = 'repeat(' + Field.height + ', 1fr) / repeat(' + Field.width + ', 1fr)';
Field.element.style.gridGap = Math.floor(squareSide / 8) + 'px';
Field.element.style.padding = Math.floor(squareSide / 11 + 1) + 'px';

let wrapper = document.getElementsByClassName('wrapper')[0];

//Background
for (let i = 0; i < Field.width; i++) {
  for (let j = 0; j < Field.height; j++) {
    let square = (new Square(squareSide, {a: j, b: i})).element;
    Field.element.appendChild(square);
    square.classList.add('shadow-square');
  }
}


function handler(e) {
  if (e.key == 'ArrowDown') currentFigure.GoDown();
  if (e.key == 'ArrowLeft') currentFigure.GoLeft();
  if (e.key == 'ArrowRight') currentFigure.GoRight();
  if (e.key == 'ArrowUp') currentFigure.Rotate();
}

function addEvents() {document.addEventListener('keydown', handler);}
function removeEvents() {document.removeEventListener('keydown', handler);}

// Mobile version
function detectMob() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];
  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
if (detectMob()) {
  console.log(detectMob());
  document.getElementsByClassName('control')[0].style.display = 'block';
  document.getElementById('up').addEventListener('click', () => {
    document.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}));
  });
  document.getElementById('left').addEventListener('click', () => {
    document.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}));
  });
  document.getElementById('right').addEventListener('click', () => {
    document.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}));
  });
  document.getElementById('down').addEventListener('click', () => {
    document.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}));
  });
  document.getElementById('start').addEventListener('click', () => {
    document.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'Space'}));
  });
}

function initializeFigure() {
  currentFigure = new Figure(null, Field.element, squareSide, {a: 0, b: Math.floor(Field.width / 2 - 1)});
  addEvents();
}
initializeFigure();

function landing() {
  removeEvents();
  currentFigure.squares.forEach(sq => {
    Field.array[sq.position.a][sq.position.b] = sq;
  });
  currentFigure = null;
  let delay = checkFullRows() ? Field.delay : 50;
  setTimeout(() => {
    currentFigure = new Figure(null, Field.element, squareSide, {a: 0, b: Math.floor(Field.width / 2 - 1)});
    // Check game over
    let positions = currentFigure.GetPosition();
    for (let i = 0; i < positions.length; i++) {
      if (Field.array[positions[i].a][positions[i].b]) {
        GameOver();
        return false;
      }
    }
    setTimeout(() => {addEvents();}, 100);
  }, delay);
}

function checkFullRows() {
  let fullRows = [];
  for (let i = 0; i < Field.array.length; i++) {
    let isRowFull = true;
    for (let j = 0; j < Field.array[i].length; j++) if (!Field.array[i][j]) {
      isRowFull = false;
      break;
    };
    if (isRowFull) fullRows.push(i);
  }
  deleteFullRows(fullRows);
  return !!fullRows.length;
}

function deleteFullRows(fullRows) {
  let blink = setInterval(() => {
    fullRows.forEach(n => {
      Field.array[n].forEach(sq => {
        sq.element.classList.toggle('vanishing-square');
      });
    });
  }, 70);

  setTimeout(() => {
    clearInterval(blink);
    //vanish
    fullRows.forEach(n => {
      Field.array[n].forEach((sq, ind, ar) => {
        sq.element.style.display = 'none';
        ar[ind] = null;
      });
    });
    //dropping
    for (let i = 1; i < fullRows.length; i++) {
      for (let j = fullRows[fullRows.length - i] - 1; j > fullRows[fullRows.length - i - 1]; j--) {
        for (let k = 0; k < Field.array[j].length; k++) {
          if (!Field.array[j][k]) continue;
          Field.array[j][k].SetPosition({a: Field.array[j][k].position.a + i, b: Field.array[j][k].position.b});
          Field.array[j + i][k] = Field.array[j][k];
          Field.array[j][k] = null;
        }
      }
    }
    //dropping squares above upmost full row
    for (let j = fullRows[0] - 1; j >= 0; j--) {
      for (let k = 0; k < Field.array[j].length; k++) {
        if (!Field.array[j][k]) continue;
        Field.array[j][k].SetPosition({a: Field.array[j][k].position.a + fullRows.length, b: Field.array[j][k].position.b});
        Field.array[j + fullRows.length][k] = Field.array[j][k];
        Field.array[j][k] = null;
      }
    }
  }, Field.delay - 1);
}

// Time flow

function timeFlow() {
  if (isGoingOn) {
    if (isGoingDownAvailable()) {
      document.dispatchEvent(new Event('focus'));
      document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}));
      gameSpeed += .01;
    }
    else {
      landing();
    }
  }
  setTimeout(timeFlow, 1000 / gameSpeed);
}
timeFlow();

// "Modals"
let pause = document.getElementsByClassName('pause')[0];
let gameOver = document.getElementsByClassName('game-over')[0];
let start = document.getElementsByClassName('start')[0];

document.addEventListener('keydown', e => {
  if (e.code == 'Space') {
    if (!isStarted) {
      start.style.display = 'none';
      isStarted = true;
    }
    if (isGameOver) {
      restart();
      return false;
    }
    isGoingOn = !isGoingOn;
    if (isGoingOn) {
      addEvents();
      pause.style.display = 'none';
    }
    else {
      removeEvents();
      pause.style.display = 'block';
    }
  }
});

function isGoingDownAvailable() {
  if (!currentFigure) return true;
  let positions = currentFigure.GetPosition();
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].a + 1 >= Field.height || Field.array[positions[i].a + 1][positions[i].b]) return false;
  }
  return true;
}

function GameOver() {
  isGoingOn = false;
  isGameOver = true;
  gameOver.style.display = 'block';
}

function restart() {
  gameOver.style.display = 'none';
  Field.array.forEach(row => {
    row.forEach(sq => {
      sq && sq.element.remove();
    });
  });
  currentFigure.squares.forEach(sq => {
    sq.element.remove();
  });
  fullField();
  Figure.stateArray = Field.array;
  isGoingOn = true;
  isGameOver = false;
  initializeFigure();
}