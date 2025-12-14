import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format",
        },
    },
    image: {
        type: mongoose.Schema.ObjectId,
        ref: "media",
    }
}, {
    timestamps: true,
});
const UserModel = mongoose.models.user || mongoose.model("User", userSchema);
export default UserModel;
//# sourceMappingURL=user.schema.js.map