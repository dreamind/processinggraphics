/**
 * @app.js Node connector for generating processing-based visualization.
 *
 * @author <a href="mailto:dreamind@gmail.com">Ivo Widjaja</a>
 * @version 0.0.1
 *
 * Note: put './deps/processing-js/processing.js' under the root folder of this app
 */

var fs = require("fs");
var express = require('express');
var uuid = require('node-uuid');
var ProcessingGraphics = require('./lib/processinggraphics');

var app = module.exports = express.createServer();
var tmpFolder = './tmp/';

// Configuration
app.configure(function(){
  app.use(express.bodyParser()); 
  app.use(express.methodOverride());
});

function mapStaticFolders() {
  app.use('/tmp', express.static(__dirname + '/tmp'));
  app.use('/pde', express.static(__dirname + '/pde'));  
  app.use('/', express.static(__dirname + '/html'));
  app.use('/pjs', express.static(__dirname + '/deps/processing-js')); 
}

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mapStaticFolders();
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mapStaticFolders();
});


/**

  Post must send "application/json" content-type
  post.body must be in the following format:

  Supported type: 'pdf', 'jpg' or 'pdf'

  { "pdeUrl": "http://localhost/~dreamind/test/processing/pde/simple.pde",
    "type": "png", 
    "params": {
      "x": [1, 2, 3],
      "y": [1, 4, 9],
      "color": ["red", "blue", "green"],
      "width": 200,
      "height": 200,
      "pdf": {
        "info": {"Title": "Processing Viz", "Author": "node processingjs processor"},
        "size": "a4",
        "layout": "portrait"
      }
    }
  }

 */

app.post('/processingjs', function(req, res){

  console.log( req.body, typeof req.body);
  var pdeUrl = req.body.pdeUrl;
  var type = req.body.type.toLowerCase();
	var params  = req.body.params; // already a JS object

  var mimeMap = {
    pdf : "application/pdf",
    png : "image/png",
    jpg : "image/jpeg"
  }

  ProcessingGraphics.generate(
    pdeUrl,
    params,
    type,
    function(rawString) {
      // for sending the actual data
      //res.header('Content-Disposition', 'attachment; filename=processing-output.'+type);
      //res.contentType('binary/octet-stream');
      //res.contentType(mimeMap[type]);
      //res.send(rawString);

      if (rawString) {
        var id = uuid.v4();
        var filename = id+'.'+type;
        fs.writeFile(tmpFolder+filename, rawString, 'binary');
        var jsonResponse = {
          status: 'success',
          graphicUrl: 'http://'+req.headers.host+'/tmp/'+filename
        }        
      } else {
        var jsonResponse = {
          status: 'error'
        }        
      }
      res.send(jsonResponse);
    }
  );
  
});

app.listen(2000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);