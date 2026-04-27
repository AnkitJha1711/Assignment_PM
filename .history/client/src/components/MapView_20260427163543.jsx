function MapView({ events }) {
  const movement = events.filter(
    (e) => e.event === "Position" || e.event === "BotPosition"
  );

  const loot = events.filter((e) => e.event === "Loot");

  return (
    <div
      style={{
        position: "relative",
        width: "1024px",
        height: "1024px",
      }}
    >
      <img
        src="/minimaps/Lockdown_Minimap.jpg"
        alt="map"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      <svg
        width="1024"
        height="1024"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {movement.map((p, i) => {
          if (i === 0) return null;

          return (
            <line
              key={i}
              x1={movement[i - 1].pixel_x}
              y1={movement[i - 1].pixel_y}
              x2={p.pixel_x}
              y2={p.pixel_y}
              stroke="blue"
              strokeWidth="2"
            />
          );
        })}

        {loot.map((p, i) => (
          <circle
            key={i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="5"
            fill="green"
          />
        ))}
      </svg>
    </div>
  );
}

export default MapView;