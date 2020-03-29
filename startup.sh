#!/bin/sh

npm run migrate-prod-up
pm2-runtime ./ecosystem.config.js
