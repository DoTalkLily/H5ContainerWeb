/**
 * Created by Seven on 17/3/8.
 * multer file uploader middleware
 */
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const compress = crypto.createHash('md5');

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, compress.update(file.originalname).digest('hex') + path.extname(file.originalname));
    }
});
const  uploader = multer({ storage: storage }).single('file');

export default uploader;

