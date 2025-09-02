import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { listingId, ...bookingDetails } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const listing = await db.collection('listingsAndReviews').findOne({ _id: listingId });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const newBooking = {
      bookingId: new ObjectId(),
      ...bookingDetails,
    };

    await db.collection('listingsAndReviews').updateOne(
      { _id: listingId },
      { $push: { bookings: newBooking } }
    );

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}