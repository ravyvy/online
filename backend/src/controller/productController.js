const db = require("../database/db");
const bcrypt = require('bcrypt');
const getall = (req, res) => {
    const SQL = "SELECT * FROM products";
    db.query(SQL, (err, data) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
        res.json({
            status: true,
            data: data
        });
    });
};
const create = (req, res) => {
    const { name, category, price, description, sizes } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !category || !price) {
        return res.status(400).json({
            status: false,
            message: "Missing required fields: name, category, or price"
        });
    }

    const SQL = "INSERT INTO products (name, category, price, image, description, sizes) VALUES (?, ?, ?, ?, ?, ?)";

    const param = [
        name,
        category,
        price,
        image,
        description || "",
        typeof sizes === 'string' ? sizes : JSON.stringify(sizes || [])
    ];

    db.query(SQL, param, (err, data) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
                status: false,
                message: "Failed to create product"
            });
        }
        res.json({
            status: true,
            message: "បង្កើតផលិតផល និង Upload រូបភាពជោគជ័យ!",
            image_url: image
        });
    });
};
const fs = require('fs');
const path = require('path');

const deleteproduct = (req, res) => {
    const { id } = req.params; // ទាញយក ID ពី URL

    // ១. ទាញយកឈ្មោះរូបភាពសិន ដើម្បីយកទៅលុបក្នុង Folder
    const findSql = "SELECT image FROM products WHERE id = ?";
    db.query(findSql, [id], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ status: false, message: "Error finding product" });
        }

        if (result.length > 0) {
            const imageName = result[0].image;

            // ២. លុបទិន្នន័យក្នុង Database
            const deleteSql = "DELETE FROM products WHERE id = ?";
            db.query(deleteSql, [id], (err, data) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ status: false, message: "Error deleting product" });
                }

                // ៣. បើលុបក្នុង DB ជោគជ័យ យើងលុប File រូបភាពក្នុង Folder តាមក្រោយ
                if (imageName) {
                    const filePath = path.join(__dirname, '../uploads/image', imageName);
                    // ឆែកមើលថាបើមាន File ហ្នឹងពិតមែន ទើបលុប
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }

                res.json({
                    status: true,
                    message: "លុបផលិតផលបានជោគជ័យ!"
                });
            });
        } else {
            res.status(404).json({ status: false, message: "រកមិនឃើញផលិតផលនេះឡើយ" });
        }
    });
};
const updateproduct = (req, res) => {
    const { id } = req.params;
    const { name, category, price, description, sizes } = req.body;

    // ១. ទាញយកឈ្មោះរូបភាពចាស់ពី DB ដើម្បីពិនិត្យ
    const findOldImage = "SELECT image FROM products WHERE id = ?";
    db.query(findOldImage, [id], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ status: false, message: "Error updating product" });
        }

        const oldImage = result[0]?.image;
        
        // ២. កំណត់រូបភាពដែលត្រូវរក្សាទុក
        let image = oldImage; // ជា default គឺយករូបចាស់
        if (req.file) {
            image = req.file.filename; // បើមាន file ថ្មី យើងយកឈ្មោះថ្មី
        } else if (req.body.image) {
            image = req.body.image; // បើមានឈ្មោះរូបភាពផ្ញើមកពី Frontend
        }

        // ៣. SQL សម្រាប់ Update
        const SQL = `UPDATE products SET 
            name = ?, 
            category = ?, 
            price = ?, 
            image = ?, 
            description = ?, 
            sizes = ? 
            WHERE id = ?`;

        const params = [
            name,
            category,
            price,
            image,
            description,
            typeof sizes === 'string' ? sizes : JSON.stringify(sizes),
            id
        ];

        db.query(SQL, params, (err, data) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ status: false, message: "Error updating product" });
            }

            // ៤. បើ Update ជោគជ័យ ហើយមានរូបភាពថ្មី យើងត្រូវលុបរូបចាស់ចេញពី Folder
            if (req.file && oldImage && oldImage !== image) {
                const oldPath = path.join(__dirname, '../uploads/image', oldImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            res.json({
                status: true,
                message: "កែប្រែផលិតផលបានជោគជ័យ!"
            });
        });
    });
};
const login = (req, res) => {
    const { username, password } = req.body;
    const SQL = "SELECT * FROM admins WHERE username = ?";

    db.query(SQL, [username], async (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ status: false, message: "Login Error" });
        }

        if (result.length > 0) {
            // ផ្ទៀងផ្ទាត់ Password ដែល Hash រួច
            const match = await bcrypt.compare(password, result[0].password);

            if (match) {
                res.json({
                    status: true,
                    message: "Login ជោគជ័យ!",
                    data: { id: result[0].id, username: result[0].username }
                });
            } else {
                res.status(401).json({ status: false, message: "Password មិនត្រឹមត្រូវ" });
            }
        } else {
            res.status(404).json({ status: false, message: "រកមិនឃើញ Admin នេះទេ" });
        }
    });
};
module.exports = {
    getall,
    create,
    deleteproduct,
    updateproduct,
    login
}