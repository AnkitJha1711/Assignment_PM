function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div
      style={{
        width: "250px",
        padding: "20px",
        background: "#111",
        color: "white",
      }}
    >
      <h2>Stats</h2>
      <p>Total Events: {stats.totalEvents}</p>
      <p>Movement: {stats.totalMovement}</p>
      <p>Loot: {stats.totalLoot}</p>
      <p>Kills: {stats.totalKills}</p>
      <p>Deaths: {stats.totalDeaths}</p>
    </div>
  );
}

export default StatsPanel;