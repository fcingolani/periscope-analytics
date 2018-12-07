const moment = require('moment');

module.exports = {

  broadcast(broadcastCacheItem) {
    let rawBroadcast = broadcastCacheItem.broadcast;

    return {
      id: rawBroadcast.id,

      UserId: rawBroadcast.user_id,

      state: rawBroadcast.state,

      tags: rawBroadcast.tags || [],

      title: rawBroadcast.status,
      language: rawBroadcast.language,

      createdAt: rawBroadcast.created_at,
      updatedAt: rawBroadcast.updated_at,
      startedAt: rawBroadcast.start,
      endedAt: rawBroadcast.endTime,
      pingedAt: rawBroadcast.ping,
      timedoutAt: rawBroadcast.timedout,

      duration: rawBroadcast.duration,

      locationDescription: rawBroadcast.locationDescription,
      locationCity: rawBroadcast.city,
      locationState: rawBroadcast.country_state,
      locationCountry: rawBroadcast.country,
      locationISOCode: rawBroadcast.iso_code,
      locationLat: rawBroadcast.ip_lat,
      locationLng: rawBroadcast.ip_lng,

      width: rawBroadcast.width,
      height: rawBroadcast.height,
      cameraRotation: rawBroadcast.camera_rotation,
      is360: rawBroadcast.has360video === true,

      contentType: rawBroadcast.content_type,
      source: rawBroadcast.broadcast_source,
      tweetId: rawBroadcast.tweet_id,

      totalWatchedCount: broadcastCacheItem.n_watched,
      totalCommentCount: 0,
      totalHeartCount: 0,
    };
  },

  message(rawMessage) {

    rawMessage.payload = JSON.parse(rawMessage.payload);
    rawMessage.payload.body = JSON.parse(rawMessage.payload.body);

    let message = {
      id: rawMessage.signature,
      BroadcastId: rawMessage.payload.room || rawMessage.payload.body.room,
      UserId: rawMessage.payload.sender.user_id,
    }

    if(rawMessage.payload.timestamp) {
      message.publishedAt = moment(rawMessage.payload.timestamp/1000000).toDate();
    }

    if (rawMessage.kind === 2) {

      message.type = 'join';

    } else if (rawMessage.kind === 1) {

      if (rawMessage.payload.body.type === 1) {
        message.type = 'comment';
        message.body = rawMessage.payload.body.body;
      } else if (rawMessage.payload.body.type === 2) {
        message.type = 'heart';
      } else if (rawMessage.payload.body.type === 3) {
        message.type = 'greeting';
      } else if (rawMessage.payload.body.type === 5) {
        message.type = 'closing';
      } else if (rawMessage.payload.body.type === 6) {
        message.type = 'follower-invitation';
      } else if (rawMessage.payload.body.type === 9) {
        message.type = 'opening';
      } else if (rawMessage.payload.body.type === 13) {
        message.type = 'twitter-share';
      } else if (rawMessage.payload.body.type === 36 || rawMessage.payload.body.type === 37) {
        message.type = 'gift';
      }

    }

    if (!message.type) {
      message.type = 'unknown';
    }

    return message;
  },

  user(rawUser) {

    let user = {
      id: rawUser.user_id,
    };

    if(rawUser.username){
      user.userName = rawUser.username;
    }

    if(rawUser.display_name){
      user.displayName = rawUser.display_name;
    }

    if(rawUser.profile_image_url){
      user.profileImageURL = rawUser.profile_image_url;
    }

    if(rawUser.locale){
      user.locale = rawUser.locale;
    }

    if(rawUser.vip){
      user.vip = rawUser.vip;
    }

    if(rawUser.verified){
      user.verified = rawUser.verified;
    }

    if(rawUser.twitter_id){
      user.TwitterAccountId = rawUser.twitter_id;
    }

    user.languages = rawUser.lang || [];

    return user;
  }

}