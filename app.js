const express = require("express");
const path = require("path");
const sqlite = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

//connect databaseAnd server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//1 API for getting all playersDetails

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//2 APT for adding player details

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerDetailsQuery = `
INSERT INTO cricket_team
(playerName,jerseyNumber,role) VALUES (
"${playerName}",
"${jerseyNumber}",
"${role}"
);`;
  await db.run(playerDetailsQuery);
  response.send("player Add to Team");
});

//3 API for Getting details for particular id
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerQuery = `SELECT * FROM cricket_team WHERE
  player_id=${playerId};`;
  const player = await db.get(playerQuery);
  response.send(player);
});

//4 API for Updating Player details
app.put("players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerUpdateDetails = request.body;
  const { playerName, jerseyNumber, role } = playerUpdateDetails;
  const playerUpdateQuery = `
  UPDATE cricket_table SET
      playerName='${playerName}',
      jerseyNumber=${jerseyNumber},
      role='${role}'
   WHERE player_id=${playerId};`;
  await db.run(playerUpdateQuery);
  response.send("Player Details Updated");
});

//5 API for Deleting player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team
  WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
