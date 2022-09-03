const express = require("express");
const app = express();
const cors = require('cors')
const jwt = require("jsonwebtoken")
app.use(cors());
app.use(express.json())

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
//
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
//     explorer: true
// }));

const secretKey = "this_is_my_secret_key";

let products = [
    {
        id: 1,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/1_4bcec83d-4777-4b88-8300-03ce35dd76ec_360x.jpg?v=1637809252",
        title: "asaHappy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 300.0,
        discount: 26,
        sold: 50,
        stock: 50,
        hot: false,
        category: "accessories",
        color: "red",
        brand: "Nike",
        size: 20,
    },
    {
        id: 2,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/2_975bcf60-ca81-4a6c-b472-97010b523f07_360x.jpg?v=1637809374",
        title: "sddHappy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 290.0,
        discount: 0,
        sold: 21,
        stock: 79,
        hot: false,
        category: "decor",
        color: "orange",
        brand: "Nike",
        size: 30,
    },
    {
        id: 3,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/3_ccdd8852-0531-48a0-a995-8ce4ed043578_360x.jpg?v=1637809518",
        title: "bfHappy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 69.0,
        discount: 0,
        sold: 74,
        stock: 26,
        hot: false,
        category: "decor&lighting",
        color: "yellow",
        brand: "Puma",
        size: 42,
    },
    {
        id: 4,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/4_488377ea-3810-4f6b-8309-798b43ff0371_360x.jpg?v=1637810805",
        title: "yHappy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 1,
        },
        price: 369.0,
        discount: 0,
        sold: 74,
        stock: 26,
        hot: true,
        category: "dining&kitchen",
        color: "green",
        brand: "Puma",
        size: 41,
    },
    {
        id: 5,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/5_6c459978-ac60-4437-b4d7-ccd558643e43_360x.jpg?v=1637811736",
        title: "Happy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 290.0,
        discount: 26,
        sold: 57,
        stock: 43,
        hot: true,
        category: "office-furniture",
        color: "blue",
        brand: "Adidas",
        size: 43,
    },
    {
        id: 6,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/6_0b284d86-fc9a-4284-a012-466c68ffaf66_360x.jpg?v=1637811827",
        title: "Happy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 69.0,
        discount: 31,
        sold: 85,
        stock: 15,
        hot: true,
        category: "outdoor&gift",
        color: "indigo",
        brand: "Ever Green",
        size: 50,
    },
    {
        id: 7,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/7_8d2f1e01-b37f-4d17-bc6e-ae5e03847144_360x.jpg?v=1637811826",
        title: "Happy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 45.0,
        discount: 10,
        sold: 18,
        stock: 82,
        hot: true,
        category: "sectional-sofas",
        color: "violet",
        brand: "Nike",
        size: 30,
    },
    {
        id: 8,
        img: "https://cdn.shopify.com/s/files/1/0593/9488/3760/products/7_8d2f1e01-b37f-4d17-bc6e-ae5e03847144_360x.jpg?v=1637811826",
        title: "Happy Baby Organics Teether, 3  Flavor Variety Pack",
        review: {
            stars: 5,
            amount: 0,
        },
        price: 45.0,
        discount: 10,
        sold: 18,
        stock: 82,
        hot: true,
        category: "tables&chair",
        color: "yellow",
        brand: "Nike",
        size: 40,
    },
]

let users = [
    {
        username: "admin",
        password: "admin",
        role: "admin",
    }
]

const allowAdmin = (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
        try {
            const payload = jwt.verify(token.slice(7), secretKey);
            const user = users.find(({username}) => username === payload.username)
            if (user) {
                if (user.role === "admin") {
                    req.user = user;
                    next();
                } else {
                    res.status(401).json("Not allowed")
                }
            } else {
                res.status(404).json("User Not found");
            }
        } catch (e) {
            console.log(e)
            res.status(400).json("Token is invalid")
        }
    } else {
        res.status(403).json("Token is not provided")
    }


}

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/v1/login", (req, res) => {
    const {username, password} = req.query;
    const user = users.find(({username: u, password: p}) => {
        return u === username && p === password;
    })

    if (user) {
        const token = jwt.sign({username}, secretKey)
        res.send({
            ok: true,
            token
        })
    } else {
        res.send({
            ok: false,
            msg: "username or password error"
        })
    }
})

app.get("/api/v1/products", (req, res) => {
    res.send(products);
});

app.get("/api/v1/product/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(({id: pId}) => id === pId)
    res.send(product);
});

app.post("/api/v1/product", allowAdmin, (req, res) => {
    const product = req.body;
    console.log(req);
    const max = Math.max(...products.map(({id}) => id));
    // product.id = max + 1;
    products.push({...product, id: (max + 1)});
    res.send(product);
});

app.put("/api/v1/product/:id", allowAdmin, (req, res) => {
    const id = req.params.id;
    const product = req.body;
    product.id = id;
    const isExist = products.find(({id: pId}) => id === pId);
    if (isExist) {
        products = products.map((p) => {
            if (p.id === id) {
                return product
            }
            return p
        })
        res.send(product);
    } else {
        res.status(404).json("Product is not found");
    }
});

app.delete("/api/v1/product/:id", allowAdmin, (req, res) => {
    const id = req.params.id;
    const isExist = products.find(({id: pId}) => Number(id) === pId);
    if (isExist) {
        products = products.filter(({id: pId}) => Number(id) !== pId);
        res.send("Deleted");
    } else {
        res.status(404).json("Product is not found");
    }
});


app.listen(3434);
