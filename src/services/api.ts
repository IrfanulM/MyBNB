export interface Listing {
  _id: string;
  name: string;
  summary: string;
  price: { $numberDecimal: string };
  review_scores: { review_scores_rating?: number; };
  images: { picture_url?: string; };
  property_type: string;
  bedrooms: string;
  address: { market: string; };
}

export interface Booking {
  bookingId?: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  name: string;
  email: string;
  mobile: string;
  postalAddress?: string;
  residentialAddress?: string;
}

export const listingsApi = {
  getInitialListings: async (): Promise<Listing[]> => {
    const response = await fetch('/api/initial');
    return await response.json();
  },
  getAllPropertyTypes: async (): Promise<[]> => {
    const response = await fetch('/api/property-types');
    return await response.json();
  },
  getBedrooms: async (): Promise<[]> => {
    const response = await fetch('/api/bedrooms');
    return await response.json();
  },
  getSearchResults: async (filterParams: { location: string; propertyType?: string; bedrooms?: string; }): Promise<Listing[]> => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterParams),
    });
    return await response.json();
  },
  getListingByID: async ( _id: string ): Promise<Listing> => {
    const response = await fetch(`/api/listings/${_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },
  createBooking: async (bookingData: Booking): Promise<Booking> => {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }
    return data;
  },
  signup: async (credentials: any): Promise<any> => {
      const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.message || 'Something went wrong!');
      }
      return data;
  },
  signin: async (credentials: any): Promise<any> => {
    const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }
    return data;
  },
  getUserBookings: async (): Promise<Listing[]> => {
      const response = await fetch('/api/user/bookings');
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.message || 'Something went wrong!');
      }
      return data;
  },
  signout: async (): Promise<any> => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }
    return data;
  },
}