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

Sever is running on:
http://localhost:${PORT}/api/v1
=================================
`));
})
