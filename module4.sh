#!/bin/bash

# Define the folder containing the resources to deploy
SCRIPT_DIR=$(dirname "$(realpath "$0")")
BASE_FOLDER="$SCRIPT_DIR/module-4"
FIX_FOLDER="$BASE_FOLDER/fix"
BREAK_FOLDER="$BASE_FOLDER/break"

# Check if the required folders exist
if [[ ! -d "$BASE_FOLDER" ]]; then
  echo "Error: Resource folder '$BASE_FOLDER' not found. Please run the script from the project root."
  exit 1
fi

if [[ ! -d "$FIX_FOLDER" ]]; then
  echo "Error: Fix folder '$FIX_FOLDER' not found. Please run the script from the project root."
  exit 1
fi

if [[ ! -d "$BREAK_FOLDER" ]]; then
  echo "Error: Break folder '$BREAK_FOLDER' not found. Please run the script from the project root."
  exit 1
fi

# Parse command-line arguments
USER_FILTER=""
USE_FIX_FOLDER=false

# Function to display the help menu
function show_help() {
  echo ""
  echo "Usage: ./module4.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --user <user id>    Apply resources only to the project of the specified user (e.g., user1)."
  echo "  --fix               Use the 'fix' folder instead of the 'break' folder."
  echo "  -h, --help          Display this help menu."
  echo ""
  echo "Examples:"
  echo "  ./module4.sh                 # Apply resources to all projects."
  echo "  ./module4.sh --user 1        # Apply resources to the project of user1."
  echo "  ./module4.sh --fix           # Apply resources from the 'fix' folder."
  echo "  ./module4.sh --user 1 --fix  # Apply resources from the 'fix' folder to user1's project."
  echo ""
  exit 0
}

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --user) USER_FILTER="$2"; shift ;;
    --fix) USE_FIX_FOLDER=true ;;
    -h|--help) show_help ;;
    *) echo "Unknown parameter: $1"; show_help ;;
  esac
  shift
done

RUNNING_FOLDER="$BREAK_FOLDER"
# Determine the folder to apply
if $USE_FIX_FOLDER; then
  RUNNING_FOLDER="$FIX_FOLDER"
fi

# Get the list of projects matching the naming pattern
if [[ -n "$USER_FILTER" ]]; then
  PROJECTS=$(oc get projects -o jsonpath='{.items[*].metadata.name}' | tr ' ' '\n' | grep "^quarkus-superheroes-user$USER_FILTER")
else
  PROJECTS=$(oc get projects -o jsonpath='{.items[*].metadata.name}' | tr ' ' '\n' | grep '^quarkus-superheroes-user')
fi

# Check if any projects were found
if [ -z "$PROJECTS" ]; then
  echo "No projects matching the pattern 'quarkus-superheroes-user*' were found."
  exit 1
fi

# Loop through each project
for PROJECT in $PROJECTS; do
  echo -e "\n============ Processing project: $PROJECT ============\n"

  # Switch to the project
  oc project $PROJECT

  # Apply the resources in the folder
  echo "Applying resources from $RUNNING_FOLDER to project $PROJECT..."
  oc apply -f "$RUNNING_FOLDER"

  # Get the names of pods and replicasets that use the resources
  PODS=$(oc get pods -o jsonpath='{.items[*].metadata.name}' --selector=app=rest-villains)
  RSSF=$(oc get rs -o jsonpath='{.items[*].metadata.name}' --selector=app=fights-db)
  RSSH=$(oc get rs -o jsonpath='{.items[*].metadata.name}' --selector=app=rest-heroes)

  sleep 3

  # Restart the pods
  for POD in $PODS; do
    echo "Restarting pod: $POD in project $PROJECT..."
    oc delete pod "$POD"
  done
  # Restart the replicasets
  for RS in $RSSF; do
    echo "Restarting replicaset: $RS in project $PROJECT..."
    oc delete rs "$RS"
  done
  for RS in $RSSH; do
    echo "Restarting replicaset: $RS in project $PROJECT..."
    oc delete rs "$RS"
  done
done

echo "Deployment and pod restarts completed."