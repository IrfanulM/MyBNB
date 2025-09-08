import { useState, useEffect } from 'react';
import { listingsApi, UserBooking, UserDetails } from '../services/api';
import Link from 'next/link';

export default function Profile() {
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [userBookings, details] = await Promise.all([
                    listingsApi.getUserBookings(),
                    listingsApi.getUserDetails(),
                ]);
                setBookings(userBookings);
                setUserDetails(details);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <p className="loading-message">Loading your profile...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-details-card">
                    <h2>Profile Information</h2>
                    {userDetails && (
                        <>
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>Member Since:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
                        </>
                    )}
                </div>

                <div className="bookings-card">
                    <h2>Your Bookings</h2>
                    {bookings.length > 0 ? (
                        <div className="bookings-grid">
                            {bookings.map((booking) => (
                                <div key={booking.bookingId} className="booking-item-card">
                                    <h3>{booking.listingName}</h3>
                                    <div className="booking-dates">
                                        <p><strong>Check-in:</strong> {booking.checkIn}</p>
                                        <p><strong>Check-out:</strong> {booking.checkOut}</p>
                                    </div>
                                    <Link href={{
                                        pathname: `/confirmations/${booking.bookingId}`,
                                        query: { ...booking }
                                    }} passHref>
                                        <button className="confirmation-button">View Confirmation</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">You have no bookings yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}