const http = require('http');
const data = JSON.stringify({ messages: [{ role: 'user', parts: [{ text: 'Hello' }] }] });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData.substring(0, 200));
  });
});

req.on('error', (e) => {
  console.log('Error:', e.message);
});

req.write(data);
req.end();