processinggraphics
==================

A node.js wrapper to processingjs to provide a seamless support to both server/client side processingjs.
Currently supporting processingjs (client side), pdf, png, and jpg (server side).

Running the app and example
---------------------------

First, call the server app:

    node app.js

After running the app, call:

    node test.js

This should generate test.pdf, test.jpg, and test.png.

To run the demo, load the following url in the browser:

    http://localhost:2000/  

Parameter can be passed from JavaScript to the pde code via `this.externals.sketch.params`.
The type of this parameter is JavaScript object, which will be *stringified* to server-side processor.