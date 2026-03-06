const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ headers: res.headers, statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  const loginData = JSON.stringify({ email: 'arhamz@codeiu.in', password: 'password' }); // doesn't matter if it fails
  const loginRes = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
  });
  console.log("Login Status:", loginRes.statusCode);
  const cookies = loginRes.headers['set-cookie'];
  console.log("Login Cookies:");
  if(cookies) cookies.forEach(c => console.log(c));

  // extract the raw cookie strings to send
  const cookieString = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';

  const logoutRes = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/auth/logout', method: 'POST',
    headers: { 'Cookie': cookieString }
  });
  console.log("Logout Status:", logoutRes.statusCode);
  const logoutCookies = logoutRes.headers['set-cookie'];
  console.log("Logout Cookies:");
  if(logoutCookies) logoutCookies.forEach(c => console.log(c));

  const checkRes = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/auth/check-Auth?t=123', method: 'GET',
    headers: { 'Cookie': cookieString, 'Cache-Control': 'no-cache' }
  });
  console.log("CheckAuth Status (using original login cookie):", checkRes.statusCode);
}
run();
