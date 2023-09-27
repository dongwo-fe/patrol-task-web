#!/bin/bash

git pull
npm run release

\cp -rf dist/ /www/wwwroot/patrol.guofangchao.com