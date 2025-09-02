import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { listingsApi, Listing } from '../../services/api';

export default function BookingsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");

  useEffect(() => {
    // current listing's details to display
		const fetchListingDetails = async () => {
			setLoading(true);
			try {
				const fetchedListing: Listing = await listingsApi.getListingByID(id as string);
				setListing(fetchedListing);
				setError("");
			} catch {
				setError("Failed to load listing details. Please try again.");
				setListing(null);
			} finally {
				setLoading(false);
			}
		};
		fetchListingDetails();
  }, [id]);

  if (loading) {
    return <p className="error">Loading listing details...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!listing) {
    return <p className="error">Listing not found.</p>;
  }

  // function to handle the submit button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const booking = await listingsApi.createBooking({
        listingId: id as string,
        checkIn,
        checkOut,
        name,
        email,
        mobile,
        postalAddress,
        residentialAddress,
      });
      router.push({
        pathname: `/confirmations/${booking.bookingId}`,
        query: { ...booking },
      });
    } catch {
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <button onClick={() => router.back()} className="back-button">Back to Listings</button>
      <h1>Book {listing.name}</h1>
      <div className="summary">{listing.summary}</div>
      <div className="rate">${listing.price.$numberDecimal} per day</div>
      <form onSubmit={handleSubmit}>
        <h2>Booking Details</h2>
        <div>
          <label htmlFor="check-in">Check In*:</label>
          <input
            type="date"
            id="check-in"
            name="checkIn"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="check-out">Check Out*:</label>
          <input
            type="date"
            id="check-out"
            name="checkOut"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            disabled={loading}
          />
        </div>
        <h2>Your Details</h2>
        <div>
          <label htmlFor="name">Your Name*:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email Address*:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="mobile">Mobile Number*:</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="04xxxxxxxx"
            maxLength={10}
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="postal-address">Postal Address:</label>
          <input
            type="text"
            id="postal-address"
            name="postalAddress"
            placeholder="Enter your postal address (optional)"
            value={postalAddress}
            onChange={(e) => setPostalAddress(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="residential-address">Residential Address:</label>
          <input
            type="text"
            id="residential-address"
            name="residentialAddress"
            placeholder="Enter your home address (optional)"
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>Book Now</button>
      </form>
    </div>
  );
}