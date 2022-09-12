import mongoose, { Connection } from 'mongoose';


async function connect(): Promise<Connection | Error> {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dynamic_port')

        resolve(mongoose.connection);
    });
}


export default connect;
