const { Room } = require('./room');
const { Item } = require('./item');
const { Food } = require('./food');
const { Enemy } = require('./enemy');

class World {
  static rooms = {};
  static enemies = [];

  static setPlayer(player) {
    for (let enemy of World.enemies) {
      if (enemy) {
        enemy.setPlayer(player);
      }
    }
  }

  static startGame() {
    for (let enemy of World.enemies) {
      if (enemy) {
        enemy.rest();
      }
    }
  }

  static getEnemiesInRoom(room) {
    return World.enemies.filter(enemy => enemy.currentRoom === room);
  }

  static loadWorld(worldData) {
    const roomList = worldData.rooms;
    const itemList = worldData.items;
    const enemyList = worldData.enemies;

    // Instantiate new room objects
    for (let roomData of roomList) {
      let newRoom = new Room(roomData.name, roomData.description);
      World.rooms[roomData.id] = newRoom;
    }

    // Connect rooms by ID
    for (let roomData of roomList) {
      let roomID = roomData.id;
      let roomConnections = roomData.exits;

      for (const direction in roomConnections) {
        let connectedRoomID = roomConnections[direction];
        let roomToConnect = World.rooms[connectedRoomID];
        World.rooms[roomID].connectRooms(direction, roomToConnect);
      }
    }

    // Instantiate items
    for (let itemData of itemList) {
      let newItem;

      if (itemData.isFood) {
        newItem = new Food(itemData.name, itemData.description);
      } else {
        newItem = new Item(itemData.name, itemData.description);
      }

      let itemRoom = World.rooms[itemData.room];
      itemRoom.items.push(newItem);
    }

    // Instantiate enemies
    for (let enemyData of enemyList) {
      let enemyRoom = World.rooms[enemyData.room];
      let newEnemy = new Enemy(enemyData.name, enemyData.description, enemyRoom);
      World.enemies.push(newEnemy);
    }
  }
}

module.exports = {
  World,
};
