const http = require('http');

const data = JSON.stringify({
    amount: 1000,
    month: 'FEB'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/goals/698f284a56581de1799dd225/pay',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
