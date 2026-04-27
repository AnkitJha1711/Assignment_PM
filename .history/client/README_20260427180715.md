LILA Player Movement Dashboard
Overview

The LILA Player Movement Dashboard is an interactive analytics tool designed to visualize player behavior from large-scale gameplay event data. It transforms raw event logs into an intuitive, map-based interface that helps analyze movement patterns, combat interactions, and gameplay progression over time.

The system combines data processing, backend APIs, and a responsive frontend to deliver a complete end-to-end analytics workflow.

Key Features
Map-Based Visualization
Displays gameplay activity on in-game minimaps
Renders player movement paths using line traces
Highlights key events such as loot, kills, and deaths
Supports multiple maps dynamically
Match Timeline
Interactive timeline slider to replay match progression
Allows forward and backward navigation through gameplay
Displays current time relative to the full match duration
Enables temporal analysis of player behavior
Dynamic Filtering
Filter by map
Filter by match ID
Filter by player type (Human / Bot)
Match dropdown updates dynamically based on selected player type
Event Analytics Panel

Provides a quick summary of gameplay activity:

Total events
Movement events
Loot interactions
Kills
Deaths
Tech Stack
Frontend
React (Vite)
SVG for rendering overlays on maps
Axios for API communication
Backend
Node.js with Express
REST API for serving event data
Data Processing
Python
Pandas
PyArrow (for reading Parquet files)
Data Pipeline
Raw gameplay data is stored in Parquet format
Python scripts process and convert it into structured JSON
Backend APIs serve the processed data
Frontend fetches and filters the data
Events are rendered dynamically on the map using SVG
Project Structure
lila-dashboard/
│
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Map and UI components
│   │   ├── services/    # API calls
│
├── server/              # Node.js backend
│   ├── data/            # Processed JSON data
│
├── scripts/             # Python data processing scripts
Getting Started
Prerequisites
Node.js (v18+)
Python (v3.10+)
Backend Setup
cd server
npm install
node index.js
Frontend Setup
cd client
npm install
npm start

Open the application at:
http://localhost:3000

Use Cases
Player behavior analysis
Identifying high-activity zones
Understanding loot distribution patterns
Match replay and event inspection
Game analytics and debugging
Future Improvements
Heatmap visualization for player density and combat zones
Timeline playback (auto replay with controls)
Zoom and pan support for maps
Performance optimization for very large datasets
Enhanced UI/UX and styling improvements
Conclusion

This project demonstrates how large-scale event data can be transformed into meaningful, interactive visual insights. It highlights the integration of data engineering, backend services, and frontend visualization to build a practical analytics tool for gameplay analysis.