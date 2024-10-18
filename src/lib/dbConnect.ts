import { log } from "console";
import mongoose from "mongoose";
const connectionURL = process.env.MONGODB_URI || "";
type connectionObj = {
    isconnected?: number;
};

const connection: connectionObj = {};

async function dbConnect(): Promise<void> {
    if(connection.isconnected){
        log("Already connected");
        return;
    }

    try{
        const db = await mongoose.connect(connectionURL, {});
        connection.isconnected = db.connections[0].readyState;
        console.log('db connected');
    } catch(err){
        console.log('database connection error', err);
        //process.exit(1);
    }
}

export default dbConnect;