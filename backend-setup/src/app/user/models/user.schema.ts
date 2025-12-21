import mongoose from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
    image?: mongoose.Types.ObjectId | string; 
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
        },
    },
  image: {
    type: mongoose.Schema.Types.Mixed,  // Accepts any type
    ref: "Media",  // Capital M for consistency
  },
},{
    timestamps:true,
});

const UserModel = mongoose.models.user || mongoose.model<IUser>("User",userSchema);
export default UserModel; 