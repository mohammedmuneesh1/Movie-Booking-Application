import mongoose from "mongoose";
declare const MediaModel: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<{
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        name: string;
        path: string;
        isPrivate: boolean;
        storageType: "local" | "s3" | "cloudinary";
        mimeType: string;
        mediaType?: "userProfile" | null;
        cloudinaryKey?: string | null;
        s3Key?: string | null;
        duration?: number | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        path: string;
        isPrivate: boolean;
        storageType: "local" | "s3" | "cloudinary";
        mimeType: string;
        mediaType?: "userProfile" | null;
        cloudinaryKey?: string | null;
        s3Key?: string | null;
        duration?: number | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    path: string;
    isPrivate: boolean;
    storageType: "local" | "s3" | "cloudinary";
    mimeType: string;
    mediaType?: "userProfile" | null;
    cloudinaryKey?: string | null;
    s3Key?: string | null;
    duration?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default MediaModel;
//# sourceMappingURL=media.schema.d.ts.map