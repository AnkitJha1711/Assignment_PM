LILA Player Journey Visualization Tool
1. Overview

This project is a web-based visualization tool designed to help Level Designers analyze player movement, combat behavior, and map engagement patterns using raw gameplay telemetry data.

The system converts structured event data (parquet → JSON) into interactive visual insights including:

Player movement paths
Event markers (kills, loot, deaths, storm)
Heatmaps
Timeline-based replay
Filtering by map, match, player type, and date
2. Tech Stack
Frontend
React (UI rendering + state management)
JavaScript (logic)
HTML5 Canvas / SVG (map rendering)
Native HTML inputs (filters, slider, date picker)
Backend (Data Layer)
Node.js (assumed API layer via getEvents, getStats)
Parquet → JSON preprocessing (Python script outside frontend)
Data Format
Events contain:
ts (timestamp)
map_id
match_id
user_id
event type (Position, Kill, Loot, etc.)
pixel_x, pixel_y (map coordinates)
3. System Architecture
Parquet Files
     ↓
Python Preprocessing Script
     ↓
JSON API (Node / Local Server)
     ↓
React Frontend (App.js)
     ↓
State Layer (filters + timeline)
     ↓
Map Visualization (MapView)
4. Data Flow
Step 1: Data Loading
Frontend fetches event data via getEvents()
Stats fetched via getStats()
Step 2: State Initialization
Events stored in events state
Derived filters applied to generate filtered dataset
Step 3: Filtering Pipeline

Filters applied in sequence:

Map filter (map_id)
Match filter (match_id)
Player type (Human/Bot derived from user_id)
Date filter (ISO date from timestamp)

Output → filtered dataset

5. Timeline System
Logic

All events are normalized using:

relative_time = event_time - baseTime
Slider controls how much of the match is visible
Only events <= current time are rendered
Result

Enables replay-style visualization of match progression.

6. Coordinate Mapping
Approach

Game world coordinates are pre-converted into pixel coordinates:

pixel_x, pixel_y
These are directly mapped onto minimap image dimensions (1024x1024)
Rendering
SVG overlay is used:
Lines → movement paths
Circles → events (kill, loot, death)
Heatmap → translucent radial markers
7. Heatmap System

Heatmap is event-driven:

Type	Events Used	Color
Kill Heatmap	Kill, BotKill	Red
Loot Heatmap	Loot	Green
Death Heatmap	Killed, BotKilled	Orange

Rendering method:

Each event is drawn as a low-opacity circle
Overlapping circles create intensity zones
8. Key Features
1. Map Visualization
Shows real-time player movement paths
2. Event Markers
Kill, loot, death, storm events visualized distinctly
3. Filters
Map-wise filtering
Match-wise filtering
Player type (Human/Bot)
Date-based filtering
4. Timeline Playback
Play/Pause match replay
Adjustable speed (1x, 2x, 5x)
5. Heatmaps
Spatial density visualization of key events
9. Assumptions
user_id numeric → Bot, non-numeric → Human
pixel_x, pixel_y already normalized to minimap scale
Event timestamps are valid ISO strings
Data is pre-cleaned before frontend ingestion
10. Tradeoffs
Area	Decision	Reason
Rendering	SVG over Canvas	Simpler debugging & layering
State Management	React useState	Lightweight app, no Redux needed
Heatmap	Simple circle overlay	Fast implementation, good enough visual signal
Data Processing	Frontend filtering	Faster iteration, no backend dependency
11. Insights from Data
Insight 1: High Kill Density Zones

Certain map regions show repeated kill clustering → indicates high-risk combat zones.

Insight 2: Loot Hotspots

Loot events are not evenly distributed; players tend to converge on specific resource-rich areas.

Insight 3: Low Traffic Areas

Large portions of maps remain unused → potential for level redesign or POI introduction.

12. Future Improvements
True GPU-based heatmap rendering
Real-time websocket streaming
Zoomable/pannable map
Multi-match comparative view
Replay scrubbing with keyframe markers
13. Conclusion

This tool transforms raw telemetry into actionable spatial insights for Level Designers, enabling data-driven map balancing and gameplay optimization.