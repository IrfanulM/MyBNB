import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BookingConfirmation() {
  const router = useRouter();
  const booking = router.query;

  if (!booking) return <p className="loading-message">Loading...</p>;

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
            <Link href="/" passHref>
                <button className="back-button">Back to Homepage</button>
            </Link>
        <h1 className="confirmation-title">Booking Confirmed</h1>
        <p className="confirmation-subtitle">Thanks {booking.name}, your reservation is locked in.</p>
        
        <div className="confirmation-section">
          <h2 className="section-title">Guest Info</h2>
          <p><span className="field-label">Name:</span> {booking.name}</p>
          <p><span className="field-label">Email:</span> {booking.email}</p>
          <p><span className="field-label">Mobile:</span> {booking.mobile}</p>
        </div>

        <div className="confirmation-section">
          <h2 className="section-title">Booking Details</h2>
          <p><span className="field-label">Booking ID:</span> {booking.bookingId}</p>
          <p><span className="field-label">Check-in:</span> {booking.checkIn}</p>
          <p><span className="field-label">Check-out:</span> {booking.checkOut}</p>
        </div>
      </div>
    </div>
  );
}