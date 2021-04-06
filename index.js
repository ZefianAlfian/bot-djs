//third party module
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
  Browsers,
} = require("@adiwajshing/baileys");
let { text } = MessageType;
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const moment = require("moment-timezone");

//local module
const Collection = require("./lib/discordjs/Collection");
const { warning, error, sukses, log } = require("./app/helpers/values");

const { msgFilter } = require("./app/helpers/msgFilter");
const simple = require("./lib/baileys/simple");

//configuration
const settings = JSON.parse(fs.readFileSync("./app/config/settings.json"));

async function main() {
  let WAConnection = simple.WAConnection(_WAConnection);
  const client = new WAConnection();
  client.logger.level = "silent";
  client.browserDescription = Browsers.macOS("Safari");
  
  client.commands = new Collection();
  client.aliases = new Collection();
  /* client.categories = fs.readdirSync("./commands");
  ["command"].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
  });
  */
 
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        warning("Scan qr code with whatsapp")
    );
  });

  client.on("credentials-updated", () => {
    const authinfo = client.base64EncodedAuthInfo();
    log(
      `[ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")} ] ` +
        warning("Credentials Updated")
    );
    fs.writeFileSync(
      "./bot_session.json",
      JSON.stringify(authinfo, null, "\t")
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
        sukses("Bot Is Online Now!!")
    );
  });

  await client.connect({ timeoutMs: 50 * 1000 });
  client.setMaxListeners(35);

  client.on("chat-update", async (m) => {
    if (!m.hasNewMessage) return;
    if (!m.messages && !m.count) return;
    m = m.messages.all()[0];
    try {
      simple.smsg(client, m);
      console.log(m.text)
    } catch (e) {
      settings.isDevelop ? log(e) : log(error(e));
    }
  });

  client.on("CB:action,,call", async (json) => {
    const callerId = json[2][0][1].from;
    log(
      `${warning("[WARN]")} ${error(callerId.split("@")[0] + " is calling!")}`
    );
    log(`${warning("[WARN]")} ${error("Process Blocked")}`);
    client.sendMessage(callerId, "Don't call or I'll block you!!", text);
    client.sendMessage(callerId, "For unblock you can contact my owner", text);

    setTimeout(function () {
      client
        .blockUser(callerId, "add") // Block user
        .then((res) => log(warning("[INFO]"), error("Succses block contact")));
    }, 5000);
  });
}

main();
