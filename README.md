# Task Management Tool

A laravel sail web application that allows one to create and manage tasks.

## Installation

# Pre-requisites
1. GitHub account and setup.
2. Docker Desktop.
3. Composer.
4. PHP.
5. VS code.

# Steps

1. Open terminal and clone the application from [gitHub](https://github.com/GayoWilliam/Tasks-Laravel-Developer-app.git)

```bash
git clone https://github.com/GayoWilliam/Tasks-Laravel-Developer-app.git
```

2. Once cloned, change directory to the cloned directory

```bash
cd Tasks-Laravel-Developer-app
```

3. At this point ensure VS code is installed on your device. While still in the terminal run

```bash
code .
```

This should open your directory on VS code. At this point ensure docker is installed on your device[documentation](https://docs.docker.com/engine/install/).

4. Launch Docker application

5. Once docker is running, in the VS code terminal run

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```

This ensures all dependencies needed by the application are installed.

6. Once completed, run 

```bash
composer require laravel/sail --dev
```

7. Then

```bash
php artisan sail:install
```

8. Once it's done executing, while still in the terminal, copy the environment variables by running

```bash
cp .env.example .env
```

A new .env file should be created.

9. Navigate to the file and uncomment variables below. You can set the password, database and username to your own.

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

10. Generate application key

```bash
./vendor/bin/sail artisan key:generate
```

11. Create migrations and seeders

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

11. Start application

```bash
./vendor/bin/sail up
```