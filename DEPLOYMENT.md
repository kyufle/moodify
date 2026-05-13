# Guia de Replegament (Deployment) - Moodify

Aquest fitxer conté les instruccions ràpides per configurar i posar en marxa l'ecosistema Moodify en un servidor sota Proxmox/Cloudflare.

## Estructura del Projecte
* **/moodify/moodify_backend**: API i Lògica de negoci (Laravel 11 / PHP 8.4).
* **/landing_page**: Web informativa i punt de descàrrega APK (React + Vite).

---

##  Passos d'Instal·lació al Servidor

### 1. Preparació de l'entorn
Accedir al directori web i clonar el repositori:
```bash
cd /var/www/html
git clone [https://github.com/kyufle/moodify.git](https://github.com/kyufle/moodify.git)
```

### 2. Configuració del Backend (Laravel)
```bash
cd moodify/moodify_backend
composer install
cp .env.example .env
```
# Nota: Configurar dades de MySQL al fitxer .env (DB_DATABASE, USER, PASSWORD)
```bash
php artisan key:generate
php artisan migrate --force
```
# Permisos crítics d'escriptura:
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Configuració de la Landing Page (React)
```bash
cd ../../landing_page
npm install
npm run build
```

### 4. Activació de Virtual Hosts (Apache)
```bash
sudo a2ensite api.conf landing.conf
sudo a2dissite 000-default.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```