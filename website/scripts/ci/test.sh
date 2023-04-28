#!/bin/bash

set -ex

TEST_MODE=$([ "$1" = "code-coverage" ] && echo "test:jenkins" || echo "test")
# CI=true npm run "${TEST_MODE}"

echo "no tests yet for website"