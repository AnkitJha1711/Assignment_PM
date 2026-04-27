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

  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters when map/match changes
  useEffect(() => {
    applyFilters();
  }, [map, match, events]);

  // Apply timeline
  useEffect(() => {
    applyTimeline();
  }, [time, filtered]);

  // 🔹 Fetch data
  const loadData = async () => {
    const eventsData = await getEvents();
    const statsData = await getStats();

    setEvents(eventsData);
    setStats(statsData);

    // initial filter = all
    setFiltered(eventsData);

    if (eventsData.length > 0) {
      const maxTs = Math.max(
        ...eventsData.map((e) => new Date(e.ts).getTime())
      );
      setMaxTime(maxTs);
      setTime(maxTs);
    }
  };

  // 🔹 Filter logic
  const applyFilters = () => {
    let data = [...events];

    if (map !== "All") {
      data = data.filter((e) => e.map_id === map);
    }

    if (match !== "All") {
      data = data.filter((e) => e.match_id === match);
    }

    setFiltered(data);

    if (data.length > 0) {
      const maxTs = Math.max(
        ...data.map((e) => new Date(e.ts).getTime())
      );
      setMaxTime(maxTs);
      setTime(maxTs);
    } else {
      // 🔥 IMPORTANT: prevent crash
      setMaxTime(0);
      setTime(0);
      setTimelineData([]);
    }
  };

  // 🔹 Timeline logic
  const applyTimeline = () => {
    if (!filtered.length) {
      setTimelineData([]);
      return;
    }

    const data = filtered.filter(
      (e) => new Date(e.ts).getTime() <= time
    );

    setTimelineData(data);
  };

  // dropdown options
  const maps = ["All", ...new Set(events.map((e) => e.map_id))];
  const matches = ["All", ...new Set(events.map((e) => e.match_id))];

  return (
    <div style={{ padding: "20px" }}>
      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <select value={map} onChange={(e) => setMap(e.target.value)}>
          {maps.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          {matches.map((m, i) => (
            <option key={i} value={m}>
              {m.substring(0, 10)}
            </option>
          ))}
        </select>
      </div>

      {/* TIMELINE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="range"
          min="0"
          max={maxTime || 0}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          style={{ width: "500px" }}
        />
      </div>

      {/* MAIN VIEW */}
      <div style={{ display: "flex", gap: "20px" }}>
        <MapView
          events={timelineData}
          selectedMap={map}
        />
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}

export default App;