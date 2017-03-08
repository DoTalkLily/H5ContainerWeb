/**
 * Created by Seven on 17/3/8.
 * multer file uploader middleware
 */
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
const  uploader = multer({ storage: storage }).single('file');

export default uploader;

