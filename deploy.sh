set -e

APP_DIR="/var/www/eco2"
REPO="https://github.com/Ryench1n/eco2.git"

echo "===== 1. System update ====="
sudo apt-get update -y

echo "===== 2. Install Node.js 20 ====="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "===== 3. Install PM2 & Nginx ====="
sudo npm install -g pm2
sudo apt-get install -y nginx

echo "===== 4. Clone / pull repository ====="
if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR" && git pull
else
    sudo git clone "$REPO" "$APP_DIR"
    sudo chown -R "$USER:$USER" "$APP_DIR"
fi

cd "$APP_DIR"

echo "===== 5. Install & build frontend ====="
npm install
npm run build

echo "===== 6. Install & build backend ====="
cd backend
npm install --omit=dev
npm run build
cp -r src/data dist/data 2>/dev/null || true
cd ..

echo "===== 7. Configure Nginx ====="
sudo cp nginx-ec2.conf /etc/nginx/sites-available/eco2
sudo ln -sf /etc/nginx/sites-available/eco2 /etc/nginx/sites-enabled/eco2
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "===== 8. Start backend with PM2 ====="
cd backend
pm2 delete eco-backend 2>/dev/null || true
pm2 start dist/index.js --name eco-backend
pm2 save
pm2 startup | tail -1 | sudo bash || true
cd ..

echo ""
echo "======================================"
echo "  Deploy complete!"
echo "  Open: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "======================================"
