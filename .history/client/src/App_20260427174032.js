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

  // FETCH DATA
  useEffect(() => {
    axios.get("http://localhost:3000/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // APPLY FILTERS
  useEffect(() => {
    if (!events.length) return;

    // 🔥 FIX: ADD player_type
    let data = events.map(e => ({
      ...e,
      player_type: isNaN(e.user_id) ? "Human" : "Bot"
    }));

    // Map filter
    if (selectedMap !== "All") {
      data = data.filter(e => e.map_id === selectedMap);
    }

    // Player filter
    if (playerType !== "All") {
      data = data.filter(e => e.player_type === playerType);
    }

    setFiltered(data);

    // SET TIMELINE RANGE
    if (data.length > 0) {
      const times = data.map(e => new Date(e.ts).getTime());

      const minTs = Math.min(...times);
      const maxTs = Math.max(...times);

      setBaseTime(minTs);
      setMaxTime(maxTs - minTs);

      // 👇 only set once (important)
      if (time === 0) {
        setTime(maxTs - minTs);
      }
    }

  }, [events, selectedMap, playerType]);

  // APPLY TIMELINE
  useEffect(() => {
    if (!filtered.length) {
      setTimelineData([]);
      return;
    }

    const limited = filtered.slice(0, 5000);

    const data = limited.filter((e) => {
      const ts = new Date(e.ts).getTime();
      if (isNaN(ts)) return false;

      const eventTime = ts - baseTime;
      return eventTime <= time;
    });

    setTimelineData(data);

  }, [time, filtered, baseTime]);

  // STATS
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

        <select onChange={(e) => setSelectedMap(e.target.value)}>
          <option value="All">All Maps</option>
          <option value="AmbroseValley">AmbroseValley</option>
          <option value="GrandRift">GrandRift</option>
          <option value="Lockdown">Lockdown</option>
        </select>

        <select onChange={(e) => setPlayerType(e.target.value)}>
          <option value="All">All Players</option>
          <option value="Human">Human</option>
          <option value="Bot">Bot</option>
        </select>

      </div>

      {/* STATS */}
      <div>
        <p>Total: {stats.total}</p>
        <p>Movement: {stats.movement}</p>
        <p>Loot: {stats.loot}</p>
        <p>Kills: {stats.kills}</p>
        <p>Deaths: {stats.deaths}</p>
      </div>

      {/* SLIDER */}
      <input
        type="range"
        min={0}
        max={maxTime}
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        style={{ width: "500px", margin: "20px 0" }}
      />

      {/* MAP */}
      <MapView events={timelineData} selectedMap={selectedMap} />
    </div>
  );
}

export default App;