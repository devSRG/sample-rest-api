const express = require('express');
const pizzaEndpoint = require('./endpoints/pizza');
const deliveryEndpoint = require('./endpoints/delivery');

const app = express();

app.use(express.json());
app.use('/pizza', pizzaEndpoint);
app.use('/delivery', deliveryEndpoint);

app.listen(8080);
