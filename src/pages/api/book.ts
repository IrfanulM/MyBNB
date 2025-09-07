import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { listingId, checkIn, checkOut, timezoneOffset, ...bookingDetails } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const now = new Date();
    const userToday = new Date(now.getTime() - (timezoneOffset * 60000));
    const todayString = userToday.toISOString().split('T')[0];

    if (checkIn < todayString) {
        return res.status(400).json({ message: 'Cannot book a past date.' });
    }
    
    if (new Date(checkIn) >= new Date(checkOut)) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    const listing = await db.collection('listingsAndReviews').findOne({ _id: listingId });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const existingBooking = await db.collection('listingsAndReviews').findOne({
        _id: listingId,
        'bookings.checkIn': { $lt: checkOut },
        'bookings.checkOut': { $gt: checkIn },
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Sorry, these dates have already been booked.' });
    }

    const newBooking = {
      bookingId: new ObjectId(),
      checkIn,
      checkOut,
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