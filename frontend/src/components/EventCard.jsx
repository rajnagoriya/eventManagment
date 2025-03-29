import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const EventCard = ({ event, onViewDetails, onRegistrationSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPastEvent = new Date(event.endDateTime) < new Date();
  const isRegistrationClosed = new Date(event.registrationDeadline) < new Date();
  const isFull = event.currentParticipants >= event.maxParticipants;

  const handleRegister = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsLoading(true);

    try {
      const token = Cookies.get('token');
      
      if (!token) {
        toast.error('Please login to register for events');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/registration`,
        { eventId: event._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Registration successful!');
      onRegistrationSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${isPastEvent ? 'border-gray-400' : 'border-blue-500'}`}>
      {event.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
          <span className={`px-2 py-1 text-xs rounded-full ${event.eventType === 'workshop' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
            {event.eventType}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(new Date(event.startDateTime), 'MMM d, yyyy h:mm a')}
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            {event.currentParticipants}/{event.maxParticipants} spots
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(event);
              }}
              className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Details
            </button>
            <button
              onClick={handleRegister}
              disabled={isPastEvent || isRegistrationClosed || isFull || isLoading}
              className={`px-3 py-1.5 rounded-md text-white ${
                isPastEvent || isRegistrationClosed || isFull ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-blue-600 hover:bg-blue-700'
              } ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;