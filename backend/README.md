
# Steroids Nest Gii

## Install

### 1. Install dependencies

```shell
yarn
```

### 2. Setup database

Sample install script

```shell
psql postgres -c "CREATE USER \"steroidsNestGii_admin\" WITH ENCRYPTED PASSWORD '123';"
psql postgres -c "CREATE DATABASE \"steroidsNestGii\";"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"steroidsNestGii\" TO \"steroidsNestGii_admin\";"
```

### 3. Configure local workplace via `.env`

1. Correct default parameters if needed
2. Generate unique string for `AUTH_JWT_SECRET_KEY`

### 4. Run migrations

1. Generate migrations
```shell
yarn cli migrate:generate
```

2. Apply migrations
```shell
yarn cli migrate
```

## Start

### Development mode

```shell
yarn start:dev
```
or
```shell
yarn start:debug
```

### Production mode

1. Build

```shell
yarn build
```
2. Start

```shell
yarn start:prod
```

## Healthcheck

If `PORT` in .env set to 9300, then open http://localhost:9300/api/docs to see project's API documentation

## CI/CD

### Настройка выгрузки Gitlab

1. Настроить на сервере базу данных
2. Создать папку проекта, в ней папку config
3. В этой папке заполнить файл `.env` нужными значениями переменных
4. Скопировать файл `.gitlab-ci.sample.yml` в `.gitlab-ci.yml`
5. Файл `.gitlab-ci.yml` проверить на корректность, закомментировать перезапуск процесса PM2
6. Запустить выгрузку
7. Установить процесс в PM2 (см. пункт нижу)
8. В файле `.gitlab-ci.yml` раскомментировать перезапуск процесса PM2

### Установка на сервере в PM2

```shell
pm2 --name=steroidsNestGii_nest --instances=2 --cwd=/var/www/steroidsNestGii-nest/www-master --log=../files/node-dev-nest.log start dist/main.js
```
