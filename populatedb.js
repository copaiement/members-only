
console.log('This script populates some Areas, Sectors, Routes, and Comments');

const Message = require('./models/message');
const Upgrade = require('./models/upgrade');
const User = require('./models/user');

const messages = [];
const upgrades = [];
const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createMessages();
  await createUpgrades();
  await createUsers();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function messageCreate(index, area_name, state, added_by) {
  const area = new Message({
    area_name: area_name,
    state: state,
    added_date: new Date(),
    added_by: added_by,
  });
  await area.save();
  areas[index] = area;
  console.log(`Added area: ${area_name}`);
}

async function upgradeCreate(index, sector_name, area, added_by) {
  const sector = new Upgrade({
    sector_name: sector_name,
    area: area,
    added_date: new Date(),
    added_by: added_by,
  });

  await sector.save();
  sectors[index] = sector;
  console.log(`Added sector: ${sector_name}`);
}

async function userCreate(index, route_name, route_type, route_grade, area, sector, added_by) {
  const route = new Message({
    route_name: route_name,
    route_type: route_type,
    route_grade: route_grade,
    area: area,
    sector: sector,
    added_date: new Date(),
    added_by: added_by,
  });

  await route.save();
  routenames[index] = route;
  console.log(`Added route: ${route_name}`);
}

async function createMessages() {
  console.log('Adding areas');
  await Promise.all([
    areaCreate(0, 'Mt Charleston', 'Nevada', 'CP'),
    areaCreate(1, 'Mt Potosi', 'Nevada', 'cp'),
    areaCreate(2, 'Maple Canyon', 'Utah', 'Cp'),
  ]);
}

async function createSectors() {
  console.log('Adding sectors');
  await Promise.all([
    sectorCreate(0, 'The Hood', areas[0], 'CeePee'),
    sectorCreate(1, 'The Roost', areas[0], 'CePe'),
    sectorCreate(2, 'Clear Light Cave', areas[1], 'C.P.'),
    sectorCreate(3, 'Pipedream Cave', areas[2], 'CP.'),
  ]);
}

async function createRoutenames() {
  console.log('Adding Routes');
  await Promise.all([
    routenameCreate(0, 'Infections Groove', 'Sport', '5.13b', areas[0], sectors[0], 'ColeP'),
    routenameCreate(1, 'Ghetto Boys', 'Sport', '5.13c', areas[0], sectors[0], 'ColePa'),
    routenameCreate(2, 'T.H.E Cat', 'Sport', '5.13b', areas[0], sectors[1], 'ColeP'),
    routenameCreate(3, 'All You Can Eat', 'Sport', '5.15a', areas[1], sectors[2], 'ColeP'),
    routenameCreate(4, 'T-rex', 'Sport', '5.14a', areas[2], sectors[3], 'CoP'),
  ]);
}