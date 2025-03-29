import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { format, isValid } from 'date-fns';

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely format dates
  const safeFormatDate = (date) => {
    if (!date || !isValid(new Date(date))) return 'Date not available';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        
        if (!token) {
          throw new Error('Please login to view your registrations');
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?._id) {
          throw new Error('User information not found');
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/registration/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setRegistrations(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || 'Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Event Registrations</h1>
      
      {registrations.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">You haven't registered for any events yet.</p>
          <p>Browse events to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {registrations.map(registration => (
            <div key={registration._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Event</h3>
                  <p className="text-gray-600">
                    {registration.event?.title || 'Event details not available'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Registration Date</h3>
                  <p className="text-gray-600">
                    {safeFormatDate(registration.registrationDate)}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Status</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    registration.attendanceStatus === 'registered' ? 
                    'bg-blue-100 text-blue-800' : 
                    registration.attendanceStatus === 'attended' ?
                    'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {registration.attendanceStatus}
                  </span>
                </div>
              </div>
              
              {registration.event && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Event Details:</h4>
                  <p className="text-gray-600">{registration.event.description}</p>
                  <div className="flex items-center mt-2 text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {registration.event.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {safeFormatDate(registration.event.startDateTime)} - 
                    {safeFormatDate(registration.event.endDateTime)}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                {!registration.feedbackSubmitted && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Submit Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;