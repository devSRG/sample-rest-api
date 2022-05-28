const fs = require('fs');
const path = require('path');

const LIST_LENGTH = 10;
const DATA_FOLDER = 'data';

appendPaginationInfo = (data, page) => {
    page = page ? parseInt(page): 1;

    const paginationInfo = {
        page,
        total_pages: Math.ceil(data.length / LIST_LENGTH),
        list_length: LIST_LENGTH
    };

    data = data.slice((page - 1) * LIST_LENGTH, page * LIST_LENGTH);

    return Object.assign({result: data}, {pagination_info: paginationInfo});
}

readJSON = (filename) => {
    let filepath = path.resolve(__dirname, DATA_FOLDER, filename);
    let json = [];

    if (fs.existsSync(filepath)) {
        let data = fs.readFileSync(filepath);

        json = JSON.parse(data);
    }

    return json;
}

writeJSON = (filename, data) => {
    let filepath = path.resolve(__dirname, DATA_FOLDER, filename);

    fs.writeFile(filepath, JSON.stringify(data, null, 4), (err) => {
        if (err) throw err;

        console.log(`Updated ${filename} successfully`);
    });
}

module.exports = { appendPaginationInfo, readJSON, writeJSON };
