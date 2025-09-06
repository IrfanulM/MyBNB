import { useState } from 'react';
import { useRouter } from 'next/router';
import { listingsApi, Listing } from '../services/api';

interface BookingModalProps {
  listing: Listing;
  onClose: () => void;
}

export default function BookingModal({ listing, onClose }: BookingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const booking = await listingsApi.createBooking({
        listingId: listing._id,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">Close</button>
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
          {error && <p className="error-message" style={{textAlign: 'center', color: '#ff6b6b'}}>{error}</p>}
          <button type="submit" disabled={loading}>Book Now</button>
        </form>
      </div>
    </div>
  );
}