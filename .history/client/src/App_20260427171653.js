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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [map, match, events]);

  useEffect(() => {
    applyTimeline();
  }, [time, filtered]);

  const loadData = async () => {
    const eventsData = await getEvents();
    const statsData = await getStats();

    setEvents(eventsData);
    setFiltered(eventsData);
    setStats(statsData);

    const maxTs = Math.max(...eventsData.map(e => new Date(e.ts).getTime()));
    setMaxTime(maxTs);
    setTime(maxTs);
  };

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
      const maxTs = Math.max(...data.map(e => new Date(e.ts).getTime()));
      setMaxTime(maxTs);
      setTime(maxTs);
    }
  };

  const applyTimeline = () => {
    const data = filtered.filter(
      (e) => new Date(e.ts).getTime() <= time
    );

    setTimelineData(data);
  };

  const maps = ["All", ...new Set(events.map((e) => e.map_id))];
  const matches = ["All", ...new Set(events.map((e) => e.match_id))];

  return (
    <div style={{ padding: "20px" }}>
      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <select value={map} onChange={(e) => setMap(e.target.value)}>
          {maps.map((m, i) => (
            <option key={i}>{m}</option>
          ))}
        </select>

        <select
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          {matches.map((m, i) => (
            <option key={i}>{m.substring(0, 10)}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="range"
          min="0"
          max={maxTime}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          style={{ width: "500px" }}
        />
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: "20px" }}>
        <MapView events={timelineData} />
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}

export default App;