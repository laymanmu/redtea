#!/usr/bin/env bash
nohup nodemon ./app.js 2>&1 1>./nodemon.log &
