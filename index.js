const express = require('express');

const { PORT } = require('./src/config/server-config');

const apiRoutes = require('./src/routes/index');

const sequelize = require('./src/models');

const CRON = require('./src/utils/common/cron-jobs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use("/api", apiRoutes);



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    CRON();
});

