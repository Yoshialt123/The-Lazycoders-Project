// utils.js

const isAdmin = (userID) => {
  // Get the admin user IDs from the config file.
  const adminUserIDs = config.adminBot;

  // Return true if the user is an admin.
  return adminUserIDs.includes(userID);
};

// Formats the specified message so that it is displayed correctly in Yoshii.js.
const formatMessage = (message) => {
  // Replace newlines with `<br>` tags.
  message = message.replace(/\n/g, "<br>");

  // Escape special characters.
  message = message.replace(/&/g, "&amp;");
  message = message.replace(/</g, "&lt;");
  message = message.replace(/>/g, "&gt;");

  return message;
};

// Sends a paginated message to the user.
async function sendPaginatedMessage(senderID, messages) {
  // Create a new embed message for each page.
  const embedMessages = [];
  for (const message of messages) {
    const embed = new api.MessageEmbed()
      .setTitle("Paginated Message")
      .setDescription(message);

    embedMessages.push(embed);
  }

  // Send the embed messages to the user, one at a time.
  for (const embedMessage of embedMessages) {
    await api.sendMessage(embedMessage, senderID);
  }
}

// Gets the thread information for the specified thread.
async function getThreadInfo(threadID) {
  // Get the thread information from the Discord API.
  const threadInfo = await api.getThreadInfo(threadID);

  return threadInfo;
}

// Gets the user's permissions in the current thread.
async function getUserPermissions(senderID) {
  // Get the user's permissions from the Discord API.
  const userPermissions = await api.getUserPermissions(senderID);

  return userPermissions;
}

// Sends a temporary message to the user that will automatically be deleted after the specified duration.
async function sendTemporaryMessage(senderID, message, duration) {
  // Create a new embed message with the temporary message.
  const embed = new api.MessageEmbed()
    .setTitle("Temporary Message")
    .setDescription(message);

  // Send the embed message to the user.
  const messageID = await api.sendMessage(embed, senderID);

  // Delete the message after the specified duration.
  setTimeout(() => {
    api.deleteMessage(messageID);
  }, duration);
}

// Gets the rankup images from the rankup plugin.
async function getRankupImages() {
  // Get the rankup plugin.
  const rankupPlugin = api.getPlugin("rankup");

  // Get the rankup images.
  const rankupImages = rankupPlugin.rankupImages;

  return rankupImages;
}

// Sends an embed message to the user with the specified image.
async function sendMessageWithImage(senderID, message, imageURL) {
  // Create an embed message with the image.
  const embed = new api.MessageEmbed()
    .setTitle("Message from Yoshii.js")
    .setDescription(message)
    .setImage(imageURL);

  // Send the embed message to the user.
  await api.sendMessage(embed, senderID);
}

// Sends an embed message to the user.
async function sendMessageWithEmbed(senderID, embed) {
  // Send the embed message to the user.
  await api.sendMessage(embed, senderID);
}

// Gets the user's rank.
async function getUserRank(senderID) {
  // Get the user's rank from the rankup plugin.
  const rankupPlugin = api.getPlugin("rankup");
  const rank = rankupPlugin.getRank(senderID);

  return rank;
}

// Sends a message to all users in the chat.
async function sendMessageToAllUsers(message) {
  // Get all of the users
