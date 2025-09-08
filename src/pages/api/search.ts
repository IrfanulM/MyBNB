import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

interface SearchQuery {
  $or?: { [key: string]: RegExp }[];
  property_type?: string;
  bedrooms?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { location, property_type, bedrooms } = req.body;

    const query: SearchQuery = {};

    if (location && typeof location === 'string' && location.trim() !== '') {
      const locationRegex = new RegExp(location.trim(), 'i');

      query.$or = [
        { 'address.street': locationRegex },
        { 'address.suburb': locationRegex },
        { 'address.government_area': locationRegex },
        { 'address.market': locationRegex },
        { 'address.country': locationRegex }
      ];
    }

    if (property_type) {
      query.property_type = property_type;
    }
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms, 10);
    }

    const projection = {
      name: 1,
      summary: 1,
      'images.picture_url': 1,
      price: 1,
      'review_scores.review_scores_rating': 1,
      bedrooms: 1,
      property_type: 1,
      'address.market': 1
    };

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const filteredListings = await db.collection('listingsAndReviews')
      .find(query)
      .project(projection)
      .toArray();

    res.status(200).json(filteredListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}