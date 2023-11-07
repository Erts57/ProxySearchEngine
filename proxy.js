const express = require("express");
const request = require("request");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/proxy", (req, res) => {
    const { url } = req.query;

    if (!url) {
        res.status(400).json({ error: "You must provide a URL to proxy." });
        return;
    }

    // Proxy the request to the provided URL
    request(url, (error, response, body) => {
        if (error) {
            res.status(500).json({ error: "Error while proxying the request." });
        } else {
            // Forward the response headers and body to the client
            res.set(response.headers);
            res.status(response.statusCode);
            res.send(body);
        }
    });
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}/proxy?url=https://example.com`);
});
