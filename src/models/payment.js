   const sequelize = require('./index');
const { DataTypes } = require('sequelize');
const Booking = require('./booking');


const Payment = sequelize.define(
    'Payment', 
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
              },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Booking,
                key: 'id',
              },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        paymentMedium: {
            type: DataTypes.ENUM('UPI', 'CARD', 'NET_BANKING'),
            allowNull: false,
          },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PAID', 'FAILED'),
            allowNull: false,
        }
        
    }, {}
    
);

Payment.belongsTo(Booking, {
    foreignKey: 'bookingId'
});

Payment.sync()
            .then(() => { console.log("Payment Model Sync Completed")})
            .catch((err) => {console.log("Error in Syncing of Payment Model", err);})

module.exports = Payment;