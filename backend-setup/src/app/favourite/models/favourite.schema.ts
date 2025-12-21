import mongoose, { Document } from "mongoose";

interface IFavorite extends Document {
  user: mongoose.Schema.Types.ObjectId;
  movieRef: mongoose.Schema.Types.ObjectId;
  movieId: string;
}

const favoriteSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// 🔒 Prevent duplicates
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

const FavoriteModel =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", favoriteSchema);

export default FavoriteModel;
