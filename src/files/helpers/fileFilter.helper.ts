export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function,
) => {
  
    if (!file) return callback(new Error('File iis empty'), false);
  
    const fileExtension = file.mimetype.split('/')[1]
    const validExtensions = ['jpg', 'jpeg', 'png', 'jfif']

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true)
    }
  
    callback(null, false);
};
