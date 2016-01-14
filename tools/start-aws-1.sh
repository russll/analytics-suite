#!/usr/bin/env bash

# Bundle components/modules
gulp aws-1

pm2 delete all

# Boot it the app!
npm run pm2-aws-1