const multer = require('multer');
const fs = require('fs');
const { join } = require('path');
const { error } = require('console');

const uploader = (directory, filePrefix) => {
    // Default directory storage
    // let defaultDir = '.src/public';
    let defaultDir = join(__dirname, '../public');

    // Multer configuration
    // 1. config storage location
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const storeDir = directory ? defaultDir + directory : defaultDir;

            if(fs.existsSync(storeDir)){
                console.log(`Directory ${storeDir} exist ✅`);
                cb(null, storeDir);
            } else {
                fs.mkdir(storeDir, {recursive: true}, (error) => {
                    if(error){
                        console.log('Error create directory :', error);
                    }
                    cb(error, storeDir);
                });
            }
        },
        filename: (req, file, cb) => {
            console.log('File original name :',file.originalname);
            let ext = file.originalname.split('.')[file.originalname.split('.').length - 1];
            console.log('Check extension :', ext);

            let newName = filePrefix + Date.now() + '.' + ext;
            console.log('New name :', newName);
            cb(null, newName);
        }
    });

    // 2. config file filter
    const fileFilter = (req, file, cb) => {
        const extFilter = /\.(jpg|jpeg|png|webp)/;
        let checkExt = file.originalname.toLowerCase().match(extFilter);

        if(checkExt) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png, and webp format allowed!'), false);
        }
    };

    // 3. config file size
    const limits = {
        fileSize: 2000 * 1024 // 1 MB
    };

    // 4. return multer
    return multer({ storage, fileFilter, limits });
}

module.exports = uploader;