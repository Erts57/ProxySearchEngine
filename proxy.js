const express = require("express");
const request = require("request");
const app = express();
const port = 3000;

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
            // Modify the HTML to replace href and src attributes with the proxy URL
            const modifiedBody = body.replace(/(href|src)="(.*?)"/g, (match, p1, p2) => {
                if (p2.startsWith("http")) {
                    return `${p1}="${p2}"`;
                } else {
                    return `${p1}="https://proxy-9xyk.onrender.com/proxy?url=${encodeURIComponent(p2)}"`;
                }
            });

            // Forward the modified HTML content to the client
            res.set(response.headers);
            res.status(response.statusCode);
            res.send(modifiedBody);
        }
    });
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}/proxy?url=https://roblox.com/`);
});
