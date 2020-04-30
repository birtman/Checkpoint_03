module.exports = (Sequelize, connector) => {
  const playList = connector.define("playlist", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return playList;
};
