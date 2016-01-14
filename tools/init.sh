#!/bin/bash

npm install

npm install pm2 gulp -g

# Bundle components/modules
gulp dev-aws-1

npm run start-developing-aws-1