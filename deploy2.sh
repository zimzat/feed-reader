#!/bin/bash

grunt --env=titan clean build

rsync -avz \
  --delete \
  --exclude=config/env.php \
  --exclude=node_modules \
  --exclude=nbproject \
  . \
  titan:/var/www/reader.zimzat.com
