const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");
const ProductManager = require("./productManager");
const path = require("path");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const port = 3000;

const productManager = new ProductManager("data/products.json");

app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", {
    products: productManager.getProducts(),
  });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    products: productManager.getProducts(),
  });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");

  socket.on("addProduct", (productData) => {
    productManager.addProduct(
      productData.title,
      productData.description,
      productData.price,
      productData.thumbnail,
      productData.code,
      productData.stock
    );
    io.sockets.emit("products", productManager.getProducts());
  });

  socket.on("deleteProduct", (productId) => {
    productManager.deleteProduct(productId);
    io.sockets.emit("products", productManager.getProducts());
  });
});

httpServer.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
