# NEM nemesis generator

Tools for generating NEM nemesis blocks and node configurations for testnet.

## Requirements

- python v3

## Install dependencies

```bash
python3 -m pip install -r requirements.txt
```
## Generators
| Generator  | Module | Description |
| ------------- | -------------  | ------------- |
| NEM nemesis configuration generator  | configuration_generator | Tool for generating configuration for NEM nemesis generator.  |
| NEM nemesis generator| generator | Tool for generating NEM nemesis blocks for testnet.|
| NEM node configuration generator  | node_configuration_generator | Tool for generating configuration for one or more NEM nodes.|

## How to use?

### Step 1: Generate NEM nemesis configuration

```bash
python3 -m configuration_generator --count 20 --seed 450000000000000 --network-name testnet --output nemesis.yaml --accounts-output user.yaml
```

Please note that, in order for nodes to properly harvest, the total supply should be approximately 9 billion. We took this into consideration when setting 450 million for each of the 20 accounts mentioned above. You should take this into account when setting different values.

### Step 2: Generate NEM nemesis binary

```bash
python3 -m generator --input ./nemesis.yaml --output nemesis.bin
```

### Step 3: Generate NEM node configuration
Create `nodes.yaml` file for the node information in the following format:
```yaml
nodes:
  - host: localhost-node1
    name: node1
  - host: localhost-node2
    name: node2
```
And run the following command to generate node configuration to `./output` folder:

```bash
python3 -m node_configuration_generator --accounts-file user.yaml --nodes-file nodes.yaml --nemesis-file ./nemesis.yaml --seed ./nemesis.bin --network-friendly-name ship --output-path ./output
```

Output files should be generated in the following structure:
```
./output
  |--node1
     |--config.user.properties
     |--nemesis.bin
     |--peers-config_testnet_ship.json
  |--node2
     |--config.user.properties
     |--nemesis.bin
     |--peers-config_testnet_ship.json
```