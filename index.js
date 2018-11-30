const COLORS = {
  BACKGROUND_COLOR: '#000',
  GRIDE_COLORS: '#333',
  POINT: '#FFF'
};
let points = [];
let pointColor = '#FFF';
let context = {};

document.onreadystatechange = () => {
  document.readyState == 'complete' && createCanvas();
};

function getCanvasDimensions() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}

function createCanvas() {
  let canvasElement = document.createElement('canvas');
  context = canvasElement.getContext('2d');

  const canvasDimensions = getCanvasDimensions();
  context.canvas.setAttribute('id', 'main-canvas');
  context.canvas.width = canvasDimensions.width;
  context.canvas.height = canvasDimensions.height;
  context.fillStyle = COLORS.BACKGROUND_COLOR;
  context.strokeStyle = COLORS.GRIDE_COLORS;

  context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);

  context.canvas.addEventListener('click', e => {
    const position = {
      x: e.clientX,
      y: e.clientY
    };
    drawCircle(context, position.x, position.y, 5, pointColor);
    pointClick(position);
  });

  drawCartesianCoordinate(context);
  document.body.appendChild(context.canvas);
  context.strokeStyle = pointColor;
}

function drawCartesianCoordinate() {
  const gridSize = 25;

  const canvasWidth = context.canvas.width;
  const canvasHeight = context.canvas.height;

  const numberOfLinesX = Math.floor(canvasHeight / gridSize);
  const numberOfLinesY = Math.floor(canvasWidth / gridSize);

  for (let i = 0; i <= numberOfLinesX; i++) {
    context.beginPath();
    context.lineWidth = 1;

    if (i === numberOfLinesX) {
      context.moveTo(0, gridSize * i);
      context.lineTo(canvasWidth, gridSize * i);
    } else {
      context.moveTo(0, gridSize * i + 0.5);
      context.lineTo(canvasWidth, gridSize * i + 0.5);
    }
    context.stroke();
  }

  for (let i = 0; i <= numberOfLinesY; i++) {
    context.beginPath();
    context.lineWidth = 1;

    if (i === numberOfLinesY) {
      context.moveTo(gridSize * i, 0);
      context.lineTo(gridSize * i, canvasHeight);
    } else {
      context.moveTo(gridSize * i + 0.5, 0);
      context.lineTo(gridSize * i + 0.5, canvasHeight);
    }
    context.stroke();
  }
}

function drawCircle(context, x, y, r, pointColor) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = pointColor;
  context.fill();
}

function pointClick(coordinates) {
  points.push(coordinates);
  shouldPlot();
}

function shouldPlot() {
  if (!points || !points.length || points.length != 4) {
    return;
  }
  plotBezierOnCanvas(points);
}

function plotBezierOnCanvas() {
  context.moveTo(points[0].x, points[0].y);
  const localAcc = document.getElementById('accuracy').value + 0;

  for (let i = 0; i < 1; i += parseFloat(localAcc)) {
    let p = calcBezier(i, { ...points[0] }, { ...points[1] }, { ...points[2] }, { ...points[3] });
    context.lineTo(p.x, p.y);
  }

  context.stroke();
  resetPoints();
}

function resetPoints() {
  pointColor = COLORS.POINT;
  context.strokeStyle = pointColor;
  points = [];
}

function calcBezier(t, p0, p1, p2, p3) {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x) - cX;
  const aX = p3.x - p0.x - cX - bX;

  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;

  const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
  const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

  return {
    x: x,
    y: y
  };
}
