#!/bin/bash

grunt --env=prod

rsync -avz \
  --delete \
  --exclude=config/env.php \
  --exclude=node_modules \
  --exclude=nbproject \
  . \
  zimzat@zimzat.com:/home/zimzat/apps/reader
