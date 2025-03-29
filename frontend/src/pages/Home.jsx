import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EventDetailModal from '../components/EventDetailModal';
import RegistrationModal from '../components/RegistrationModal';
import axios from 'axios';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/events`);
        setEvents(response.data.data.events);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = async () => {
    // Refresh events after successful registration
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/events`);
      setEvents(response.data.data.events);
    } catch (err) {
      console.error('Error refreshing events:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">No events available at the moment.</p>
          <p>Check back later or create a new event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              onViewDetails={handleViewDetails}
              onRegister={() => handleRegisterClick(event)}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <>
          <EventDetailModal 
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRegister={() => handleRegisterClick(selectedEvent)}
          />
          
          {showRegistrationModal && (
            <RegistrationModal
              event={selectedEvent}
              onClose={() => setShowRegistrationModal(false)}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;