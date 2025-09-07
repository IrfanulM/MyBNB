import { useState, useEffect, useRef } from 'react';
import { listingsApi, Listing } from '../services/api';
import BookingModal from '../pages/booking';

export default function HomePage() {
  const [error, setError] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [location, setLocation] = useState<string>("");
  const [property_type, setPropertyType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");

  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [authStatus, setAuthStatus] = useState<{ isAuthenticated: boolean; email?: string }>({ isAuthenticated: false });
  const [activeField, setActiveField] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [searchSummary, setSearchSummary] = useState<string>("Displaying 15 random listings...");
  
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllInitialData = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          fetchedListings,
          fetchedPropertyTypes,
          fetchedBedrooms,
          status,
        ] = await Promise.all([
          listingsApi.getInitialListings(),
          listingsApi.getAllPropertyTypes(),
          listingsApi.getBedrooms(),
          listingsApi.getAuthStatus(),
        ]);
        setListings(fetchedListings);
        setPropertyTypeOptions(fetchedPropertyTypes);
        setBedroomOptions(fetchedBedrooms);
        setAuthStatus(status);
      } catch (err) {
        setError("Failed to load page data. Please try refreshing.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllInitialData();

    const handleClickOutside = (event: MouseEvent) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
            setActiveField(null);
            setOpenDropdown(null);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (selectedListing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedListing]);

  const handleBookClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
  };

  const handleSearch = async () => {
    if (!location && !property_type && !bedrooms) {
      setError("Please enter at least one search criteria.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const filterParams = {
        location: location || undefined,
        property_type: property_type || undefined,
        bedrooms: bedrooms || undefined,
      };
      const fetchedSearchResults: Listing[] = await listingsApi.getSearchResults(filterParams);
      setListings(fetchedSearchResults);
      
      // Build the dynamic search summary
      let summary = `${fetchedSearchResults.length} result(s) found`;
      if (location) summary += ` in "${location}"`;
      if (property_type) summary += ` for "${property_type}"`;
      if (bedrooms) summary += ` with ${bedrooms} bedroom(s)`;
      setSearchSummary(summary);

    } catch {
      setError("Failed to fetch search results. Please try again.");
      setListings([]);
      setSearchSummary("No results found.");
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

    if (x > width / 2 && y < height / 2) {
      card.style.transform = `rotateX(${angle}deg) rotateY(${angle}deg)`;
    } 
    else if (x < width / 2 && y < height / 2) {
      card.style.transform = `rotateX(${angle}deg) rotateY(-${angle}deg)`;
    } 
    else if (x > width / 2 && y > height / 2) {
      card.style.transform = `rotateX(-${angle}deg) rotateY(${angle}deg)`;
    } 
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

  const handleDropdownToggle = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const handleOptionSelect = (field: string, value: string) => {
    if (field === 'property_type') {
      setPropertyType(value);
    } else if (field === 'bedrooms') {
      setBedrooms(value);
    }
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="page-container">
        <header className="top-section">
          <div className="search-bar-wrapper">
            <div className="search-bar-container" ref={searchBarRef}>
              
              {/* Location Field */}
              <div
                className={`search-field ${activeField === 'location' ? 'active' : ''}`} 
                onClick={() => { setActiveField('location'); setOpenDropdown(null); }}
              >
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter desired location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="search-field-separator"></div>

              {/* Property Type Field */}
              <div 
                className={`search-field ${activeField === 'property_type' ? 'active' : ''}`}
                onClick={() => setActiveField('property_type')}
              >
                <label>Property Type</label>
                <div className="custom-select-wrapper">
                  <div className="custom-select-trigger" onClick={() => handleDropdownToggle('property_type')}>
                    {property_type || 'Any'}
                  </div>
                  {openDropdown === 'property_type' && (
                    <div className="custom-options">
                      <div className="custom-option" onClick={() => handleOptionSelect('property_type', '')}>Any</div>
                      {propertyTypeOptions.map((type) => (
                        <div key={type} className="custom-option" onClick={() => handleOptionSelect('property_type', type)}>
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="search-field-separator"></div>

              {/* Bedrooms Field */}
              <div 
                className={`search-field ${activeField === 'bedrooms' ? 'active' : ''}`}
                onClick={() => setActiveField('bedrooms')}
              >
                <label>Number of Bedrooms</label>
                 <div className="custom-select-wrapper">
                  <div className="custom-select-trigger" onClick={() => handleDropdownToggle('bedrooms')}>
                    {bedrooms || 'Any'}
                  </div>
                  {openDropdown === 'bedrooms' && (
                    <div className="custom-options">
                      <div className="custom-option" onClick={() => handleOptionSelect('bedrooms', '')}>Any</div>
                      {bedroomOptions.map((beds) => (
                        <div key={beds} className="custom-option" onClick={() => handleOptionSelect('bedrooms', beds)}>
                          {beds}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          <div className="search-button-wrapper">
            {error && <p className="error-message">{error}</p>}
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>
        </header>

        <main className="bottom-section">
          <h3>{searchSummary}</h3>
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
                          <p className="listing-name" style={{cursor: 'pointer'}} onClick={() => handleBookClick(listing)}>{listing.name && listing.name != "" ? toTitleCase(listing.name) : 'No Title'}</p>
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
                          <div className="book-button" onClick={() => handleBookClick(listing)}>Book</div>
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
      {selectedListing && 
        <BookingModal 
          listing={selectedListing} 
          onClose={handleCloseModal}
          isAuthenticated={authStatus.isAuthenticated}
          email={authStatus.email}
        />}
    </>
  );
}