const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");
const chalk = require("chalk");

const PREFIX = ":";
const commandPath = path.join(__dirname, "scripts", "commands");

const commands = {};

async function loadCommands() {
  const commandFiles = await fs.promises.readdir(commandPath);

  const filteredCommandFiles = commandFiles.reduce((filtered, file) => {
    if (file.endsWith(".js")) {
      filtered.push(file);
    }
    return filtered;
  }, []);

  for (const file of filteredCommandFiles) {
    const commandName = path.basename(file, ".js");
    commands[commandName] = require(path.join(commandPath, file));
  }
}

await loadCommands();

fs.promises.watch(commandPath).then((watcher) => {
  watcher.on("change", async (filename) => {
    if (filename.endsWith(".js")) {
      const commandName = path.basename(filename, ".js");
      delete require.cache[require.resolve(path.join(commandPath, filename))];
      commands[commandName] = require(path.join(commandPath, filename));
      console.log(`AutoReload: ${commandName} Realoded`);
    }
  });
});

login({ appState: loadAppState() }, (err, api) => {
  if (err) return console.error(err);

  api.on("message", async (event) => {
    if (event.body && event.body.toLowerCase() === "prefix") {
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

const PORT = process.env.PORT || 3000;
console.log(chalk.grey("Yoshii - (1.0.200)"));
console.log(chalk.green("[fca-yoshii]: Logging in"));

module.exports = {
    author: "Yoshii"
};
