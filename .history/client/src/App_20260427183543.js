import { useEffect, useState } from "react";
import { getEvents, getStats } from "./services/api";
import MapView from "./components/MapView";
import StatsPanel from "./components/StatsPanel";

// UI styles
const btn = {
  marginLeft: "10px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const btnPrimary = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#4a6cf7",
  color: "white",
  cursor: "pointer",
};

function App() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [stats, setStats] = useState(null);

  const [map, setMap] = useState("All");
  const [match, setMatch] = useState("All");
  const [playerType, setPlayerType] = useState("All");

  // 🔥 NEW DATE FILTER
  const [date, setDate] = useState("All");

  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [baseTime, setBaseTime] = useState(0);

  const [heatmapType, setHeatmapType] = useState("none");

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setMatch("All");
  }, [playerType]);

  useEffect(() => {
    applyFilters();
  }, [map, match, playerType, date, events]);

  useEffect(() => {
    applyTimeline();
  }, [time, filtered, baseTime]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prev + 100 * speed;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed, maxTime]);

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

    // 🔥 DATE FILTER
    if (date !== "All") {
      data = data.filter(e => {
        const d = new Date(e.ts).toISOString().split("T")[0];
        return d === date;
      });
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

  const applyTimeline = () => {
    if (!filtered.length) {
      setTimelineData([]);
      return;
    }

    const limited = filtered.slice(0, 5000);

    const data = limited.filter(e => {
      const ts = new Date(e.ts).getTime();
      return ts - baseTime <= time;
    });

    setTimelineData(data);
  };

  // dropdown options
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

  // 🔥 DATE OPTIONS
  const dates = [
    "All",
    ...new Set(
      events.map(e =>
        new Date(e.ts).toISOString().split("T")[0]
      )
    )
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>LILA Player Movement Dashboard</h2>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <select value={map} onChange={(e) => setMap(e.target.value)}>
          {maps.map((m, i) => <option key={i}>{m}</option>)}
        </select>

        <select value={match} onChange={(e) => setMatch(e.target.value)}>
          {matches.map((m, i) => (
            <option key={i}>
              {m === "All" ? "All Matches" : m.substring(0, 10)}
            </option>
          ))}
        </select>

        <select value={playerType} onChange={(e) => setPlayerType(e.target.value)}>
          <option value="All">All Players</option>
          <option value="Human">Human</option>
          <option value="Bot">Bot</option>
        </select>

        {/* 🔥 DATE DROPDOWN */}
        <select value={date} onChange={(e) => setDate(e.target.value)}>
          {dates.map((d, i) => (
            <option key={i}>{d === "All" ? "All Dates" : d}</option>
          ))}
        </select>
      </div>

      {/* HEATMAP */}
      <div style={{ marginBottom: "10px" }}>
        <b>Heatmap:</b>
        <button onClick={() => setHeatmapType("kill")} style={btn}>Kills</button>
        <button onClick={() => setHeatmapType("loot")} style={btn}>Loot</button>
        <button onClick={() => setHeatmapType("death")} style={btn}>Deaths</button>
        <button onClick={() => setHeatmapType("none")} style={btn}>Clear</button>
      </div>

      {/* TIMELINE */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={btnPrimary}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <select onChange={(e) => setSpeed(Number(e.target.value))} style={{ marginLeft: "10px" }}>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
        </select>

        <div>{(time / 1000).toFixed(1)}s</div>

        <input
          type="range"
          min={0}
          max={maxTime}
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
            setIsPlaying(false);
          }}
          style={{ width: "500px" }}
        />
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", gap: "20px" }}>
        <MapView
          events={timelineData}
          selectedMap={map}
          heatmapType={heatmapType}
        />
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}

export default App;