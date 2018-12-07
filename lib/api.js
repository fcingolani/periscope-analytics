const rp = require('request-promise');
const ua = require('random-ua');
const cheerio = require('cheerio');

const Builders = require('./builders');

const createHTTPClient = function () {
  return rp.defaults({
    headers: {
      'User-Agent': ua.generate(),
    },
    jar: true,
  });
}

const PERISCOPE_API_URL = 'https://api.periscope.tv/api/v2';

module.exports = {

  async getRecentBroadcastPeriscopeIds(userName) {
    const request = createHTTPClient();

    let profilePage = await request(`https://www.periscope.tv/${userName}`);

    let $profilePage = cheerio.load(profilePage);

    let profilePageStore = $profilePage('#page-container').data('store');

    let userId = profilePageStore.UserCache.usernames[userName];
    let sessionId = profilePageStore.SessionToken.public.broadcastHistory.token.session_id;

    let users = {};

    let broadcasts = await request(`${PERISCOPE_API_URL}/getUserBroadcastsPublic`, {
      json: true,
      qs: {
        user_id: userId,
        session_id: sessionId,
      }
    });

    let ids = [];

    for (let rawBroadcast of broadcasts.broadcasts) {
      ids.push(rawBroadcast.id);
    }

    return ids;
  },

  async getBroadcastEntities(broadcastId) {
    const request = createHTTPClient();

    let broadcastPage = await request(`https://www.periscope.tv/w/${broadcastId}`);

    let $broadcastPage = cheerio.load(broadcastPage);

    let broadcastPageStore = $broadcastPage('#page-container').data('store');

    let broadcastCacheItem = broadcastPageStore.BroadcastCache.broadcasts[broadcastId];

    let broadcast = Builders.broadcast(broadcastCacheItem);
    let broadcasterUser = Builders.user(broadcastCacheItem.broadcast);

    let users = {};
    users[broadcasterUser.id] = broadcasterUser;

    let access = await request(`${PERISCOPE_API_URL}/getAccessPublic`, {
      json: true,
      qs: {
        broadcast_id: broadcast.id,
      }
    });

    let body = {
      access_token: access.access_token,
      cursor: '',
      limit: 1000,
      since: 0
    };

    let messages = [];

    do {
      let history = await request(`${access.endpoint}/chatapi/v1/history`, {
        method: 'post',
        json: true,
        body: body,
      });

      for (let rawMessage of history.messages) {

        let message = Builders.message(rawMessage);

        switch (message.type) {
          case 'heart':
            broadcast.totalHeartCount++;
            break;

          case 'comment':
            broadcast.totalCommentCount++;
            break;
        }

        let user = Builders.user(rawMessage.payload.sender);

        users[user.id] = Object.assign(users[user.id] || {}, user);

        messages.push(message);

      }

      body.cursor = history.cursor;

    } while (body.cursor);

    return {
      broadcasts: [broadcast],
      users: Object.values(users),
      messages: messages,
    };

  }

}