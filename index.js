// third party module
const {
  WAConnection: _WAConnection,
  MessageType,
  Presence,
  MessageOptions,
  Mimetype,
  WALocationMessage,
  WA_MESSAGE_STUB_TYPES,
  ReconnectMode,
  ProxyAgent,
  ChatModification,
  waChatKey,
  WA_DEFAULT_EPHEMERAL,
} = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const moment = require("moment-timezone");
const fs = require("fs");

// local module
const { log, warning, sukses, error } = require("./helpers/values.js");
const Collection = require("./lib/discordjs/Collection.js");
const simple = require("./lib/baileys/simple.js");
const WAConnection = simple.WAConnection(_WAConnection);

const client = new WAConnection();

async function start() {
  client.logger.level = "warn";
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(
      `[ ${moment
        .tz("Asia/Jakarta")
        .format("HH:mm:ss")} ] Scan qrcode with whatsapp!`
    );
  });
  client.on("credentials-updated", () => {
    const authInfo = client.base64EncodedAuthInfo();
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ${warning(
        "Credentials updated!"
      )}`
    );

    fs.writeFileSync(
      "./bot_session.json",
      JSON.stringify(authInfo, null, "\t")
    );
  });

  fs.existsSync("./bot_session.json") &&
    client.loadAuthInfo("./bot_session.json");

  client.on("open", async () => {
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ${warning(
        "Bot Is Online Now!!"
      )}`
    );
  });
}

start();
