// THIS SCRIPT CREATES TEST MESSAGES AND THE MEMBER AND ADMIN PWDS

// need dotenv to process.env vars:
// MONGODB_URI
// CLUB_PASS
// ADMIN_PASS

require('dotenv').config();
console.log('This script populates some test messages, and the upgrade passwords');

const Message = require('./models/message');
const Upgrade = require('./models/upgrade');

const messages = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;
console.log(mongoDB);

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createMessages();
  await upgradeCreate();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function upgradeCreate() {
  const upgrade = new Upgrade({
    memberPass: process.env.CLUB_PASS,
    adminPass: process.env.ADMIN_PASS,
  });

  await upgrade.save();
  console.log(`Added upgrade codes`);
}

// Create one message
async function messageCreate(index, text, username) {
  const message = new Message({
    text: text,
    username: username,
    addedDate: new Date(),
  });
  await message.save();
  messages[index] = message;
  console.log(`Added message: ${text}`);
}

// Create all messages
async function createMessages() {
  console.log('Creating Messages');
  await Promise.all([
    messageCreate(0, 'Hi there! Testing', 'CP'),
    messageCreate(1, 'Still just testing', 'cp'),
    messageCreate(2, 'Test test can anyone hear me', 'Cp'),
  ]);
}

