# NEM nemesis generator

Tool for generating NEM nemesis blocks for testnet.

## Examples

```bash
python3 -m generator --input ./resources/sample_config.yaml --output nemesis.bin
```

# NEM nemesis configuration generator

Tool for generating configuration for NEM nemesis generator.

## Examples

```bash
python3 -m configuration_generator --count 20 --seed 100000000000 --network-name testnet --output nemesis.yaml --accounts-output user.yaml
```

# NEM node configuration generator

Tool for generating configuration for one or more NEM node.

## Examples

```bash
python3 -m node_configuration_generator --accounts-file user.yaml --nodes-file resources/nodes.yaml --nemesis-file ./nemesis.yaml --seed 
./nemesis.bin --network-friendly-name ship --output-path ./output
```

