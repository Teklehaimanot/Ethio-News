# Ethio News — Docker deploy (diroconsultancy.com)

## Hostnames

| Service | URL |
|--------|-----|
| Admin | https://ethio-news.diroconsultancy.com |
| API | https://api.diroconsultancy.com |
| Scraper trigger | `http://127.0.0.1:8080` (localhost only) |

Mobile `baseUrl` should be: `https://api.diroconsultancy.com`

## 1. DNS

Create **A** records pointing to the server IP:

- `api.diroconsultancy.com`
- `ethio-news.diroconsultancy.com`

## 2. Server packages

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
sudo usermod -aG docker $USER
# log out and back in
```

## 3. Project env files

```bash
cd /opt/ethio-news   # or wherever you clone the repo

cp .env.example .env
# edit INGEST_API_TOKEN

cp ethio-news-api/.env.example ethio-news-api/.env
# set ACCESS_TOKEN_SECRET, API_KEY, Google client IDs

cp ethio-news-scraper/.env.example ethio-news-scraper/.env
# set Telegram keys if needed; keep RUN_ON_START=false
```

`docker-compose.yml` forces Mongo to `mongodb://mongo:27017/ndmc-mobile` inside the network.

## 4. Start stack

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api scraper
```

## 5. Nginx + HTTPS

```bash
sudo cp deploy/nginx/api.diroconsultancy.com.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/ethio-news.diroconsultancy.com.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/api.diroconsultancy.com.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ethio-news.diroconsultancy.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d api.diroconsultancy.com -d ethio-news.diroconsultancy.com
```

## 6. Create admin user (first login)

There is no default admin until you create one:

```bash
cd /path/to/ethio-news   # folder with docker-compose.yml

docker compose exec api node scripts/createAdmin.js
```

Defaults:

- Email: `admin@diroconsultancy.com`
- Password: `AdminPass123`

Custom values:

```bash
docker compose exec \
  -e ADMIN_EMAIL=you@example.com \
  -e ADMIN_PASSWORD='YourSecurePass' \
  -e ADMIN_NAME=Admin \
  api node scripts/createAdmin.js
```

Then open https://ethio-news.diroconsultancy.com and sign in with that email/password.

List users:

```bash
docker compose exec mongo mongosh ndmc-mobile --eval 'db.users.find({}, {name:1,email:1,role:1,active:1}).toArray()'
```

## 7. Manual scrape

```bash
curl -X POST http://127.0.0.1:8080/ingest \
  -H "Authorization: Bearer YOUR_INGEST_API_TOKEN"
```

Health check:

```bash
curl http://127.0.0.1:8080/health
```

Scheduled runs use `CRON_HOURS` (Africa/Addis_Ababa) from the scraper `.env`.

## 8. Telegram session (optional)

First login may need an interactive Telethon session. Create the session on a machine with phone access, then copy `*.session` into the `scraper_sessions` volume (or mount a host folder).

Set `TELEGRAM_SESSION_NAME=sessions/ethio_news_scraper` so the file lives under `/app/sessions`.

## Useful commands

```bash
docker compose restart api
docker compose logs -f scraper
docker compose down
docker compose up -d --build admin   # rebuild if API URL changes
```
