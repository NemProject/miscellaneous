#!/bin/bash

set -ex

TEST_RUNNER=$([ "$1" = "code-coverage" ] && echo "coverage run --append" || echo "python3")
${TEST_RUNNER} -m configuration_generator --count 20 --seed 100000000000 --network-name testnet --output ./nemesis.yaml --accounts-output ./user.yaml
${TEST_RUNNER} -m generator -i ./nemesis.yaml -o nemesis.bin
${TEST_RUNNER} -m node_configuration_generator --accounts-file ./user.yaml --nodes-file ./resources/nodes.yaml --nemesis-file ./nemesis.yaml --seed ./nemesis.bin --network-friendly-name ship --output-path ./output
