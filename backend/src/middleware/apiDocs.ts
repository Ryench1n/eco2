import type { Request, Response } from 'express';
import mongoose from 'mongoose';

// API Testing Dashboard Route
export function setupApiDocs(expressApp: any) {
  expressApp.get('/api-docs', (req: Request, res: Response) => {
    const dbConnected = mongoose.connection.readyState === 1;
    const dbColor = dbConnected ? '#34c759' : '#ff3b30';
    const dbText = dbConnected ? 'Database: Connected ✓' : 'Database: Disconnected';
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ECO API - Test Dashboard</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          h1 {
            color: #667eea;
            margin-bottom: 10px;
          }
          .status {
            display: flex;
            gap: 20px;
            margin-top: 15px;
          }
          .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #00d084;
          }
          .endpoints {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
          }
          .endpoint {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .endpoint h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 8px;
          }
          .method.get { background: #61affe; color: white; }
          .method.post { background: #49cc90; color: white; }
          .method.put { background: #fca130; color: white; }
          .method.delete { background: #f93e3e; color: white; }
          .path {
            font-family: monospace;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
            margin: 10px 0;
            word-break: break-all;
          }
          .description {
            color: #666;
            font-size: 14px;
            margin: 10px 0;
          }
          button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
          }
          button:hover {
            background: #764ba2;
            transform: translateY(-2px);
          }
          .response {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            color: #333;
            border-left: 4px solid #667eea;
          }
          .error {
            color: #f93e3e;
          }
          .success {
            color: #00d084;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>🎮 ECO Gaming Platform</h1>
            <p>Backend API Test Dashboard</p>
            <div class="status">
              <div class="status-item">
                <div class="status-dot"></div>
                <span>Server: Running ✓</span>
              </div>
              <div class="status-item">
                <div class="status-dot"></div>
                <span>Port: 3000 ✓</span>
              </div>
              <div class="status-item" id="db-status-item">
                <div class="status-dot" id="db-dot" style="background: ${dbColor};"></div>
                <span id="db-label">${dbText}</span>
              </div>
            </div>
          </header>

          <div class="endpoints">
            <div class="endpoint">
              <h3><span class="method get">GET</span> Health Check</h3>
              <div class="path">/health</div>
              <p class="description">Check server and database status</p>
              <button onclick="testEndpoint('health')">Test</button>
              <div id="health" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method get">GET</span> API Root</h3>
              <div class="path">/</div>
              <p class="description">Get API documentation</p>
              <button onclick="testEndpoint('root')">Test</button>
              <div id="root" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method post">POST</span> Register User</h3>
              <div class="path">/api/auth/register</div>
              <p class="description">Create a new user account</p>
              <button onclick="testEndpoint('register')">Test</button>
              <div id="register" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method post">POST</span> Login</h3>
              <div class="path">/api/auth/login</div>
              <p class="description">Authenticate user</p>
              <button onclick="testEndpoint('login')">Test</button>
              <div id="login" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method get">GET</span> Users</h3>
              <div class="path">/api/users</div>
              <p class="description">List all users (public)</p>
              <button onclick="testEndpoint('users')">Test</button>
              <div id="users" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method get">GET</span> PC Centers</h3>
              <div class="path">/api/pc-centers</div>
              <p class="description">List all PC gaming centers</p>
              <button onclick="testEndpoint('pccenters')">Test</button>
              <div id="pccenters" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method get">GET</span> Bookings</h3>
              <div class="path">/api/bookings</div>
              <p class="description">User bookings (requires auth)</p>
              <button onclick="testEndpoint('bookings')">Test</button>
              <div id="bookings" class="response"></div>
            </div>

            <div class="endpoint">
              <h3><span class="method get">GET</span> Reviews</h3>
              <div class="path">/api/reviews</div>
              <p class="description">View reviews (requires auth)</p>
              <button onclick="testEndpoint('reviews')">Test</button>
              <div id="reviews" class="response"></div>
            </div>
          </div>
        </div>

        <script>
          async function checkDbStatus() {
            try {
              const res = await fetch('/health');
              const data = await res.json();
              const connected = data.database === 'connected';
              document.getElementById('db-dot').style.background = connected ? '#34c759' : '#ff3b30';
              document.getElementById('db-label').textContent = connected ? 'Database: Connected ✓' : 'Database: Disconnected';
            } catch {
              document.getElementById('db-dot').style.background = '#ff3b30';
              document.getElementById('db-label').textContent = 'Database: Disconnected';
            }
          }
          checkDbStatus();

          async function testEndpoint(endpoint) {
            const resultDiv = document.getElementById(endpoint);
            resultDiv.innerHTML = '<span class="success">Testing...</span>';

            try {
              let response;
              let config = { headers: { 'Content-Type': 'application/json' } };

              switch(endpoint) {
                case 'health':
                  response = await fetch('/health');
                  break;
                case 'root':
                  response = await fetch('/');
                  break;
                case 'register':
                  response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'test' + Date.now() + '@test.com',
                      password: 'Password123!',
                      name: 'Test User',
                      user_type: 'player'
                    })
                  });
                  break;
                case 'login':
                  response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'player@test.com',
                      password: 'password123'
                    })
                  });
                  break;
                case 'users':
                  response = await fetch('/api/users');
                  break;
                case 'pccenters':
                  response = await fetch('/api/pc-centers');
                  break;
                case 'bookings':
                  response = await fetch('/api/bookings');
                  break;
                case 'reviews':
                  response = await fetch('/api/reviews');
                  break;
              }

              const data = await response.json();
              resultDiv.innerHTML = '<span class="success">✓ Status ' + response.status + '</span><br><pre>' + JSON.stringify(data, null, 2).substring(0, 300) + '...</pre>';
            } catch (error) {
              resultDiv.innerHTML = '<span class="error">✗ Error: ' + error.message + '</span>';
            }
          }
        </script>
      </body>
      </html>
    `);
  });
}
