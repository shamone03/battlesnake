import express from 'express';

export default function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send(handlers.info());
  });

  app.post("/start", (req, res) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req, res) => {
    res.send(handlers.move(req.body));
  });

  app.post("/end", (req, res) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.use(function(req, res, next) {
    res.set("Server", "battlesnake/github/starter-snake-javascript");
    next();
  })


  const port = process.env.PORT || 8000;

  app.listen(port,() => {
    console.log(`running on ${port}`);
  });
}
