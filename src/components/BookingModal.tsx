import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { listingsApi, Listing } from '../services/api';
import Calendar from './Calendar';

interface BookingModalProps {
  listing: Listing;
  onClose: () => void;
  isAuthenticated: boolean;
  email?: string;
}

export default function BookingModal({ listing, onClose, isAuthenticated, email: userEmail }: BookingModalProps) {
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
  
  const [showCalendar, setShowCalendar] = useState<string | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  today.setHours(0,0,0,0);

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      setEmail(userEmail);
    }
  }, [isAuthenticated, userEmail]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowCalendar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!checkIn || !checkOut) {
        setError("Please select both check-in and check-out dates.");
        setLoading(false);
        return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after the check-in date.");
      setLoading(false);
      return;
    }

    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      const booking = await listingsApi.createBooking({
        listingId: listing._id,
        checkIn,
        checkOut,
        name,
        email,
        mobile,
        postalAddress,
        residentialAddress,
        timezoneOffset,
      });
      router.push({
        pathname: `/confirmations/${booking.bookingId}`,
        query: { ...booking },
      });
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message || "Booking failed. Please try again.");
        } else {
            setError("An unknown error occurred. Please try again.");
        }
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
          <div ref={datePickerRef}>
            <div className={`date-picker-container ${showCalendar === 'checkIn' ? 'calendar-active' : ''}`}>
              <label htmlFor="check-in">Check In*:</label>
              <div className="date-picker-wrapper">
                <div 
                  className={`date-input-trigger ${showCalendar === 'checkIn' ? 'active' : ''}`}
                  onClick={() => setShowCalendar(showCalendar === 'checkIn' ? null : 'checkIn')}
                >
                  {checkIn || 'Select a date'}
                </div>
                {showCalendar === 'checkIn' && 
                  <Calendar 
                    onSelectDate={(date) => { setCheckIn(date); setShowCalendar(null); }} 
                    initialDate={new Date()}
                    minDate={today}
                  />}
              </div>
            </div>
            <div className={`date-picker-container ${showCalendar === 'checkOut' ? 'calendar-active' : ''}`}>
              <label htmlFor="check-out">Check Out*:</label>
               <div className="date-picker-wrapper">
                <div 
                  className={`date-input-trigger ${showCalendar === 'checkOut' ? 'active' : ''}`}
                  onClick={() => checkIn && setShowCalendar(showCalendar === 'checkOut' ? null : 'checkOut')}
                >
                  {checkOut || 'Select a date'}
                </div>
                {showCalendar === 'checkOut' && 
                  <Calendar 
                    onSelectDate={(date) => { setCheckOut(date); setShowCalendar(null); }} 
                    initialDate={checkIn ? new Date(checkIn) : new Date()}
                    minDate={checkIn ? new Date(new Date(checkIn).getTime() + 86400000) : today}
                  />}
              </div>
            </div>
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
              disabled={loading || (isAuthenticated && !!userEmail)}
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
              minLength={10}
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
          {!isAuthenticated && (
            <p className="disclaimer-text">
              Want to see your bookings on our site? <Link href="/signup">Sign up</Link> first.
            </p>
          )}
          {error && <p className="error-message" style={{textAlign: 'center', color: '#ff6b6b'}}>{error}</p>}
          <button type="submit" disabled={loading}>Book Now</button>
        </form>
      </div>
    </div>
  );
}