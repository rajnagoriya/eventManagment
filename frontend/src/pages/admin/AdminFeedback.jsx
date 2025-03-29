import React from 'react'

import  { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { FiMessageSquare, FiStar, FiX } from 'react-icons/fi';

const AdminFeedback = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/events`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data.data.events);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch feedback for selected event
  const fetchFeedback = async (eventId) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`http://localhost:8000/api/v1/feedback/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFeedback(response.data.data);
      setSelectedEvent(eventId);
      setShowFeedback(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch feedback');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e._id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i}
            className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Event Feedback</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Events List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => fetchFeedback(event._id)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <FiMessageSquare className="mr-1" /> View Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Feedback Modal */}
          {showFeedback && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Feedback for: {getEventName(selectedEvent)}
                  </h2>
                  <button 
                    onClick={() => setShowFeedback(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="p-6">
                  {feedback.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No feedback submitted for this event yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Total Feedback Submissions: {feedback.length}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {feedback.map((item) => (
                          <div key={item._id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-gray-900">{item.user.email}</h3>
                                <p className="text-xs text-gray-500">{formatDate(item.submissionDate)}</p>
                              </div>
                              <div>
                                {renderRatingStars(item.rating)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-gray-700">{item.comments}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end p-4 border-t">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;

