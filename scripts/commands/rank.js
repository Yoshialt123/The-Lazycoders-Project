// scripts/commands/rank.js

const rankCommand = {
    name: "rank",
    description: "See your rank progress.",
    usage: "",
    owner: "Yoshii",
  
    onStart: async function ({ api, event }) {
      // Get the user's current rank.
      const rank = await api.getUserRank(event.senderID);
  
      // Send a message to the user with their rank.
      api.sendMessage(`Your rank is ${rank}.`, event.threadID, event.messageID);
    }
  };
  
  module.exports = rankCommand;
  