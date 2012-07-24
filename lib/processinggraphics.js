/**
 * @processinggraphics.js Node-based image generator for processing visualization.
 *
 * @author <a href="mailto:dreamind@gmail.com">Ivo Widjaja</a>
 * @version 0.0.1
 *
 */
var fs = require('fs');
var request = require('request');
var Processing = require('processing');

var pdfkitwrap = require('./pdfkitwrap');
var PDFDocument = pdfkitwrap.document();

var ProcessingGraphics = {};

(function() { // set enclosure

var jpegDefaultQuality = 80;
var jpegDefaultBufSize = 2048;

var pdfDefaultWidth = 600;
var pdfDefaultHeight = 450;
var pdfDefaultMargin = 40;

// generate image buffer that can be push to browser or a file
ProcessingGraphics.generate = function(pdeUrl, params, type, callback) { //

  var options = {url:pdeUrl};
  params.callback = function() {}; // set dummy callback

  request.get(
    options,
    function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var canvas = Processing.createElement('canvas'); 
        var compiled = Processing.compile(body.toString('utf-8'));
        compiled.params = params; // inject the params
        var p5 = new Processing(canvas, compiled);
        var stream;

        if (type == 'pdf') {
          params.pdf = params.pdf || {
            info: {Title: 'Processing Viz', Author: 'node processingjs processor'},
            size: 'a4',
            layout: 'landscape'
          };
          var doc = new PDFDocument();
          canvas.toBuffer(function(err, buffer) {
            doc.image2('dummy.png', buffer, 'png', params.pdf.x || pdfDefaultMargin, params.pdf.y || pdfDefaultMargin,
              {width: params.width || pdfDefaultWidth, height: params.height || pdfDefaultHeight});
            doc.output(function(pdfData) {
              callback(pdfData); // in String
            });
          });
          return;
        } else if (type == 'png') {
          stream = canvas.createPNGStream();
        } else if (type == 'jpg') {
          var jpegQuality = params.jpegQuality || jpegDefaultQuality;
          stream = canvas.createJPEGStream({
            bufsize : jpegDefaultBufSize,
            quality : jpegQuality
          });
        } else {
          callback(null);
          return;
        }
        var imgData = '';
        stream.on('data', function(chunk){
          imgData += chunk.toString('binary'); // let's use String
        });        
        stream.on('end', function(){
          callback(imgData);
        });
      } else {
        callback(null);
      }
    }
  );
}

}()); // end of enclosure

if (typeof exports !== "undefined") {
	exports = module.exports = ProcessingGraphics;
}
