import React from 'react';
import { format } from 'date-fns';

const EventDetailModal = ({ event, onClose, onRegister }) => {
  const isPastEvent = new Date(event.endDateTime) < new Date();
  const isRegistrationClosed = new Date(event.registrationDeadline) < new Date();
  const isFull = event.currentParticipants >= event.maxParticipants;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {event.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Event Type</h3>
                <p className="text-gray-600 capitalize">{event.eventType}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Start Date</h3>
                <p className="text-gray-600">{format(new Date(event.startDateTime), 'MMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">End Date</h3>
                <p className="text-gray-600">{format(new Date(event.endDateTime), 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Registration Deadline</h3>
              <p className="text-gray-600">{format(new Date(event.registrationDeadline), 'MMM d, yyyy h:mm a')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Participants</h3>
                <p className="text-gray-600">{event.currentParticipants}/{event.maxParticipants}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Status</h3>
                <p className={`font-medium ${
                  isPastEvent ? 'text-red-500' : 
                  isRegistrationClosed ? 'text-orange-500' : 
                  'text-green-500'
                }`}>
                  {isPastEvent ? 'Event Ended' : 
                   isRegistrationClosed ? 'Registration Closed' : 
                   isFull ? 'Fully Booked' : 'Open for Registration'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onRegister}
                disabled={isPastEvent || isRegistrationClosed || isFull}
                className={`w-full py-2 px-4 rounded-md text-white ${
                  isPastEvent || isRegistrationClosed || isFull ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Register for Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;