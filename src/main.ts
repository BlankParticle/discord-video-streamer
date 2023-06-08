import { config } from "dotenv";
import { Client } from "discord.js-selfbot-v13";
import {
  command,
  setStreamOpts,
  streamLivestreamVideo,
} from "@dank074/discord-video-stream";

const VIDEO_URL =
  "https://cdn.discordapp.com/attachments/1106167432936173671/1116356575494426704/Rick_Astley_-_Never_Gonna_Give_You_Up_Official_Music_Video_dQw4w9WgXcQ.mp4";
const GUILD_ID = "1085941898054738072";
const CHANNEL_ID = "1085954314343825418";

let startVideo = async () => {
  setStreamOpts(1280, 720, 30, 1000, false);

  const client = new Client();
  await client.login(process.env.TOKEN);
  console.log("Logged in as " + client.user?.username);

  client.patchVoiceEvents();

  let vc = await client.joinVoice(GUILD_ID, CHANNEL_ID);
  client.signalVideo(GUILD_ID, CHANNEL_ID, true);

  vc.voiceConnection.setSpeaking(true);
  vc.voiceConnection.setVideoStatus(true);

  try {
    console.log("Trying to play video: " + VIDEO_URL);
    const res = await streamLivestreamVideo(VIDEO_URL, vc);
    console.log("Finished playing video " + res);
  } catch (e) {
    console.log(e);
  } finally {
    client.signalLeaveVoice();
    client.leaveVoice();
    command?.kill("SIGINT");
    vc.voiceConnection.setSpeaking(false);
    vc.voiceConnection.setVideoStatus(false);
  }
};

config();
if (!process.env.TOKEN) {
  console.error("Create a .env file with TOKEN=YOUR_USER_TOKEN");
}
startVideo();
