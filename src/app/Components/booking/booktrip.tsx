'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface Prediction {
  description: string;
  place_id: string;
}

export default function BookTrip() {
  const router = useRouter();
  
  const [date, setDate] = useState('December 17, 2025');
  const [time, setTime] = useState('ASAP');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalTime, setArrivalTime] = useState('05:28');
  const [terminal, setTerminal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Add credit card');
  const [vehicleType, setVehicleType] = useState('');
  const [noteToDriver, setNoteToDriver] = useState('');
  const [returnTrip, setReturnTrip] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<Prediction[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Prediction[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null);
  const routeLineRef = useRef<google.maps.Polyline | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const paymentOptions = ['Add credit card', 'Payment on board', 'Cash', 'Debit card'];
  const vehicleOptions = ['No vehicle available', 'Sedan', 'SUV', 'Van', 'Luxury'];

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 24.8607, lng: 67.0011 },
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      googleMapRef.current = map;
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      geocoderRef.current = new google.maps.Geocoder();
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    if (!googleMapRef.current) return;

    if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
    if (dropoffMarkerRef.current) dropoffMarkerRef.current.setMap(null);
    if (routeLineRef.current) routeLineRef.current.setMap(null);

    if (pickup) {
      pickupMarkerRef.current = new google.maps.Marker({
        position: { lat: pickup.lat, lng: pickup.lng },
        map: googleMapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }

    if (dropoff) {
      dropoffMarkerRef.current = new google.maps.Marker({
        position: { lat: dropoff.lat, lng: dropoff.lng },
        map: googleMapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }

    if (pickup && dropoff) {
      routeLineRef.current = new google.maps.Polyline({
        path: [
          { lat: pickup.lat, lng: pickup.lng },
          { lat: dropoff.lat, lng: dropoff.lng },
        ],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: googleMapRef.current,
      });

      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
      bounds.extend({ lat: dropoff.lat, lng: dropoff.lng });
      googleMapRef.current.fitBounds(bounds);
    } else if (pickup) {
      googleMapRef.current.setCenter({ lat: pickup.lat, lng: pickup.lng });
      googleMapRef.current.setZoom(13);
    } else if (dropoff) {
      googleMapRef.current.setCenter({ lat: dropoff.lat, lng: dropoff.lng });
      googleMapRef.current.setZoom(13);
    }
  }, [pickup, dropoff]);

  const handlePickupInput = (value: string) => {
    setPickupLocation(value);
    
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'pk' },
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPickupSuggestions(predictions);
            setShowPickupSuggestions(true);
          }
        }
      );
    } else {
      setShowPickupSuggestions(false);
    }
  };

  const handleDropoffInput = (value: string) => {
    setDropoffLocation(value);
    
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'pk' },
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setDropoffSuggestions(predictions);
            setShowDropoffSuggestions(true);
          }
        }
      );
    } else {
      setShowDropoffSuggestions(false);
    }
  };

  const handleLocationSelect = async (placeId: string, isPickup: boolean) => {
    if (!geocoderRef.current) return;

    try {
      geocoderRef.current.geocode({ placeId }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0];
          const coords = location.geometry.location;
          
          const locationData: Location = {
            address: location.formatted_address,
            lat: coords.lat(),
            lng: coords.lng(),
          };

          if (isPickup) {
            setPickup(locationData);
            setPickupLocation(location.formatted_address);
            setShowPickupSuggestions(false);
          } else {
            setDropoff(locationData);
            setDropoffLocation(location.formatted_address);
            setShowDropoffSuggestions(false);
          }
        }
      });
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleBookNow = () => {
    if (!pickup || !dropoff) {
      alert('Please select both pickup and drop-off locations');
      return;
    }

    // Calculate random amount
    const amount = `$${(Math.random() * 50 + 20).toFixed(2)}`;

    // Create new booking
    const newBooking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date,
      time,
      taxiCompany: 'Swift Rides',
      from: pickup.address,
      to: dropoff.address,
      payment: paymentMethod,
      amount,
      vehicleType: vehicleType || 'Standard',
      noteToDriver,
      returnTrip,
      status: 'in-progress',
      flightNumber,
      arrivalTime,
      terminal,
    };

    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Add new booking to the beginning
    const updatedBookings = [newBooking, ...existingBookings];
    
    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    alert('Trip booked successfully!');
    router.push('/book-trip/history');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full Screen Map Background */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full"></div>

      {/* Floating Form Panel */}
      <div className="absolute left-0 sm:left-8 overflow-x-auto top-8 w-auto sm:w-[480px] max-h-[calc(100vh-4rem)] bg-white shadow-2xl rounded-xl overflow-y-auto z-10">
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">Book a trip</h1>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Time (24 Hour)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pickup / Drop-off */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">
              Pickup / Drop-off
            </label>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="relative flex items-start gap-3">
                <div className="mt-4 flex-shrink-0">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => handlePickupInput(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Pickup Suggestions Dropdown */}
                  {showPickupSuggestions && pickupSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          onClick={() => handleLocationSelect(suggestion.place_id, true)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0"
                        >
                          {suggestion.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              <div className="flex items-center gap-3">
                <div className="ml-[7px] w-[2px] h-8 bg-gray-300"></div>
              </div>

              {/* Dropoff Location */}
              <div className="relative flex items-start gap-3">
                <div className="mt-4 flex-shrink-0">
                  <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow"></div>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => handleDropoffInput(e.target.value)}
                    placeholder="Enter drop-off location"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Dropoff Suggestions Dropdown */}
                  {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {dropoffSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          onClick={() => handleLocationSelect(suggestion.place_id, false)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0"
                        >
                          {suggestion.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add additional stop */}
            <button className="mt-4 ml-9 text-sm text-gray-500 underline hover:text-gray-700">
              Add additional stop
            </button>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Payment Method
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-gray-900 font-medium">{paymentMethod}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showPaymentDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {paymentOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setPaymentMethod(option);
                        setShowPaymentDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Options / Note to Driver */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Vehicle Options / Note to Driver
            </label>
            
            <div className="relative mb-3">
              <button
                onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span className={`font-medium ${vehicleType ? 'text-gray-900' : 'text-gray-500'}`}>
                    {vehicleType || 'Select a vehicle type'}
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showVehicleDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {vehicleOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setVehicleType(option);
                        setShowVehicleDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <textarea
              value={noteToDriver}
              onChange={(e) => setNoteToDriver(e.target.value)}
              placeholder="Add note to driver..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Return Trip Checkbox */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={returnTrip}
                onChange={(e) => setReturnTrip(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700">Would you like to book a return trip?</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/history')}
              className="flex-1 px-6 py-2 text-gray-700 bg-gray-300 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBookNow}
              className="flex-1 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Location Info Overlays */}
      {pickup && (
        <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pick-up</div>
          <div className="text-sm font-medium text-gray-900">{pickup.address}</div>
        </div>
      )}
      
      {dropoff && (
        <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Drop-off</div>
          <div className="text-sm font-medium text-gray-900">{dropoff.address}</div>
        </div>
      )}
    </div>
  );
}
