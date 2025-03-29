import React from 'react'
import  { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { FiUsers, FiTrash2, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdminRegistration = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [showRegistrations, setShowRegistrations] = useState(false);

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

  // Fetch registrations for selected event
  const fetchRegistrations = async (eventId) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/registration/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRegistrations(response.data.data);
      setSelectedEvent(eventId);
      setShowRegistrations(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch registrations');
    }
  };

  // Delete a registration
  const handleDeleteRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        const token = Cookies.get('token');
        await axios.delete(`${import.meta.env.VITE_BACKEND_BASEURL}/registration/${registrationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Registration deleted successfully');
        // Refresh registrations
        fetchRegistrations(selectedEvent);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete registration');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e._id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Event Registrations</h1>
      
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
                        onClick={() => fetchRegistrations(event._id)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <FiUsers className="mr-1" /> View Registrations
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Registrations Modal */}
          {showRegistrations && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Registrations for: {getEventName(selectedEvent)}
                  </h2>
                  <button 
                    onClick={() => setShowRegistrations(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="p-6">
                  {registrations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No registrations found for this event
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Total Registrations: {registrations.length}
                        </div>
                      </div>

                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {registrations.map((registration) => (
                              <tr key={registration._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {registration.user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(registration.registrationDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    registration.attendanceStatus === 'attended' 
                                      ? 'bg-green-100 text-green-800'
                                      : registration.attendanceStatus === 'no_show'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {registration.attendanceStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteRegistration(registration._id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete Registration"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end p-4 border-t">
                  <button
                    onClick={() => setShowRegistrations(false)}
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

export default AdminRegistration;

