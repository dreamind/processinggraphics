Data = require('pdfkit/js/data');
JPEG = require('pdfkit/js/image/jpeg');
PNG = require('pdfkit/js/image/png');
PDFPage = require('pdfkit/js/page');
PDFDocument = require('pdfkit');

var pdfkitwrap = {};

(function() { // set enclosure

pdfkitwrap.document = function() {

  PDFImage2 = {};
  
  PDFImage2.consume = function(buffer, type) {
    var data, firstByte;
    this.contents = buffer;
    this.data = new Data(this.contents);
    this.filter = null;
    data = this.data;
    if (type == 'jpg') {
      return new JPEG(data);
    } else if (type == "png") {
      return new PNG(data);
    } else {
      throw new Error('Unknown image format.');
    }
  };
  
  PDFDocument.prototype.image2 = function(src, data, type, x, y, options) {
    var bh, bp, bw, h, hp, image, ip, label, pages, w, wp, _ref, _ref2, _ref3, _ref4, _ref5;
    if (options == null) options = {};
    if (typeof x === 'object') {
      options = x;
      x = null;
    }
    x = (_ref = x != null ? x : options.x) != null ? _ref : this.x;
    y = (_ref2 = y != null ? y : options.y) != null ? _ref2 : this.y;
    if (false && this._imageRegistry[src]) { // disable this
      _ref3 = this._imageRegistry[src], image = _ref3[0], label = _ref3[1], pages = _ref3[2];
      if (_ref4 = this.page, __indexOf.call(pages, _ref4) < 0) {
        pages.push(this.page);
      }
    } else {
      image = PDFImage2.consume(data, type);
      label = "I" + (++this._imageCount);
      this._imageRegistry[src] = [image, label, [this.page]];
    }
    w = options.width || image.width;
    h = options.height || image.height;
    if (options.width && !options.height) {
      wp = w / image.width;
      w = image.width * wp;
      h = image.height * wp;
    } else if (options.height && !options.width) {
      hp = h / image.height;
      w = image.width * hp;
      h = image.height * hp;
    } else if (options.scale) {
      w = image.width * options.scale;
      h = image.height * options.scale;
    } else if (options.fit) {
      _ref5 = options.fit, bw = _ref5[0], bh = _ref5[1];
      bp = bw / bh;
      ip = image.width / image.height;
      if (ip > bp) {
        w = bw;
        h = bw / ip;
      } else {
        h = bh;
        w = bh * ip;
      }
    }
    if (this.y === y) this.y += h;
    y = this.page.height - y - h;
    this.save();
    this.addContent("" + w + " 0 0 " + h + " " + x + " " + y + " cm");
    this.addContent("/" + label + " Do");
    this.restore();
    return this;
  };

  return PDFDocument;
}

}()); // end of enclosure

if (typeof exports !== "undefined") {
	exports = module.exports = pdfkitwrap;
}