// third party module
let {
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
const settings = JSON.parse(fs.readFileSync("./config/settings.json"));
const Collection = require("./lib/discordjs/Collection.js");
let simple = require("./lib/baileys/simple.js");
let WAConnection = simple.WAConnection(_WAConnection);

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

  client.on("connecting", async function () {
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        warning("Connecting")
    );
  });
  client.on("close", async function (cls) {
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        error(`Bot closed...\nReason: ${warning(cls.reason)}`)
    );
  });
  client.on("ws-close", async function (cls) {
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        error(`Bot closed...\nReason: ${warning(cls.reason)}`)
    );
  });
  client.on("open", async () => {
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        warning("Bot Is Online Now!!")
    );
  });

  client.on("chat-update", async (m) => {
    if (!m.hasNewMessage) return;
    if (!m.messages && !chatUpdate.count) return;
    m = m.messages.all()[0];

    try {
      simple.smsg(client, m);
      if (m.isBaileys) return;
      let groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {};
      let participants = m.isGroup ? groupMetadata.participants : [];
      let user = m.isGroup ? participants.find((u) => u.jid == m.sender) : {}; // User Data
      let bot = m.isGroup
        ? participants.find((u) => u.jid == client.user.jid)
        : {}; // Your Data
      let isAdmin = user.isAdmin || user.isSuperAdmin || false; // Is User Admin?
      let isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false; // Are you Admin?
    } catch (e) {
      if (settings.isDevelop) {
        console.log(e);
        return false;
      }
      console.log(error(e));
    }
  });
}

start();
