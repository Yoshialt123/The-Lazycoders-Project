const utils = require("./utils");
const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");

const { config } = require("./config.json");
const PREFIX = config.prefix;

const commands = {};

async function loadCommands() {
  const commandFiles = await fs.promises.readdir(path.join(__dirname, "scripts", "commands"));

  const filteredCommandFiles = commandFiles.reduce((filtered, file) => {
    if (file.endsWith(".js")) {
      filtered.push(file);
    }
    return filtered;
  }, []);

  for (const file of filteredCommandFiles) {
    const commandName = path.basename(file, ".js");
    commands[commandName] = require(path.join(__dirname, "scripts", "commands", file));
  }
}

await loadCommands();

fs.promises.watch(path.join(__dirname, "scripts", "commands")).then((watcher) => {
  watcher.on("change", async (filename) => {
    if (filename.endsWith(".js")) {
      const commandName = path.basename(filename, ".js");
      delete require.cache[require.resolve(path.join(__dirname, "scripts", "commands", filename))];
      commands[commandName] = require(path.join(__dirname, "scripts", "commands", filename));
      console.log(`AutoReload: ${commandName} Realoded`);
    }
  });
});

login({ appState: loadAppState() }, (err, api) => {
  if (err) return console.error(err);

  api.on("message", async (event) => {
    if (event.body && event.body.toLowerCase() === PREFIX) {
      api.sendMessage(`My prefix is: \`${PREFIX}\``, event.threadID, event.messageID);
    } else if (event.body && event.body.toLowerCase().startsWith(PREFIX)) {
      const [command, ...args] = event.body.slice(PREFIX.length).trim().split(" ");

      if (commands[command]) {
        await commands[command].run({ api, event, args });
      } else {
        api.sendMessage("Invalid command.", event.threadID, event.messageID);
      }
    }
  });
});

function loadAppState() {
  try {
    const appStatePath = path.join(__dirname, "appstate.json");
    return JSON.parse(fs.readFileSync(appStatePath, "utf8"));
  } catch (error) {
    console.error("Error loading app state:", error);
    return null;
  }
}
