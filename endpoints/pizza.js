const router = require('express').Router();
const { appendPaginationInfo } = require('./../utils');
const data = require('./../data/pizza_data.json');

router.get('/', (req, res) => {
    const { ingredients, size, price_range: priceRange, page } = req.query;
    let filteredData, paginatedData;

    if (ingredients) {
        let ingredientsArr = ingredients.split(',');

        filteredData = data.filter(pizza => {
            let filter = false;

            ingredientsArr.forEach(ingredient => {
                if (pizza.ingredients.includes(ingredient)) {
                    filter = true;
                }
            });

            return filter;
        });
    } else if (size && priceRange) {
        filteredData = data.filter(pizza => {
            const prices = priceRange.split('-');
            const pizzaPrice = pizza.prices[size.toUpperCase()]; 

            return pizzaPrice >= parseInt(prices[0]) && pizzaPrice <= parseInt(prices[1]);
        });
    } else {
        filteredData = data;
    }

    paginatedData = appendPaginationInfo(filteredData, page);

    res.json(paginatedData);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    let pizza = data.filter(pizza => pizza.id === id)[0];

    if (pizza) {
        res.json(pizza);
    } else {
        res.json({error: `No pizza available with id: ${id}`});
    }
});

module.exports = router;
