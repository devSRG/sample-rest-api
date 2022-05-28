const router = require('express').Router();
const { appendPaginationInfo, readJSON, writeJSON } = require('./../utils');
const pizzaData = require('./../data/pizza_data.json');

const USER_ID = '123user';
const DELIVERY_FILENAME = 'delivery_data.json';
const STATUS = {
    PROCESSING: 'PROCESSING',
    DONE: 'DONE'
};

let data = readJSON(DELIVERY_FILENAME);

router.get('/', (req, res) => {
    const { state, page } = req.query;
    let filteredData = data, paginatedData;

    if (state && state.toUpperCase() == 'P') {
        filteredData = data.filter(deliveryInfo => deliveryInfo.status === STATUS.PROCESSING);
    } else if (state && state.toUpperCase() == 'D') {
        filteredData = data.filter(deliveryInfo => deliveryInfo.status === STATUS.DONE);
    } else {
        filteredData = data;
    }

    paginatedData = appendPaginationInfo(filteredData, page);

    res.json(paginatedData);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    let deliveryInfo = data.filter(deliveryInfo => deliveryInfo.id === id)[0];

    if (deliveryInfo) {
        res.json(deliveryInfo);
    } else {
        res.json({error: `No delivery info available with id: ${id}`});
    }
});

router.post('/', (req, res) => {
    const { pizza_id, pizza_size, pizza_count } = req.body;
    const pizza = pizzaData.filter(pizza => pizza.id === pizza_id)[0];

    if (pizza) {
        const model = {
            id: data.length ? +data[data.length - 1].id + 1+"": 1+"",
            user_id: USER_ID,
            pizza_id,
            time: Date.now(),
            pizza_size: pizza_size.toUpperCase(),
            amount: pizza.prices[pizza_size.toUpperCase()] * pizza_count,
            pizza_count,
            status: STATUS.PROCESSING
        };
    
        data.push(model);
    
        writeJSON(DELIVERY_FILENAME, data);
    
        res.status(201).end();
    } else {
        res.json({error: `No pizza available with pizza_id: ${pizza_id}`});
    }
});

router.post('/done', (req, res) => {
    const { delivery_id: id } = req.body;
    let deliveryInfo = data.filter((deliveryInfo, i) => deliveryInfo.id == id)[0];

    if (deliveryInfo) {
        if (deliveryInfo.status !== STATUS.DONE) {
            setTimeout(() => {
                deliveryInfo.status = STATUS.DONE;

                writeJSON(DELIVERY_FILENAME, data);
            }, 25 * 60 * 1e3);
        }

        res.status(202).end();
    } else {
        res.json({error: `No delivery info available with delivery_id: ${delivery_id}`});
    }
});

module.exports = router;
