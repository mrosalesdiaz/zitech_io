const test = require('ava');
const { isEmpty } = require('lodash');
const axios = require('axios').default;

test('Create Bingo', async t => {

    await axios.post('http://localhost:12500/api/v1/bingo')
        .then(ret => ret.data)
        .then(bingo => {
            if (isEmpty(bingo)) { t.fail() }
            t.pass();
            console.log(`bingo: ${bingo?.id} created`)
        })
});
