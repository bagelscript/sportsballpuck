/// <reference lib="dom" />

// @ts-ignore
import config from "./config.json" assert { type: "json" };
import Audic from "audic";
import { exec } from "child_process";

const FOOTBALL_TEAMS = config.TEAMS.filter((team) => team.league === "NFL");
const HOCKEY_TEAMS = config.TEAMS.filter((team) => team.league === "NHL");

const execute = (command: any, callback: any) => {
  var cmd = exec(command, function (error, stdout, stderr) {
    console.log("error: " + error);
    callback(stdout);
  });
};

const activateScore = async (team: any) => {
  const actionUrl = config.HUE_MATTS_OFFICE_GROUP_ACTION_URL;
  const url = config.HUE_MATTS_OFFICE_GROUP_URL;
  let count = 0;
  let intervalId: NodeJS.Timeout;

  const audic = new Audic(team.sound);
  audic.volume = 0.5;
  audic.play();
  // execute("mpg321 -g 50 media/goal.mp3", () => {});

  intervalId = setInterval(async () => {
    if (count >= 36) {
      clearInterval(intervalId);
      audic.destroy();
    } else {
      const group = await (await fetch(url, { method: "GET" })).json();
      if (group.action.bri < 254) {
        await fetch(actionUrl, { method: "PUT", body: JSON.stringify(team.light) });
      } else {
        await fetch(actionUrl, { method: "PUT", body: JSON.stringify(config.HUE_DIM) });
      }
      count++;
    }
  }, 1000);
};

const main = async () => {
  let intervalId: NodeJS.Timeout;
  let footballGames: { id: string; date: string }[] = [];
  let scores: string[] = [];
  const intervalFn = (isInsideInterval: boolean) => async () => {
    for (const team of FOOTBALL_TEAMS) {
      console.log("finding new football games...");
      const teamData = await (
        await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${team.id}`)
      ).json();
      const nextEvent = teamData?.team?.nextEvent?.[0];
      if (
        nextEvent?.id &&
        nextEvent?.date &&
        new Date(nextEvent?.date).getTime() <= new Date().getTime() &&
        footballGames.filter((g) => g.id === nextEvent?.id)?.length === 0
      ) {
        console.log(`found new game! ${nextEvent.name} at ${new Date(nextEvent.date).getDate()}`);
        footballGames = [...footballGames, { id: nextEvent?.id, date: nextEvent?.date }];
      }
    }

    for (const game of footballGames) {
      console.log("checking the football game scores...");
      const data = await (
        await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${game.id}`)
      ).json();

      if (
        data?.winprobability?.filter((x: any) => x.homeWinPercentage === 0 || x.homeWinPercentage === 1)?.length > 0
      ) {
        console.log("home win probability is 0 or 1, game must be over... removing game");
        footballGames = footballGames.filter((g) => g.id !== game.id);
        // if (isInsideInterval) return clearInterval(intervalId);
        // return Promise.resolve("gg");
      } else {
        const newScores = data?.scoringPlays;
        const newScoreTeamNames = newScores?.map((play: any) => play?.team?.displayName) ?? [];

        if (newScoreTeamNames.length !== scores.length) {
          console.log(`there's a new score! ${newScores[newScores?.length - 1].text}`);
          for (const fteam of FOOTBALL_TEAMS) {
            const scoreFilter = (name: string) => fteam.fullName === name;
            if (newScoreTeamNames.filter(scoreFilter).length !== scores.filter(scoreFilter).length) {
              activateScore(fteam);
            }
          }
          scores = newScoreTeamNames;
        }
      }
    }
  };

  const firstCheck = await intervalFn(false)();
  // if (firstCheck === "gg") return;

  intervalId = setInterval(intervalFn(true), 60000);
};

main();
// activateScore();
