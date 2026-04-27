function MapView({ events, selectedMap }) {

  const currentMap =
    selectedMap !== "All"
      ? selectedMap
      : events?.[0]?.map_id || "AmbroseValley";

  const mapImages = {
    AmbroseValley: "/minimaps/AmbroseValley_Minimap.png",
    GrandRift: "/minimaps/GrandRift_Minimap.png",
    Lockdown: "/minimaps/Lockdown_Minimap.jpg",
  };

  // 🔥 LIMIT DATA FOR PERFORMANCE
  const movement = (events || [])
    .filter(e => ["Position", "BotPosition"].includes(e.event))
    .slice(0, 1500);

  const loot = (events || [])
    .filter(e => e.event === "Loot")
    .slice(0, 300);

  const kills = (events || [])
    .filter(e => ["Kill", "BotKill"].includes(e.event))
    .slice(0, 200);

  const deaths = (events || [])
    .filter(e => ["Killed", "BotKilled"].includes(e.event))
    .slice(0, 200);

  const storm = (events || [])
    .filter(e => e.event === "KilledByStorm")
    .slice(0, 100);

  return (
    <div style={{ position: "relative", width: "1024px", height: "1024px" }}>

      {/* MAP */}
      <img
        src={mapImages[currentMap]}
        alt="map"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      {/* OVERLAY */}
      <svg
        width="1024"
        height="1024"
        style={{ position: "absolute", top: 0, left: 0 }}
      >

        {/* MOVEMENT */}
        {movement.map((p, i) => {
          if (i === 0) return null;

          return (
            <line
              key={i}
              x1={movement[i - 1].pixel_x}
              y1={movement[i - 1].pixel_y}
              x2={p.pixel_x}
              y2={p.pixel_y}
              stroke={p.player_type === "Bot" ? "gray" : "blue"}
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* LOOT */}
        {loot.map((p, i) => (
          <circle key={i} cx={p.pixel_x} cy={p.pixel_y} r="4" fill="lime" />
        ))}

        {/* KILLS */}
        {kills.map((p, i) => (
          <circle key={i} cx={p.pixel_x} cy={p.pixel_y} r="5" fill="red" />
        ))}

        {/* DEATHS */}
        {deaths.map((p, i) => (
          <circle key={i} cx={p.pixel_x} cy={p.pixel_y} r="5" fill="orange" />
        ))}

        {/* STORM */}
        {storm.map((p, i) => (
          <circle key={i} cx={p.pixel_x} cy={p.pixel_y} r="6" fill="purple" />
        ))}

      </svg>
    </div>
  );
}

export default MapView;