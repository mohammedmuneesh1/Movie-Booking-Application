import cloudinary from "../config/cloudinaryConfig.js";
const cloudinaryOptions = {
    uploadItem: (buffer, folderName = "demo") => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: `${process.env.CLOUDINARY_PARENT_FOLDER}/${folderName}` }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(buffer);
        });
    },
    deleteItem: (public_id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }
};
export default cloudinaryOptions;
// const results = await Promise.all(
//   req.files.map((file: any) =>
//     cloudinaryOptions.uploadItem(file.buffer, "yourFolder")
//   )
// );
//# sourceMappingURL=cloudinaryManagement.js.map