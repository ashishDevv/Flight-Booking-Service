const sequelize = require('./index');
const { DataTypes } = require('sequelize');
const Seat = require('./seat');
const Booking = require('./booking');

const BookingSeat = sequelize.define(
    'BookingSeat', 
    {
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Booking,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        seatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Seat,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }



    }, {}
    
);

BookingSeat.sync()
            .then(() => { console.log("BookingSeat Model Sync Completed")})
            .catch((err) => {console.log("Error in Syncing of BookingSeat Model", err)});
                
                
module.exports = BookingSeat;