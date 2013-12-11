var fs = require('fs');
var express = require('express');
var Lazy = require('lazy');
var passStream = require('pass-stream');
var promisePipe = require("promisepipe");

var app = express();

/**
 * Transforms sequence intervals into fasta file positions and passes them on to a callback.
 * 
 * Transforms a sequence interval into fasta file positions, correcting for the fasta header
 * at the top of the file, newlines after 70 bases, for sequence starting at 1 instead of 0
 * and for the interval stop being "up to" instead of "up to and including".
 * 
 * @param {Integer}  sequenceStart Starting coordinate of dna sequence
 * @param {Integer}  sequenceStop  Stopping coordinate of dna sequence
 * @param {String}   filePath      Fasta file containing sequence
 * @param {Function} callback      Callback, gets file start pos as first argument, file stop pos
 *                                 as second argument.
 */
var sequenceIntervalToFileInterval = function (sequenceStart, sequenceStop, filePath, callback) {
  var sequenceStartPos = 0;
  var sequenceLineLength = 70;
  
  new Lazy(fs.createReadStream(filePath))
    .lines
    .takeWhile(function (line) {
      line = line.toString();
      
      return line[0] === '>' || line[0] === ' ';
    }).forEach(function (line) {
      sequenceStartPos += line.toString().length + 1;
    }).on('pipe', function () {
      var fileStartPos = sequenceStart + Math.floor(sequenceStart / sequenceLineLength) + sequenceStartPos - 1;
      fileStartPos = sequenceStart % sequenceLineLength === 0 ? fileStartPos - 1 : fileStartPos;
      var fileStopPos = sequenceStop + Math.floor(sequenceStop / sequenceLineLength) + sequenceStartPos - 2;
      fileStopPos = sequenceStop % sequenceLineLength === 0 ? fileStopPos - 1 : fileStopPos;
      
      callback(fileStartPos, fileStopPos);
    });
};

var newLineFilter = function (data, encoding, cb) {
  data = data.toString().replace(/(\r\n|\n|\r)/gm, '');
  
  this.push(data);
  cb();
};

app.get('/sequencedata/homo_sapiens/chromosome/:chromosomeId', function(req, res){
  var sequenceFilePath = 'C:/Users/Roland/Workspace/GenomeExplorer/data/homo_sapiens/sequences/chr'+ 
    req.params.chromosomeId +'.fa';
  var start = Number(req.query.start);
  var stop = Number(req.query.stop);
  
  fs.exists(sequenceFilePath, function(exists) {
    if (exists === false) {
      throw new Error('Could not find a sequence file for chromosome id "'+ 
        req.params.chromosomeId +'", tried '+ sequenceFilePath);
    }
  });
  
  if (!stop || stop - start > 500000) {
    throw new Error('Query parameters start and stop should be set and the difference should not be greater than 500000.');
  }
  
  sequenceIntervalToFileInterval(start, stop, sequenceFilePath, function (fileStartPos, fileStopPos) {
    res.setHeader("content-type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    
    promisePipe(
      fs.createReadStream(sequenceFilePath, {start: fileStartPos, end: fileStopPos}),
      passStream(newLineFilter),
      res
    ).then(function () {
      console.log('Succesfully streamed sequence '+ start +'-'+ stop +' on chromosome '+ req.params.chromosomeId +'.');
    });
  });
});

app.listen(5000, function() {
  console.log("Listening on 5000");
});
