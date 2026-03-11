const productController = require("../controller/productController");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/image');
    },
    filename: (req, file, cb) => {
        // ប្តូរឈ្មោះ file កុំឱ្យជាន់គ្នា (ឧទាហរណ៍៖ 1710123456789.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const products = (app) => {
    app.get("/api/getall", productController.getall);
    app.post("/api/create", upload.single('image'), productController.create);
    app.delete("/api/delete/:id", productController.deleteproduct);
    app.put("/api/update/:id", upload.single('image'), productController.updateproduct);
    // ក្នុង function products(app) របស់អ្នក
    app.post("/api/login", productController.login);
}

module.exports = products;