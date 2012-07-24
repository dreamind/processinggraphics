/**
 * @test.js Unit test for this app
 *
 * @author <a href="mailto:dreamind@gmail.com">Ivo Widjaja</a>
 * @version 0.0.1
 *
 * Note: put './deps/processing-js/processing.js' under the root folder of this app
 */

var ProcessingGraphics = require('./lib/processinggraphics');
var fs = require("fs");

// test pdf
ProcessingGraphics.generate(
  "http://localhost:2000/pde/simple.pde",
  { width: 400,
    height: 400
  },
  "pdf",
  function(rawString) {
    fs.writeFile('test.pdf', rawString, 'binary');
  }
);

// test jpg
ProcessingGraphics.generate(
  "http://localhost:2000/pde/simple.pde",
  { width: 400,
    height: 400
  },
  "jpg",
  function(rawString) {
    fs.writeFile('test.jpg', rawString, 'binary');
  }
);

// test png
ProcessingGraphics.generate(
  "http://localhost:2000/pde/simple.pde",
  { width: 400,
    height: 400
  },
  "png",
  function(rawString) {
    fs.writeFile('test.png', rawString, 'binary');
  }
);



