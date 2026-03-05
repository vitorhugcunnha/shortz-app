// ./modules/user/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../configuration/database');

const User = sequelize.define(
    'User', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false, 
            unique: true,
            validate: { isEmail: true }
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    },
    {
        timestamps: true,
        tableName: 'users'
    }
);

module.exports = User;