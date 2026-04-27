function MapView({ events, selectedMap }) {
  // 🔥 IMPORTANT FIX:
  // map ko events se depend mat banao (warna empty pe gayab ho jayega)
  const currentMap =
    selectedMap !== "All"
      ? selectedMap
      : events?.[0]?.map_id || "AmbroseValley";

  const mapImages = {
    AmbroseValley: "/minimaps/AmbroseValley_Minimap.png",
    GrandRift: "/minimaps/GrandRift_Minimap.png",
    Lockdown: "/minimaps/Lockdown_Minimap.jpg",
  };

  // ✅ Always safe (even if events empty)
  const movement = events?.filter(e =>
    ["Position", "BotPosition"].includes(e.event)
  ) || [];

  const loot = events?.filter(e => e.event === "Loot") || [];

  const kills = events?.filter(e =>
    ["Kill", "BotKill"].includes(e.event)
  ) || [];

  const deaths = events?.filter(e =>
    ["Killed", "BotKilled"].includes(e.event)
  ) || [];

  const storm = events?.filter(e =>
    e.event === "KilledByStorm"
  ) || [];

  return (
    <div
      style={{
        position: "relative",
        width: "1024px",
        height: "1024px",
      }}
    >
      {/* ✅ MAP ALWAYS VISIBLE */}
      <img
        src={mapImages[currentMap]}
        alt="map"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      {/* ✅ SVG ALWAYS RENDERS */}
      <svg
        width="1024"
        height="1024"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Movement */}
        {movement.map((p, i) => {
          if (i === 0) return null;

          return (
            <line
              key={i}
              x1={movement[i - 1].pixel_x}
              y1={movement[i - 1].pixel_y}
              x2={p.pixel_x}
              y2={p.pixel_y}
              stroke={
                p.player_type === "Bot"
                  ? "gray"
                  : "blue"
              }
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Loot */}
        {loot.map((p, i) => (
          <circle
            key={"loot" + i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="4"
            fill="lime"
          />
        ))}

        {/* Kills */}
        {kills.map((p, i) => (
          <circle
            key={"kill" + i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="5"
            fill="red"
          />
        ))}

        {/* Deaths */}
        {deaths.map((p, i) => (
          <circle
            key={"death" + i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="5"
            fill="orange"
          />
        ))}

        {/* Storm */}
        {storm.map((p, i) => (
          <circle
            key={"storm" + i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="6"
            fill="purple"
          />
        ))}
      </svg>
    </div>
  );
}

export default MapView;