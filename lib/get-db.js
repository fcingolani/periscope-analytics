const Sequelize = require('sequelize');

module.exports = async function (dbPath) {

  const db = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: dbPath,
    logging: false,
  });

  db.Broadcast = db.define('Broadcast', {
    id: { type: Sequelize.STRING, primaryKey: true },
    state: { type: Sequelize.STRING },

    title: { type: Sequelize.TEXT },
    language: { type: Sequelize.STRING },

    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
    startedAt: { type: Sequelize.DATE },
    endedAt: { type: Sequelize.DATE },
    pingedAt: { type: Sequelize.DATE },
    timedoutAt: { type: Sequelize.DATE },

    duration: { type: Sequelize.FLOAT },

    locationDescription: { type: Sequelize.STRING },
    locationCity: { type: Sequelize.STRING },
    locationState: { type: Sequelize.STRING },
    locationCountry: { type: Sequelize.STRING },
    locationISOCode: { type: Sequelize.STRING },
    locationLat: { type: Sequelize.STRING },
    locationLng: { type: Sequelize.STRING },

    width: { type: Sequelize.INTEGER },
    height: { type: Sequelize.INTEGER },
    cameraRotation: { type: Sequelize.INTEGER },
    is360: { type: Sequelize.BOOLEAN },

    contentType: { type: Sequelize.STRING },
    source: { type: Sequelize.STRING },
    tweetId: { type: Sequelize.STRING },

    totalWatchedCount: { type: Sequelize.INTEGER },
    totalCommentCount: { type: Sequelize.INTEGER },
    totalHeartCount: { type: Sequelize.INTEGER },
  },{
    timestamps: false,
  });

  db.Message = db.define('Message', {
    id: { type: Sequelize.STRING, primaryKey: true },
    type: { type: Sequelize.STRING },
    publishedAt: { type: Sequelize.DATE },
    body: { type: Sequelize.TEXT },
  },{
    timestamps: false,
  });

  db.User = db.define('User', {
    id: { type: Sequelize.STRING, primaryKey: true },
    userName: { type: Sequelize.STRING },
    displayName: { type: Sequelize.STRING },
    profileImageURL: { type: Sequelize.TEXT },
    locale: { type: Sequelize.STRING },
    vip: { type: Sequelize.STRING },
    verified: { type: Sequelize.BOOLEAN },
    TwitterAccountId: { type: Sequelize.TEXT },
  },{
    timestamps: false,
  });

  db.UserLanguage = db.define('UserLanguage', {
    language: {
      type: Sequelize.STRING(2),
      primaryKey: true,
    },
    UserId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
  }, {
    timestamps: false,
    indexes: [
      { unique: true, fields: ['UserId', 'language'] }
    ]
  });

  db.BroadcastTag = db.define('BroadcastTag', {
    tag: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    BroadcastId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
  }, {
    timestamps: false,
    indexes: [
      { unique: true, fields: ['BroadcastId', 'tag'] }
    ]
  });

  db.Broadcast.hasMany(db.Message, {as: 'Messages'});
  db.Broadcast.hasMany(db.BroadcastTag, {as: 'Tags'});

  db.User.hasMany(db.Broadcast, {as: 'Broadcasts'});
  db.User.hasMany(db.Message, {as: 'Messages'});;
  db.User.hasMany(db.UserLanguage, {as: 'Languages'});

  await db.sync();

  return db;

}