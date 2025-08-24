
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../../middleware/auth');
// const tesseract = require('tesseract.js'); // Placeholder for OCR library

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // 'image' is the field name in the form

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only (jpeg, jpg, png, pdf)!');
    }
}

// @route   POST api/upload
// @desc    Upload image for warranty or bill
// @access  Private
router.post('/', auth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ msg: 'No file selected!' });
            } else {
                // File uploaded successfully
                // Here you would typically save the file path to the corresponding warranty or bill
                // And integrate OCR processing
                // Example OCR placeholder:
                /*
                const { data: { text } } = await tesseract.recognize(
                    req.file.path,
                    'eng',
                    { logger: m => console.log(m) }
                );
                console.log(text);
                // Logic to parse 'text' and extract relevant data for auto-filling
                */
                res.json({
                    msg: 'File uploaded',
                    filePath: `/uploads/${req.file.filename}`,
                    // extractedData: {}
                });
            }
        }
    });
});

module.exports = router;
