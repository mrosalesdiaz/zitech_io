const path = require('path');
const http = require('http');
const express = require("express");
const oasTools = require("@oas-tools/core");

const PORT=12500;
const app = express();

app.use(express.json());
const config = {
    oasFile: './lib/api/openapi.yaml',

    middleware: {
        router: {
            controllers: path.join(__dirname, './controllers')
        },
        security: { disable: true, },

        error: {
            customHandler: (err, send) => {
                console.error('-->', err)

                return send(500, { message: 'Internal Server Error' })
            }
        }
    }
}

return oasTools.initialize(app, config).then(() => {
    http.createServer(app).listen(PORT,
        () => console.log(`
=================================
Bingo Backend Service ${PORT}

API is running on:
http://localhost:${PORT}/api/v1

Steps for execution:

1. Create a new Bingo game
POST: http://localhost:${PORT}/api/v1/bingo
    It will return a Bingo ID that will be used in the next step

2. Generate and resgiter a new Bingo card
POST: http://localhost:${PORT}/api/v1/bingo/{bingoId}/cards

3. Get a random number
POST: http://localhost:${PORT}/api/v1/bingo/{bingoId}/number
    This will return a number from the selected bingo game, and remove it from the list of available numbers


----
For documentation on the enpoints, please visit:
http://localhost:12500/docs/

=================================
`));
})
