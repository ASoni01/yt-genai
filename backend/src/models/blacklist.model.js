import mongoose from 'mongoose';


 const blackListTokenSchema= new mongoose.Schema({
    token:{
        type: String,
        required: [ true, "Token is required"]
    }
},{timestamps: true});

export const tokenBlackiListModel= mongoose.model('blacklistTokens', blackListTokenSchema)