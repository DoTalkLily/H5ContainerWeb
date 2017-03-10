/**
 * Created by Seven on 17/3/8.
 * multer file uploader middleware
 */
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import md5 from 'blueimp-md5';

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.createHash('md5').update(file.originalname).digest('hex');
        console.log(crypto.createHash('md5').update(file.originalname).digest('hex'));
        // // cb(null,md5(raw) + path.extname(file.originalname));
        // crypto.pseudoRandomBytes(16, function (err, raw) {
        //     if (err) return cb(err);
        //     // cb(null, raw.toString('hex') + path.extname(file.originalname))
        //     cb(null, md5(raw) + path.extname(file.originalname))
        // })
    }
});
const  uploader = multer({ storage: storage }).single('file');

export default uploader;

