var grid, next;

var dA = 1; // diffusion rate of chemical A
var dB = 0.5; // diffusion rate of chemical B
var f = 0.055; // how fast chem A is being added / feed rate.
var k = 0.062; // kill rate - how fast B is being removed

// "mitosis" simulation
// f=.0367, k=.0649;
// "coral growth" simulation
f=.0545, k=.062;

var dT = 1;

setup = () => {
  createCanvas(600,600);
  pixelDensity(1);
  grid = []; // current generation
  next = []; // next generation
  // setup the grid
  for (var i = 0; i < width; i++) {
    grid[i] = [];
    next[i] = [];
    for (var j = 0; j < height; j++) {
      // each spot in grid starts out with 0 of chemical A and 0 of chemical B
      grid[i][j] = { a: 1, b: 0 };
      next[i][j] = { a: 1, b: 0 };
    }
  }

  for (var i = 290; i < 310; i++) {
    for (var j = 290; j < 310; j++) {
      // each spot in grid starts out with 0 of chemical A and 0 of chemical B
      grid[i][j].b = 1;
    }
  }

}

draw = () => {
  background(51);
  for (var x = 1; x < width-1; x++) {
    for (var y = 1; y < height-1; y++) {

      var a = grid[x][y].a;
      var b = grid[x][y].b;
      next[x][y].a =  a +
                      ((dA * laplaceA(x,y)) -
                      (a * b * b) +
                      (f * (1 - a))) * dT;
      next[x][y].b =  b +
                      ((dB * laplaceB(x,y)) +
                      (a * b * b) -
                      ((k + f) * b)) * dT;

    }
  }

  loadPixels();

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pix = (x + y * width) * 4;
      pixels[pix + 0] = next[x][y].a * 255;
      pixels[pix + 1] = 0;
      pixels[pix + 2] = next[x][y].b * 255;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
  swap();
}

swap = () => {
  var temp = grid;
  grid = next;
  next = temp;
}

// The Laplacian is performed with a 3x3 convolution with center weight -1, adjacent neighbors .2, and diagonals .05.
laplaceA = (x,y) => {
  var sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x-1][y].a * 0.2;
  sumA += grid[x+1][y].a * 0.2;
  sumA += grid[x][y-1].a * 0.2;
  sumA += grid[x][y+1].a * 0.2;
  sumA += grid[x+1][y+1].a * 0.05;
  sumA += grid[x+1][y-1].a * 0.05;
  sumA += grid[x-1][y+1].a * 0.05;
  sumA += grid[x-1][y-1].a * 0.05;
  return sumA;
}

laplaceB = (x,y) => {
  var sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x-1][y].b * 0.2;
  sumB += grid[x+1][y].b * 0.2;
  sumB += grid[x][y-1].b * 0.2;
  sumB += grid[x][y+1].b * 0.2;
  sumB += grid[x+1][y+1].b * 0.05;
  sumB += grid[x+1][y-1].b * 0.05;
  sumB += grid[x-1][y+1].b * 0.05;
  sumB += grid[x-1][y-1].b * 0.05;
  return sumB;
}
