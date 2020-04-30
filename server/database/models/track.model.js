module.exports = (Sequelize, connector) => {
  const track = connector.define("track", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    artist: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    album_picture: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    youtube_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return track;
};
