#!/bin/bash
php artisan config:clear
php artisan migrate --force
php artisan db:seed --force
/start-container.sh