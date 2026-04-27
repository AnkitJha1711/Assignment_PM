const data = require("../data/events.json");

const getEvents = (req, res) => {
  res.json(data);
};

const getStats = (req, res) => {
  const stats = {
    totalEvents: data.length,
    totalLoot: data.filter((d) => d.event === "Loot").length,
    totalKills: data.filter((d) =>
      ["Kill", "BotKill"].includes(d.event)
    ).length,
    totalDeaths: data.filter((d) =>
      ["Killed", "BotKilled", "KilledByStorm"].includes(d.event)
    ).length,
    totalMovement: data.filter((d) =>
      ["Position", "BotPosition"].includes(d.event)
    ).length,
  };

  res.json(stats);
};

module.exports = {
  getEvents,
  getStats,
};