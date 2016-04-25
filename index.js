var express = require('express');
var path = require('path');
var app = express();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(request, response) {
 response.sendFile(__dirname + '/views/pages/personalDetails.html');
});

app.get('/listings', function(request, response) {
 response.sendFile(__dirname + '/views/pages/listingSelection.html');
});

app.get('/confirm', function(request, response) {
 response.sendFile(__dirname + '/views/pages/confirmation.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


