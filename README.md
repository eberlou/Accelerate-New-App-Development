# Accelerate-New-App-Development

## Module 4

This module will break the environment and test troubleshooting capabilities of the developers

- ConfigMap: rest-villains-config.yaml
- Request/Limits: fights-db.yaml OOMKilled
- Healthchecks: rest-heroes.yaml
- Service: rest-fights-s.yaml
- Scaled Down: scale-heroes-db.yaml
- Liveness Proble: ui-superheroes-d.yaml

## Module 4 Script

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

## Optional: Leaderboard Frontend 
This project is a frontend application that displays the number of broken pods in OpenShift namespaces matching the pattern `quarkus-superheroes-userX`. It fetches data from a backend that interacts with the OpenShift API.

### Prerequisites

Before setting up the frontend, ensure the following are installed on your development laptop:

1. **Node.js** (v16 or later) and **npm**:
   - [Download and install Node.js](https://nodejs.org/).
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **OpenShift API Token**:
   - Log in to your OpenShift cluster using the `oc` CLI:
     ```bash
     oc login --server=https://<your-openshift-api-url>
     ```
   - Retrieve your API token:
     ```bash
     oc whoami -t
     ```

### Set Up the Backend

1. Navigate to the project root directory.
```bash
cd backend
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add the following:

```bash
touch .env
```

```bash
OPENSHIFT_API_URL=https://<your-openshift-api-url>
OPENSHIFT_API_TOKEN=<your-openshift-api-token>
```
4. Start the backend server:

```bash
node server.js
```

The backend will run on http://localhost:3001.

### Set Up the Frontend

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

4. Access the Application

Open your browser and navigate to http://localhost:5173. The application will display the number of broken pods for each namespace, sorted from least to most broken pods. The data will auto-refresh every 5 seconds.