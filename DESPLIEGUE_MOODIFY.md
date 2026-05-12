# Moodify — Guia de Desplegament des de Zero (Proxmox + Apache)

## Requisits del servidor
- Ubuntu 22.04 LTS (VM en Proxmox)
- Minim 4GB RAM per a l'app + BD (sense IA)
- Minim 24GB RAM o GPU per a Ollama amb qwen3-vl:30b
- Acces root o sudo

---

## PAS 1 — Actualitzar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

---

## PAS 2 — Instal·lar Apache + PHP

```bash
sudo apt install apache2 -y
sudo apt install php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml \
  php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath php8.2-tokenizer -y
```

Activar moduls necessaris:

```bash
sudo a2enmod rewrite headers
sudo a2enmod proxy_fcgi setenvif
sudo a2enconf php8.2-fpm
sudo systemctl restart apache2
```

---

## PAS 3 — Instal·lar MySQL

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

Crear la base de dades i l'usuari:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE moodify_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moodify'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURA';
GRANT ALL PRIVILEGES ON moodify_backend.* TO 'moodify'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## PAS 4 — Instal·lar Composer

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

---

## PAS 5 — Instal·lar Node.js (per al build de la landing)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

---

## PAS 6 — Clonar el repositori

```bash
cd /var/www
sudo git clone https://github.com/kyufle/moodify.git
sudo chown -R $USER:$USER /var/www/moodify
```

---

## PAS 7 — Configurar el Backend (Laravel)

```bash
cd /var/www/moodify/moodify_backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
nano .env
```

Canviar aquestes linies al .env:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=http://api.tudomini.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moodify_backend
DB_USERNAME=moodify
DB_PASSWORD=TU_PASSWORD_SEGURA

OLLAMA_HOST=http://127.0.0.1:11434
```

Continuar la instal·lacio:

```bash
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

Donar permisos d'escriptura a Laravel:

```bash
sudo chown -R www-data:www-data /var/www/moodify/moodify_backend/storage
sudo chown -R www-data:www-data /var/www/moodify/moodify_backend/bootstrap/cache
sudo chmod -R 775 /var/www/moodify/moodify_backend/storage
sudo chmod -R 775 /var/www/moodify/moodify_backend/bootstrap/cache
```

---

## PAS 8 — Construir la Landing Web

```bash
cd /var/www/moodify
npm install
npm run build
```

Aixo genera la carpeta /var/www/moodify/dist amb la web estatica llesta.

---

## PAS 9 — Configurar Apache

### VirtualHost per a la Landing Web

```bash
sudo nano /etc/apache2/sites-available/moodify-landing.conf
```

Enganxar aixo exactament:

```apache
<VirtualHost *:80>
    ServerName tudomini.com
    DocumentRoot /var/www/moodify/dist

    <Directory /var/www/moodify/dist>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/landing_error.log
    CustomLog ${APACHE_LOG_DIR}/landing_access.log combined
</VirtualHost>
```

### VirtualHost per a la API (Laravel)

```bash
sudo nano /etc/apache2/sites-available/moodify-api.conf
```

Enganxar aixo exactament:

```apache
<VirtualHost *:80>
    ServerName api.tudomini.com
    DocumentRoot /var/www/moodify/moodify_backend/public

    <Directory /var/www/moodify/moodify_backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/api_error.log
    CustomLog ${APACHE_LOG_DIR}/api_access.log combined
</VirtualHost>
```

### Activar els sites i desactivar el default

```bash
sudo a2ensite moodify-landing.conf moodify-api.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

---

## PAS 10 — Instal·lar Ollama (IA)

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Descarregar el model (triga bastant, son ~20GB):

```bash
ollama pull qwen3-vl:30b
```

Verificar que esta corrent:

```bash
curl http://127.0.0.1:11434/api/tags
```

Habilitar Ollama com a servei per que arranqui sol:

```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

NOTA: Si el servidor no te GPU o suficient RAM per a qwen3-vl:30b, usar un
model mes lleuger com qwen2.5:7b i canviar el nom del model a:
  /var/www/moodify/moodify_backend/app/Services/PsicologoService.php
  (la linia que diu 'model' => 'qwen3-vl:30b')

---

## PAS 11 — Verificar que tot funciona

  Apache actiu    ->  sudo systemctl status apache2
  PHP-FPM actiu   ->  sudo systemctl status php8.2-fpm
  MySQL actiu     ->  sudo systemctl status mysql
  Ollama actiu    ->  sudo systemctl status ollama
  Landing carrega ->  Obrir http://tudomini.com al navegador
  API respon      ->  curl http://api.tudomini.com/api/login (ha de tornar JSON)
  IA respon       ->  curl http://127.0.0.1:11434/api/tags

---

## PAS 12 — Configurar DNS (a Cloudflare o on tinguis el domini)

Crear dos registres tipus A apuntant a la IP de la VM Proxmox:

  tudomini.com       ->  IP_DE_LA_VM
  api.tudomini.com   ->  IP_DE_LA_VM

---

## OPCIONAL — HTTPS amb Let's Encrypt

```bash
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d tudomini.com -d api.tudomini.com
```

Certbot configura el SSL automaticament.
Despres actualitzar APP_URL al .env de Laravel a https://api.tudomini.com
i tornar a fer npm run build a la landing si la URL de la API esta al codi.

---

## ERRORS MES COMUNS

  - La API dona 403/404   -> El DocumentRoot de la API NO apunta a public/
                             Ha d'apuntar a moodify_backend/public (no a moodify_backend)

  - La API dona 500       -> Falten permisos a storage/ o bootstrap/cache/
                             Tornar a executar els chown/chmod del PAS 7

  - La landing dona 404   -> Falta el .htaccess a dist/ o AllowOverride no esta a All

  - Ollama no respon      -> sudo systemctl start ollama
                             Comprovar que el model esta descarregat: ollama list
```
