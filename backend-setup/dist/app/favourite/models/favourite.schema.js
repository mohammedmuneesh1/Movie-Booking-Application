import mongoose, { Document } from "mongoose";
const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    movieRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    movieId: {
        type: String,
        required: true,
    },
}, { timestamps: true });
// 🔒 Prevent duplicates
favoriteSchema.index({ user: 1, movieRef: 1 }, { unique: true });
const FavoriteModel = mongoose.models.Favorite ||
    mongoose.model("Favorite", favoriteSchema);
export default FavoriteModel;
//# sourceMappingURL=favourite.schema.js.map