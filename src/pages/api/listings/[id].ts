import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

interface ListingDocument {
  _id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const listingsCollection = db.collection<ListingDocument>('listingsAndReviews');
    const data = await listingsCollection.findOne({ _id: id as string });
    
    if (!data) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}