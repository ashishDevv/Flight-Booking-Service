const sequelize = require('./index');
const { DataTypes } = require('sequelize');

const Booking = sequelize.define(
    'Booking', 
    {
        flightId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CANCELLED', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'PENDING'
        },
        noOfSeats: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }



    }, {}
    
  );

  Booking.sync()
            .then(() => { console.log("Booking Model Sync Completed")})
            .catch((err) => {console.log("Error in Syncing of Booking Model", err);})

  module.exports = Booking;