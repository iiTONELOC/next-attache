import mongoose, { Connection } from 'mongoose';

export async function connect(): Promise<Connection | Error> {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dynamic_port');

        resolve(mongoose.connection);
    });
}

export function dbConnection(): Connection { // NOSONAR
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dynamic_port');

    return mongoose.connection;
}
export default connect;
