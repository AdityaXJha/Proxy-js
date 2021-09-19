let express = require('express')
let app = express()
let https = require('https');
let http = require('http');
const { response } = require('express');


app.use('/', function(clientRequest, clientResponse) {
    let url;
    // You can set any url you like below I personally made it for scrolling through google so its set to google's url.
    url = 'https://www.google.com'
    let parsedHost = url.split('/').splice(2).splice(0, 1).join('/')
    let parsedPort;
    let parsedSSL;
    if (url.startsWith('https://')) {
        parsedPort = 443
        parsedSSL = https
    } else if (url.startsWith('http://')) {
        parsedPort = 80
        parsedSSL = http
    }
    let options = { 
      hostname: parsedHost,
      port: parsedPort,
      path: clientRequest.url,
      method: clientRequest.method,
      headers: {
        'User-Agent': clientRequest.headers['user-agent']
      }
    };  
  
    let serverRequest = parsedSSL.request(options, function(serverResponse) { 
      let body = '';   
      if (String(serverResponse.headers['content-type']).indexOf('text/html') !== -1) {
        serverResponse.on('data', function(chunk) {
          body += chunk;
        }); 
  
        serverResponse.on('end', function() {
          // Make changes to HTML files when they're done being read.
          body = body.replace("Server ended the conection" );
  
          clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
          clientResponse.end(body);
        }); 
      }   
      else {
        serverResponse.pipe(clientResponse, {
          end: true
        }); 
        clientResponse.contentType(serverResponse.headers['content-type'])
      }   
    }); 
  
    serverRequest.end();
  });    


  app.listen(3000)
  console.log('Running on localhost:3000')
