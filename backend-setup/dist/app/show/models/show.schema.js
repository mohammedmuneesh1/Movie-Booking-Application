import mongoose, { Document } from "mongoose";
;
const showSchema = new mongoose.Schema({
    movieRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    movieId: {
        type: String,
    },
    showDateTime: {
        type: Date,
        required: true
    },
    showPrice: {
        type: Number,
        required: true
    },
    occupiedSeats: {
        type: Object,
        default: {}
    },
}, {
    minimize: false, //If an object is empty {}, Mongoose removes it before saving.
    timestamps: true
});
const ShowModel = mongoose.models.show || mongoose.model("Show", showSchema);
export default ShowModel;
//# sourceMappingURL=show.schema.js.map