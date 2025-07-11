const { defaultFormat } = require("moment");
const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Progress', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            idUser: {
                type: DataTypes.INTEGER,
            },
            progress_1: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            progress_50: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            progress_100: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            foto: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultFormat: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultFormat: DataTypes.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Progress');
    },
};
