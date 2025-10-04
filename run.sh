#!/bin/bash

set -e

echo "🚀 Starting TrendingMovie - Fullstack Application"

# Default ports
BACKEND_PORT=8000
FRONTEND_PORT=3000

echo "📦 Installing dependencies..."
cd backend
yarn install
cd ../frontend
yarn install
cd ..

cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    [[ ! -z "$BACKEND_PID" ]] && kill -0 $BACKEND_PID 2>/dev/null && kill $BACKEND_PID && echo "✅ Backend stopped"
    [[ ! -z "$FRONTEND_PID" ]] && kill -0 $FRONTEND_PID 2>/dev/null && kill $FRONTEND_PID && echo "✅ Frontend stopped"
    echo "✅ All servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Kill existing processes if ports are in use
kill_port() {
    PORT=$1
    if lsof -i:$PORT -t >/dev/null; then
        echo "⚠️  Killing process on port $PORT..."
        kill -9 $(lsof -i:$PORT -t)
    fi
}

kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# Start backend
echo "🔧 Starting backend server on port $BACKEND_PORT..."
cd backend
PORT=$BACKEND_PORT yarn dev &
BACKEND_PID=$!
cd ..

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Exiting."
    cleanup
fi

# Start frontend
echo "🌐 Starting frontend server on port $FRONTEND_PORT..."
cd frontend
PORT=$FRONTEND_PORT yarn dev &
FRONTEND_PID=$!
cd ..

sleep 5
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start. Exiting."
    cleanup
fi

# Detect host
HOST=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")

echo ""
echo "✅ Application started successfully!"
echo "📊 Backend: http://$HOST:$BACKEND_PORT"
echo "🌐 Frontend: http://$HOST:$FRONTEND_PORT"
echo ""
echo "Press Ctrl+C to stop all servers"

wait
