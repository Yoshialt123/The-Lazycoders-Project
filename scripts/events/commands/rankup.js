// events/commands/rankup.js

const plugin = require("./plugins/rankup.js");

api.registerEventHandler({
  type: "message",

  onMessage: async function ({ api, event }) {
    // Increment the user's message count.
    api.updateUserMessageCount(event.senderID, 1);

    // Check if the user has enough messages to rank up.
    const rank = await api.getUserRank(event.senderID);
    const messageCount = await api.getUserMessageCount(event.senderID);
    const levels = plugin.levels;

    if (messageCount >= levels[rank + 1]) {
      // Rank up the user.
      rank++;

      // Update the user's rank.
      api.updateUserRank(event.senderID, rank);

      // Reset the user's message count.
      api.updateUserMessageCount(event.senderID, 0);

      // Send a message to the user with their new rank.
      api.sendMessage(`Your rank has been updated to ${rank}.`, event.threadID, event.messageID);
    }
  }
});
