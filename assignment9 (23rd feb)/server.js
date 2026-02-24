const http = require("http");
const fs = require("fs");
const qString = require("querystring");


const user = {
    username: "admin",
    pass: "1234"
};

const server = http.createServer((req, res) => {

    //server login logic
    if(req.method === "GET" && req.url === "/"){
        fs.readFile("index.html", (err, data) => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        });
    }

    //login api logic
    else if(req.method === "POST" && req.url === "/login"){
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const parseData = qString.parse(body);

            if(parseData.username === user.username && parseData.pass === user.pass){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end("<h3>Logged in!</h3>");
            }

            else{
                res.writeHead(401, {"Content-Type": "text/html"});
                res.end("<h3>incorrect details.</h3>");
            }
        });
    }

    //logic for 404 error.
    else{
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Page not found.");
    }
});

server.listen(3030, () => {
    console.log("Server running at http://localhost:3030");
})