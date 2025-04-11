# Accelerate-New-App-Development

## Module 4

This module will break the environment and test troubleshooting capabilities of the developers

- ConfigMap: rest-villains-config.yaml
- Request/Limits: fights-db.yaml OOMKilled
- Healthchecks: rest-heroes.yaml

## Module 4 Deployment Script

This script (`module4.sh`) is designed to deploy resources to OpenShift projects dynamically. It applies YAML files from the `module-4` folder (or the `fix` folder if specified) to OpenShift projects matching the naming pattern `quarkus-superheroes-user*`. It also restarts pods that use the `ConfigMap` to ensure changes are applied.

### Prerequisites

1. Ensure you have the OpenShift CLI (`oc`) installed and configured.
2. Log in as `admin` to your OpenShift cluster using the `oc login` command.
3. Run the script from the root of the project directory, where the `module-4` and `fix` folders are located.

### Usage

#### Basic Command

To run the script, use the following command:

```bash
./module4.sh

options:
--user: <id>: Apply resources only to the project of the specified user. (eg: 1,2,3)
--fix: Use the fix folder instead of the module-4 folder.
```

### Notes
- Ensure you have permissions to apply resources and restart pods in the target projects.
- The script assumes it is run from the project root. It will return an error if required folders are missing.