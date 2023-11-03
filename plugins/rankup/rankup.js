// plugins/rankup/rankup.js

const rankupImages = {
    "level 2": "https://tenor.com/view/mirai-gif-24071371",
    "level 3": "https://tenor.com/view/phantouki-touki-gif-19437985",
    "level 4": "https://tenor.com/view/phantouki-touki-gif-19437987",
    "level 5": "https://tenor.com/view/phantouki-touki-gif-19437983",
    "level 6": "https://tenor.com/view/phantouki-touki-gif-19437984",
    "level 7": "https://tenor.com/view/mirai-beyond-the-boundary-anime-mirai-kuriyama-kyoukai-no-kanata-gif-18824352",
    "level 8": "https://tenor.com/view/anime-gif-18993238",
    "level 9": "https://tenor.com/view/mirai-kuriyama-cleaning-kyoukai-no-kanata-wiping-glasses-gif-8962880",
    "level 10": "https://tenor.com/view/xkyorii-kyorii-takanashi-rikka-rikka-takanashi-mirai-kuriyama-gif-26683830"
  };
  
  const plugin = {
    name: "Rankup",
    description: "Allows users to rank up endlessly with different message requirements for each level and different permissions for each rank.",
    owner: "Yoshii.js",
    version: "2.1.0",
  
    ranks: {},
    messages: {},
  
    async loadRanks() {
      // Read the ranks.json file.
      const ranks = await api.readFile("plugins/rankup/ranks.json");
  
      // Parse the ranks.json file.
      const ranksObject = JSON.parse(ranks);
  
      // Store the ranks in the plugin.
      this.ranks = ranksObject;
    },
  
    async loadMessages() {
      // Get the database connection.
      const db = api.getDatabaseConnection();
  
      // Get the number of messages that each user has sent.
      const messages = await db.query("SELECT senderID, message_count FROM rankup_messages");
  
      // Store the number of messages for each user in the plugin.
      for (const message of messages) {
        this.messages[message.senderID] = message.message_count;
      }
    },
  
    async saveRank(senderID, rank) {
      // Get the database connection.
      const db = api.getDatabaseConnection();
  
      // Update the user's rank in the database.
      await db.query("UPDATE rankup_messages SET rank = $1 WHERE senderID = $2", [rank, senderID]);
    },
  
    async rankUpUser(senderID) {
      // Get the user's current rank.
      const rank = await api.getUserRank(senderID);
  
      // Get the number of messages required to reach the next level.
      const messagesRequired = this.ranks[rank].config.messages_required;
  
      // Get the number of messages that the user has sent.
      const messageCount = this.messages[senderID];
  
      // If the user has sent enough messages to reach the next level, rank them up.
      if (messageCount >= messagesRequired) {
        // Rank up the user.
        const newRank = rank + 1;
        await api.updateUserRank(senderID, newRank);
  
        // Reset the user's message count.
        this.messages[senderID] = 0;
  
        // Save the user's rank to the database.
        await this.saveRank(senderID, newRank);
  
        // Create an embed message to inform the user that they have been ranked up.
        const embed = new api.MessageEmbed()
          .setTitle("Congratulations!")
          .setDescription(`You have been ranked up to level ${newRank}!`)
          .setImage(rankupImages[newRank]);
  
        // Send the embed message to the user.
        api.sendMessage(embed, senderID);
  
        // If the user has reached level 10, send a special message to them.
        if (newRank === 10) {
          const specialEmbed = new api.MessageEmbed()
            .setTitle("Welcome to the Master's Club!")
            .setDescription("You have reached the highest level of the rankup system! You are now a master of this chat.")
            .setImage("https://example.com/rankup-10-master-mirai.gif");
  
          api.sendMessage(specialEmbed, senderID);
  