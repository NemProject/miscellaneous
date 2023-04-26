#!/bin/bash

set -ex

if [ "$1" = "code-coverage" ];
then
    npm run test:jenkins
else
    npm run test
fi
