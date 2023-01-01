class Express {
  middlewares = [];
  value;

  constructor() {
    this.req = {};
    this.res = {
      send: (value) => {
        if (this.value)
          throw new Error(
            "Cannot set headers after they are sent to the client"
          );
        this.value = value;
        return value;
      },
    };
    this.get = this.get.bind(this);
    this.runMiddlewares = this.runMiddlewares.bind(this);
    this.next = this.next.bind(this);
  }

  next(err) {
    if (err) throw new Error(err);
    if (this.value)
      throw new Error("Cannot set headers after they are sent to the client");
    this.runMiddlewares();
  }

  runMiddlewares() {
    const handler = this.middlewares.shift();
    if (handler) handler(this.req, this.res, this.next);
    process.on("exit", () => {
      while (!this.value) {}
    });
  }

  get(...handlers) {
    for (let handler of handlers) {
      this.middlewares.push(handler);
    }

    this.runMiddlewares();
  }

  post(...handlers) {}

  put(...handlers) {}

  patch(...handlers) {}

  delete(...handlers) {}
}

const app = new Express();

app.get(
  (req, res, next) => {
    req.value = 0;
    next();
    res.send("hello world");
  },
  (req, res, next) => {
    req.value++;
  }
);
