const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination:(req, file, callback) =>{
        callback(null, 'images')//nom du dossier en deuxieme argument(le premier indique qu'il n'y a pas d'erreur)
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);

    }
});

module.exports = multer({ storage }).single('image');