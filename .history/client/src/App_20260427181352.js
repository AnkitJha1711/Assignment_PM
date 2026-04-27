import { useEffect, useState } from "react";
import { getEvents, getStats } from "./services/api";
import MapView from "./components/MapView";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [stats, setStats] = useState(null);

  const [map, setMap] = useState("All");
  const [match, setMatch] = useState("All");
  const [playerType, setPlayerType] = useState("All");

  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [baseTime, setBaseTime] = useState(0);

  const [showHeatmap, setShowHeatmap] = useState(false);

  // 🔥 NEW: animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 5x

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Reset match when player type changes
  useEffect(() => {
    setMatch("All");
  }, [playerType]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [map, match, events, playerType]);

  // Apply timeline
  useEffect(() => {
    applyTimeline();
  }, [time, filtered, baseTime]);

  // 🔥 ANIMATION LOOP
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTime(prev => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prev + 100 * speed;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed, maxTime]);

  // Fetch data
  const loadData = async () => {
    const eventsData = await getEvents();
    const statsData = await getStats();

    setEvents(eventsData);
    setStats(statsData);

    if (eventsData.length > 0) {
      const times = eventsData.map(e => new Date(e.ts).getTime());

      const minTs = Math.min(...times);
      const maxTs = Math.max(...times);

      setBaseTime(minTs);
      setMaxTime(maxTs - minTs);
      setTime(maxTs - minTs);
    }
  };

  // Filter logic
  const applyFilters = () => {
    let data = events.map(e => ({
      ...e,
      player_type: isNaN(e.user_id) ? "Human" : "Bot"
    }));

    if (map !== "All") {
      data = data.filter(e => e.map_id === map);
    }

    if (match !== "All") {
      data = data.filter(e => e.match_id === match);
    }

    if (playerType !== "All") {
      data = data.filter(e => e.player_type === playerType);
    }

    setFiltered(data);

    if (data.length > 0) {
      const times = data.map(e => new Date(e.ts).getTime());

      const minTs = Math.min(...times);
      const maxTs = Math.max(...times);

      setBaseTime(minTs);
      setMaxTime(maxTs - minTs);

      setTime(prev => Math.min(prev, maxTs - minTs));
    } else {
      setMaxTime(0);
      setTime(0);
      setTimelineData([]);
    }
  };

  // Timeline logic
  const applyTimeline = () => {
    if (!filtered.length) {
      setTimelineData([]);
      return;
    }

    const limited = filtered.slice(0, 5000);

    const data = limited.filter((e) => {
      const ts = new Date(e.ts).getTime();
      if (isNaN(ts)) return false;

      const relativeTime = ts - baseTime;
      return relativeTime <= time;
    });

    setTimelineData(data);
  };

  // Dropdown options
  const maps = ["All", ...new Set(events.map(e => e.map_id))];

  const matches = [
    "All",
    ...new Set(
      events
        .map(e => ({
          match_id: e.match_id,
          player_type: isNaN(e.user_id) ? "Human" : "Bot"
        }))
        .filter(e => playerType === "All" || e.player_type === playerType)
        .map(e => e.match_id)
    )
  ];

  return (
    <div style={{ padding: "20px" }}>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <select value={map} onChange={(e) => setMap(e.target.value)}>
          {maps.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          {matches.map((m, i) => (
            <option key={i} value={m}>
              {m === "All" ? "All Matches" : m.substring(0, 10)}
            </option>
          ))}
        </select>

        <select
          value={playerType}
          onChange={(e) => setPlayerType(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="All">All Players</option>
          <option value="Human">Human</option>
          <option value="Bot">Bot</option>
        </select>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          style={{ marginLeft: "10px" }}
        >
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
      </div>

      {/* 🎬 TIMELINE */}
      <div style={{ marginBottom: "20px" }}>
        
        <div style={{ fontWeight: "bold" }}>
          Match Timeline
        </div>

        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
          {(time / 1000).toFixed(1)}s / {(maxTime / 1000).toFixed(1)}s
        </div>

        {/* 🔥 CONTROLS */}
        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause" : "Play"}
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: "10px" }}
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
          </select>
        </div>

        <input
          type="range"
          min={0}
          max={maxTime || 0}
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
            setIsPlaying(false);
          }}
          style={{ width: "500px" }}
        />
      </div>

      {/* MAIN VIEW */}
      <div style={{ display: "flex", gap: "20px" }}>
        <MapView
          events={timelineData}
          selectedMap={map}
          showHeatmap={showHeatmap}
        />
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}

export default App;