Object xparam;

void setup() {
  console.log("setup");
  console.log(this.externals.sketch.params);
  xparam = this.externals.sketch.params;

  size(xparam.width, xparam.height);
  noLoop();
}

void draw() {
  xparam.callback("startdraw");
  console.log("draw");
  background(102);
  stroke(255);
  line(40, 40, 100, 100);
  xparam.callback("enddraw");
}