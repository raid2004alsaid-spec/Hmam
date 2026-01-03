require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  const { ID } = req.query;
  res.render("audio", { chatId: ID });
});

app.post("/audio", async (req, res) => {
  const { chatId, audio } = req.body;
  if (!chatId || !audio) return res.send("NO DATA");

  const buffer = Buffer.from(audio.split(",")[1], "base64");

  await bot.sendAudio(chatId, buffer, {
    caption: "🎙 تسجيل صوتي"
  }, {
    filename: "record.webm",
    contentType: "audio/webm"
  });

  res.send("OK");
});

app.listen(process.env.PORT || 3000);