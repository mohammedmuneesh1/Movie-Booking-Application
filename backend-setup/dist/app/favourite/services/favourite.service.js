import FavoriteModel from "../models/favourite.schema.js";
export async function TOP_10_FAVOURITE_MOVIES_SERVICE() {
    const userTop10FavouriteMovies = await FavoriteModel.aggregate([
        {
            $group: {
                _id: "$movieRef", //_id = movieRef
                totalFavorites: { $sum: 1 },
            },
        },
        {
            $sort: { totalFavorites: -1 },
        },
        {
            $limit: 10,
        },
        {
            $lookup: {
                from: "movies", // Mongo collection name (plural!)
                localField: "_id", // movieRef after grouping
                foreignField: "_id", // Movie _id
                as: "movie",
            },
        },
        {
            $unwind: "$movie",
        },
        {
            $project: {
                _id: 0,
                movie: 1,
                totalFavorites: 1,
            },
        },
    ]);
    return userTop10FavouriteMovies;
}
//# sourceMappingURL=favourite.service.js.map