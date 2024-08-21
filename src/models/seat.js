const sequelize = require('./index');
const { DataTypes } = require('sequelize');


const Seat = sequelize.define(
    'Seat', 
    {
        seatNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        class: {
            type: DataTypes.ENUM('ECONOMY', 'PREMIUM', 'BUSINESS'),
            allowNull: false,
          },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('AVALIABLE', 'LOCKED', 'BOOKED'),
            allowNull: false,
            defaultValue: 'AVALIABLE',
        },
        flightId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id',
              },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {}
    
  );

Seat.sync()
            .then(() => { console.log("Seat Model Sync Completed")})
            .catch((err) => {console.log("Error in Syncing of Seat Model", err);})

module.exports = Seat;