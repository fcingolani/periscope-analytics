const api = require('./lib/api');
const getDB = require('./lib/get-db');
const Builders = require('./lib/builders');

module.exports = {

  importBroadcast: async function (broadcastId) {

    console.log(`Importing broadcast #${broadcastId}.`);

    let db = await getDB('data/database.sqlite');

    let broadcast = await db.Broadcast.findByPk(broadcastId);

    if (broadcast) {
      console.log(`Broadcast #${broadcastId} already imported.`);
    } else {
      try {
        const entities = await api.getBroadcastEntities(broadcastId);

        await db.User.bulkCreate(entities.users, {
          ignoreDuplicates: true,
        });

        let userLanguages = [];
        for(let user of entities.users){
          for(let lang of user.languages){
            userLanguages.push({ UserId: user.id, language: lang });
          }
        }

        await db.UserLanguage.bulkCreate(userLanguages, {
          ignoreDuplicates: true,
        });

        await db.Broadcast.bulkCreate(entities.broadcasts, {
          ignoreDuplicates: true,
        });

        let broadcastTags = [];
        for(let broadcast of entities.broadcasts){
          for(let tag of broadcast.tags){
            broadcastTags.push({ BroadcastId: broadcast.id, tag: tag });
          }
        }

        await db.BroadcastTag.bulkCreate(broadcastTags, {
          ignoreDuplicates: true,
        });

        await db.Message.bulkCreate(entities.messages, {
          ignoreDuplicates: true,
        });

        console.log('Done.');
      } catch (e) {
        console.log(`An error has ocurred:`, e.toString());
      }
    }
  },

  importRecentBroadcasts: async function (userName) {

    const ids = await api.getRecentBroadcastPeriscopeIds(userName);

    console.log(`Importing ${ids.length} broadcasts.`);

    let id;
    while (id = ids.shift()) {
      await this.importBroadcast(id);
      if (ids.length) {
        console.log(`${ids.length} remaining.`);
      }
    }

  },

};