const http = require('http');

function getStaffs(){
  http.get('http://localhost:3000/staffs', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('GET /staffs', res.statusCode, data));
  }).on('error', e => console.error('GET ERR', e.message));
}

function createStaff(){
  const postData = JSON.stringify({ name: 'AutoTester', department: 'QA', phone: '1234567890' });
  const opts = {
    hostname: 'localhost',
    port: 3000,
    path: '/staffs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  const req = http.request(opts, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => console.log('POST /staffs', res.statusCode, data));
  });
  req.on('error', e => console.error('POST ERR', e.message));
  req.write(postData);
  req.end();
}

// allow some time for server to be ready
setTimeout(()=>{
  getStaffs();
  setTimeout(createStaff, 500);
}, 1000);
