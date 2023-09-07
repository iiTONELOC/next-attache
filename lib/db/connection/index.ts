import mongoose, { Connection } from 'mongoose';

const CONN_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dynamic_port';

// used for testing
export async function connect(): Promise<Connection | Error> {
    return new Promise((resolve, reject) => {
        mongoose.connect(CONN_URL);

        resolve(mongoose.connection);
    });
}


export function dbConnection(): Connection { // NOSONAR
    mongoose.connect(CONN_URL);

    return mongoose.connection;
}

export default connect;
