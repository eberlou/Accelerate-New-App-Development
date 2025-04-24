# Accelerate-New-App-Development

## Module 4

This module will break the environment and test troubleshooting capabilities of the developers

- ConfigMap: rest-villains-config.yaml
- Request/Limits: fights-db.yaml OOMKilled
- Healthchecks: rest-heroes.yaml
- Service: rest-fights-s.yaml
- Scaled Down: scale-heroes-db.yaml
- Liveness Proble: ui-superheroes-d.yaml

## Module 4 Deployment Script

This script (`module4.sh`) is designed to deploy resources to OpenShift projects dynamically. It applies YAML files from the `module-4` folder to OpenShift projects matching the naming pattern `quarkus-superheroes-user*`. It also restarts pods or replicasets when needed.

### Prerequisites

1. Ensure you have the OpenShift CLI (`oc`) installed and configured.
2. Log in as `admin` to your OpenShift cluster using the `oc login` command.
3. Run the script from the root of the project directory.

### Usage

#### Basic Command

To run the script, use the following command:

```bash
Usage: ./module4.sh [OPTIONS]

Options:
  --user <user id>    Apply resources only to the project of the specified user (e.g., user1).
  --fix               Use the 'fix' folder instead of the 'break' folder.
  -h, --help          Display this help menu.

Examples:
  ./module4.sh                 # Apply resources to all projects.
  ./module4.sh --user 1        # Apply resources to the project of user1.
  ./module4.sh --fix           # Apply resources from the 'fix' folder.
  ./module4.sh --user 1 --fix  # Apply resources from the 'fix' folder to user1's project.
```

### Notes
- Ensure you have permissions to apply resources and restart pods in the target projects.
- The script assumes it is run from the project root. It will return an error if required folders are missing.