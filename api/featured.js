var http = require('http');
module.exports = (req, res) => {
  var options = {
    host: 'api.scratch.mit.edu',
    path: '/proxy/featured?offset=' + req.body.offset + '&limit=20'
  };
  http.request(options, function() {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      res.json({
        body: str
      })
    });
  }).end();
}