import { useState, useEffect } from 'react';
import { listingsApi, Listing } from '../services/api';

export default function Profile() {
    const [bookings, setBookings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userBookings = await listingsApi.getUserBookings();
                setBookings(userBookings);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <p className="loading-message">Loading your bookings...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="profile-page">
            <h1>Your Bookings</h1>
            {bookings.length > 0 ? (
                <div className="bookings-grid">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <h2>{booking.name}</h2>
                            <p>{booking.summary}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no bookings yet.</p>
            )}
        </div>
    );
}