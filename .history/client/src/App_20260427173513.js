import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "./components/MapView";

function App() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const [selectedMap, setSelectedMap] = useState("All");
  const [playerType, setPlayerType] = useState("All");

  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(1);
  const [baseTime, setBaseTime] = useState(0);

  // 🔥 FETCH DATA
  useEffect(() => {
    axios.get("http://localhost:3000/events")
      .then((res) => {
        setEvents(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔥 APPLY FILTERS
  useEffect(() => {
    applyFilters();
  }, [events, selectedMap, playerType]);

  // 🔥 APPLY TIMELINE
  useEffect(() => {
    applyTimeline();
  }, [time, filtered]);

  const applyFilters = () => {
    let data = [...events];

    // Map filter
    if (selectedMap !== "All") {
      data = data.filter(e => e.map_id === selectedMap);
    }

    // Player filter
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
      setTime(maxTs - minTs);
    }
  };

  const applyTimeline = () => {
    if (!filtered.length) {
      setTimelineData([]);
      return;
    }

    const limited = filtered.slice(0, 5000);

    const data = limited.filter((e) => {
      const eventTime = new Date(e.ts).getTime() - baseTime;
      return eventTime <= time;
    });

    setTimelineData(data);
  };

  // 🔥 STATS
  const stats = {
    total: filtered.length,
    movement: filtered.filter(e => ["Position", "BotPosition"].includes(e.event)).length,
    loot: filtered.filter(e => e.event === "Loot").length,
    kills: filtered.filter(e => ["Kill", "BotKill"].includes(e.event)).length,
    deaths: filtered.filter(e => ["Killed", "BotKilled"].includes(e.event)).length,
  };

  return (
    <div>
      <h1>LILA Player Dashboard</h1>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        
        {/* Map */}
        <select onChange={(e) => setSelectedMap(e.target.value)}>
          <option value="All">All Maps</option>
          <option value="AmbroseValley">AmbroseValley</option>
          <option value="GrandRift">GrandRift</option>
          <option value="Lockdown">Lockdown</option>
        </select>

        {/* Player */}
        <select onChange={(e) => setPlayerType(e.target.value)}>
          <option value="All">All Players</option>
          <option value="Human">Human</option>
          <option value="Bot">Bot</option>
        </select>

      </div>

      {/* STATS */}
      <div style={{ marginBottom: "20px" }}>
        <p>Total: {stats.total}</p>
        <p>Movement: {stats.movement}</p>
        <p>Loot: {stats.loot}</p>
        <p>Kills: {stats.kills}</p>
        <p>Deaths: {stats.deaths}</p>
      </div>

      {/* TIMELINE */}
      <input
        type="range"
        min={0}
        max={maxTime}
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        style={{ width: "500px", marginBottom: "20px" }}
      />

      {/* MAP */}
      <MapView events={timelineData} selectedMap={selectedMap} />
    </div>
  );
}

export default App;