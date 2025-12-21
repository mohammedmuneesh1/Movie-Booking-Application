import mongoose, { Document } from "mongoose";



interface IShow extends Document{
    movieRef:mongoose.Schema.Types.ObjectId,
    movieId:string,
    showDateTime:Date,
    showPrice:number,
    occupiedSeats:Object
};


const showSchema = new mongoose.Schema({
    movieRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required:true
    },
    movieId:{
        type:String,
    },
    showDateTime:{
        type:Date,
        required:true
    },
    showPrice:{
        type:Number,
        required:true
    },
    occupiedSeats:{
        type:Object,
        default:{}
    },
    
},{
    minimize:false, //If an object is empty {}, Mongoose removes it before saving.
    timestamps:true
});

const ShowModel = mongoose.models.show || mongoose.model<IShow>("Show",showSchema);
export default ShowModel;





