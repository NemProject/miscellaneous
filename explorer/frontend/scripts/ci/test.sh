#!/bin/bash

set -ex

CI=true npm run test:jenkins

cp -r ./coverage ./.nyc_output
