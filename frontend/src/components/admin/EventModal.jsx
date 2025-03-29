import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const EventModal = ({ isOpen, onClose, event, action, refreshEvents }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'workshop',
    startDateTime: '',
    endDateTime: '',
    location: '',
    maxParticipants: '',
    registrationDeadline: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDateTime: event.startDateTime ? new Date(event.startDateTime).toISOString().slice(0, 16) : '',
        endDateTime: event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 16) : '',
        location: event.location,
        maxParticipants: event.maxParticipants || '',
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
        image: null
      });
      setPreviewImage(event.imageUrl);
    } else {
      setFormData({
        title: '',
        description: '',
        eventType: 'workshop',
        startDateTime: '',
        endDateTime: '',
        location: '',
        maxParticipants: '',
        registrationDeadline: '',
        image: null
      });
      setPreviewImage(null);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('token');
      const formDataToSend = new FormData();
      
      // Append all fields to formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      if (action === 'create') {
        await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/events/create`, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event created successfully');
      } else if (action === 'edit') {
        await axios.put(`${import.meta.env.VITE_BACKEND_BASEURL}/events/update/${event._id}`, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event updated successfully');
      }

      onClose();
      refreshEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {action === 'create' ? 'Create New Event' : action === 'edit' ? 'Edit Event' : 'Event Details'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {action !== 'view' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type*</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={action === 'view'}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time*</label>
                  <input
                    type="datetime-local"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time*</label>
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={action === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={action === 'view'}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={action === 'view'}
                ></textarea>
              </div>

              {previewImage && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                  <img src={previewImage} alt="Preview" className="h-40 object-cover rounded-md" />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Title:</span>
                <span>{event.title}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Type:</span>
                <span className="capitalize">{event.eventType}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Description:</span>
                <span>{event.description}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Start:</span>
                <span>{new Date(event.startDateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">End:</span>
                <span>{new Date(event.endDateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Location:</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Participants:</span>
                <span>{event.currentParticipants}/{event.maxParticipants}</span>
              </div>
              {event.imageUrl && (
                <div className="flex items-start">
                  <span className="w-32 font-medium text-gray-700">Image:</span>
                  <img src={event.imageUrl} alt="Event" className="h-40 object-cover rounded-md" />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            {action !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : action === 'create' ? 'Create Event' : 'Update Event'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {action === 'view' ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;