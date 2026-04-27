import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "./components/MapView";

function App() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const [selectedMap, setSelectedMap] = useState("All");

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

  // 🔥 APPLY FILTER
  useEffect(() => {
    applyFilters();
  }, [events, selectedMap]);

  // 🔥 APPLY TIMELINE
  useEffect(() => {
    applyTimeline();
  }, [time, filtered]);

  const applyFilters = () => {
    let data = [...events];

    if (selectedMap !== "All") {
      data = data.filter(e => e.map_id === selectedMap);
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

    // 🔥 PERFORMANCE LIMIT
    const limited = filtered.slice(0, 5000);

    const data = limited.filter((e) => {
      const eventTime = new Date(e.ts).getTime() - baseTime;
      return eventTime <= time;
    });

    setTimelineData(data);
  };

  return (
    <div>
      <h1>LILA Player Dashboard</h1>

      {/* MAP FILTER */}
      <select onChange={(e) => setSelectedMap(e.target.value)}>
        <option value="All">All Maps</option>
        <option value="AmbroseValley">AmbroseValley</option>
        <option value="GrandRift">GrandRift</option>
        <option value="Lockdown">Lockdown</option>
      </select>

      {/* TIMELINE SLIDER */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="range"
          min={0}
          max={maxTime}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          style={{ width: "500px" }}
        />
      </div>

      {/* MAP */}
      <MapView events={timelineData} selectedMap={selectedMap} />
    </div>
  );
}

export default App;