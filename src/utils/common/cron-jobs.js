const cron = require('node-cron');

const { BookingService } = require('../../services');
const { Op } = require("sequelize");
const Booking = require('../../models/booking');

function scheduleCrons() {
    cron.schedule('*/2 * * * *', async () => {
        await bookingDestroyer();
    });
}

async function bookingDestroyer () {
    const time = new Date(Date.now() - 1200000) // 20 mins ago from current time
    const booking = await Booking.findOne({
        where: {
            createdAt: { [Op.lte] : time },
            status: 'PENDING'
        }
    });

    if(!booking) {
        console.log("Nothing for Job");
        return;
    }
    const response = await BookingService.destroyBooking(booking.id);
    if(response) {
        console.log("JOB DONE");
        return;
    }
}


module.exports = scheduleCrons;
