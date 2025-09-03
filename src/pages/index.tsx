import { useState, useEffect } from 'react';
import { listingsApi, Listing } from '../services/api';
import Link from 'next/link';

export default function HomePage() {
  const [error, setError] = useState<String>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [location, setLocation] = useState<string>("");
  const [property_type, setPropertyType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");

  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllInitialData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          fetchedListings,
          fetchedPropertyTypes,
          fetchedBedrooms,
        ] = await Promise.all([
          listingsApi.getInitialListings(),
          listingsApi.getAllPropertyTypes(),
          listingsApi.getBedrooms(),
        ]);
        setListings(fetchedListings);
        setPropertyTypeOptions(fetchedPropertyTypes);
        setBedroomOptions(fetchedBedrooms);

      } catch (err) {
        setError("Failed to load page data. Please try refreshing.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllInitialData();
  }, []);

  // function to handle the search button click
  const handleSearch = async () => {
    if (!location) {
      setError("You must enter a location.");
      return;
    }

    setLoading(true);
    try {
      const filterParams = {
        location: location,
        property_type: property_type || undefined,
        bedrooms: bedrooms || undefined,
      };
      const fetchedSearchResults: Listing[] = await listingsApi.getSearchResults(filterParams);
      setListings(fetchedSearchResults);
      setError("");
    } catch {
      setError("Failed to fetch search results. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardParent = e.currentTarget;
    const card = cardParent.querySelector('.listing-card') as HTMLDivElement;
    if (!card) return;

    const { left, top, width, height } = cardParent.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const angle = 10;

    // Top-Right
    if (x > width / 2 && y < height / 2) {
      card.style.transform = `rotateX(${angle}deg) rotateY(${angle}deg)`;
    } 
    // Top-Left
    else if (x < width / 2 && y < height / 2) {
      card.style.transform = `rotateX(${angle}deg) rotateY(-${angle}deg)`;
    } 
    // Bottom-Right
    else if (x > width / 2 && y > height / 2) {
      card.style.transform = `rotateX(-${angle}deg) rotateY(${angle}deg)`;
    } 
    // Bottom-Left
    else {
      card.style.transform = `rotateX(-${angle}deg) rotateY(-${angle}deg)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardParent = e.currentTarget;
    const card = cardParent.querySelector('.listing-card') as HTMLDivElement;
    if (!card) return;
    
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="page-container">
      <header className="top-section">
        <div className="input-group-container">
          <div className="input-group">

            <label htmlFor="location" className="input-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Enter desired location"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="property-type" className="input-label">
              Property Type
            </label>
            <select
              id="property-type"
              className="input-field"
              value={property_type}
              onChange={(e) => setPropertyType(e.target.value)}
              disabled={loading}
            >
              <option value="">No Selection</option>
              {propertyTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="bedrooms" className="input-label">
              Number of Bedrooms
            </label>
            <select
              id="bedrooms"
              className="input-field"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              disabled={loading}
            >
              <option value="">No Selection</option>
              {bedroomOptions.map((beds) => (
                <option key={beds} value={beds}>
                  {beds}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="error-search">
          {error && <p className="error-message">{error}</p>}
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </header>

      <main className="bottom-section">
        <h3>Your Search Results:</h3>
          {loading && (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          )}

          {!loading && listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div 
                  key={listing._id} 
                  className="listing-parent"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="listing-card">
                    {listing.images?.picture_url && (
                      <div className="listing-image-container">
                        <img
                          src={listing.images.picture_url}
                          alt={listing.name || 'Listing image'}
                          className="listing-image"
                          onError={(e) => {
                            e.currentTarget.src = '/no-image.avif';
                          }}
                        />
                      </div>
                    )}
                    <div className="pop">
                      <Link href={`/bookings/${listing._id}`} passHref>
                          <p className="listing-name">{listing.name && listing.name != "" ? toTitleCase(listing.name) : 'No Title'}</p>
                      </Link>
                    </div>
                    <p className="listing-summary">{listing.summary && listing.summary != "" ? listing.summary : 'No description provided'}</p>
                    
                    <div className="card-details-container">
                        <div className="price-box">
                            <span className="price-label">Daily Rate</span>
                            <span className="price-value">${listing.price.$numberDecimal ?? 'N/A'}</span>
                        </div>
                        <div className="rating-box">
                            <span className="rating-label">Customer Rating</span>
                            <span className="rating-value">
                              {listing.review_scores.review_scores_rating ? (
                                <>
                                  {listing.review_scores.review_scores_rating} 
                                  <span className="rating-scale">/100</span>
                                </>
                              ) : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="pop">
                      <Link href={`/bookings/${listing._id}`} passHref>
                          <div className="book-button">Book</div>
                      </Link>
                    </div>

                    <p className="listing-misc">{listing.bedrooms} bedroom {listing.property_type.toLowerCase()} in {listing.address.market}.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : ( !loading && !error &&
            <p>No matching results found.</p>
          )}
      </main>
    </div>
  );
}