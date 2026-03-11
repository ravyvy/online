const express = require('express');
const app = express();
const port = 5000;
app.use(express.json());
const cors = require('cors');

app.use(cors());
const products = require("./src/router/productRoute");
products(app);

app.use('/image', express.static('src/uploads/image'));

app.get('/', (req, res) => {
    res.send('Backend is running with nodemon!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
