import type { UploadApiResponse } from "cloudinary";
declare const cloudinaryOptions: {
    uploadItem: (buffer: Buffer, folderName?: string) => Promise<UploadApiResponse | undefined>;
    deleteItem: (public_id: string) => Promise<unknown>;
};
export default cloudinaryOptions;
//# sourceMappingURL=cloudinaryManagement.d.ts.map