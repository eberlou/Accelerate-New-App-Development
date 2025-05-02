#!/bin/bash

# Run servers logic

echo "Starting backend server..."
(cd backend && npm install && node server.js) &

echo "Starting frontend server..."
(cd frontend && npm install && npm run dev) &

echo "Frontend and backend servers are running."
wait # Wait for both servers to finish
