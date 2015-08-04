#!/bin/bash

grunt --env=prod clean build

rsync -avz \
  --delete \
  --exclude=config/env.php \
  --exclude=node_modules \
  --exclude=nbproject \
  . \
  zimzat@zimzat.com:/home/zimzat/apps/reader
