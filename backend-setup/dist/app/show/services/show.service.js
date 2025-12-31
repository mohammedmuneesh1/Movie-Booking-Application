import MovieModel, {} from "../models/movie.schema.js";
import ShowModel from "../models/show.schema.js";
const PRIORITY = ["Trailer", "Teaser", "Clip", "Featurette"];
export function getBestPlayableVideo(videos) {
    if (!videos?.length)
        return null;
    const ytOfficial = videos.filter(v => v.site === "YouTube" && v.official === true);
    if (!ytOfficial.length)
        return null;
    for (const type of PRIORITY) {
        const candidates = ytOfficial
            .filter(v => v.type === type);
        if (!candidates.length)
            continue;
        // Prefer exact naming for trailers/teasers
        const exact = candidates.find(v => v.name.toLowerCase().includes(`official ${type.toLowerCase()}`));
        const selected = exact
            ? exact
            : candidates.sort((a, b) => new Date(a.published_at).getTime() -
                new Date(b.published_at).getTime())[0];
        return selected;
    }
    return null;
}
export async function GET_ALL_SHOWS_SERVICE() {
    const activeShow = await ShowModel.find({
        showDateTime: { $gte: new Date() }
    }).populate('movieRef').sort({ showDateTime: 1 });
    return activeShow;
}
export async function IS_MOVIE_EXIST_WITH_MOVIE_ID_SERVICE(movieId) {
    const isMovieExist = await ShowModel.findOne({ movieId });
    return isMovieExist;
}
export async function IS_MOVIE_EIXST_SERVICE(movieId) {
    const isMovieExist = await MovieModel.findOne({ _id: movieId });
    return isMovieExist;
}
export async function IS_MOVIE_EXIST_ON_FAVOURITE_SERVICE(movieId, userId) {
    const isMovieExist = await ShowModel.findOne({ movieId, user: userId });
    return isMovieExist;
}
//# sourceMappingURL=show.service.js.map