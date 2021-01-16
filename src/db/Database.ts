import { MongoClient, Db } from 'mongodb';

class Database {
  private name = 'health-beat';
  private client: MongoClient;

  constructor() {
    const connectionString = process.env.MONGO_CONNECTION_STRING as string;
    this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch(err) {
      console.log('Failed when connection to the database');
      console.error(err);
    }
  }

  public getDb(): Db {
    return this.client.db(this.name);
  }
}


export default new Database();