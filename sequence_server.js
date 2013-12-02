var fs = require('fs');
var express = require('express');
var app = express();

app.get('/sequencedata/homo_sapiens/chromosome/:chromosomeId', function(req, res){
  var sequenceFilePath = 'C:/Users/Roland/Workspace/GenomeExplorer/data/homo_sapiens/sequences/chr'+ req.params.chromosomeId +'.fa';
  var start = Number(req.query.start);
  var stop = Number(req.query.stop);
  
  fs.exists(sequenceFilePath, function(exists) {
    if (exists === false) {
      throw new Error('Could not find a sequence file for chromosome id "'+ req.params.chromosomeId +'", tried '+ sequenceFilePath);
    }
  });
  
  if (!stop|| stop - start > 100000) {
    throw new Error('Query parameters start and stop should be set and the difference should not be greater than 100000.');
  }
  
  res.setHeader("content-type", "text/plain");
  fs.createReadStream(sequenceFilePath, {start: start, end: stop}).pipe(res);
});

app.listen(5000, function() {
  console.log("Listening on 5000");
});