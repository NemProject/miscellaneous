
#!/bin/bash

set -ex

git submodule update --init
git -C _symbol config core.sparseCheckout true
echo 'linters/*' >>.git/modules/_symbol/info/sparse-checkout
git submodule update --force --checkout _symbol
