import { EventRegistration } from '../model/eventRegistrationSchema.js';
import { User } from '../model/UserSchema.model.js';
import { Event } from '../model/eventSchema.model.js';
import { sendBulkEmails } from '../services/emailService.js';

export const sendEmailToRegisteredUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { subject, message } = req.body;

    // Validate input
    if (!eventId || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event ID, subject, and message are required' 
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Get all registrations for the event with user details
    const registrations = await EventRegistration.find({ event: eventId })
      .populate('user', 'email firstName lastName')
      .exec();

    if (registrations.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No registered users found for this event' 
      });
    }

    // Prepare recipients
    const recipients = registrations.map(reg => ({
      email: reg.user.email,
      name: `${reg.user.firstName} ${reg.user.lastName}`,
      eventTitle: event.title,
      eventDate: event.startDateTime.toLocaleDateString(),
    }));

    // Custom HTML template function
    const htmlTemplate = (recipient) => `
      <div>
        <h2>Hello ${recipient.name},</h2>
        <p>${message}</p>
        <p>This message is regarding the event <strong>${recipient.eventTitle}</strong> 
        scheduled for ${recipient.eventDate}.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Event Management Team</p>
      </div>
    `;

    // Send emails
    const emailResults = await sendBulkEmails(recipients, subject, htmlTemplate);

    // Prepare response
    const successfulEmails = emailResults.filter(r => r.success);
    const failedEmails = emailResults.filter(r => !r.success);

    res.status(200).json({
      success: true,
      message: `Emails sent successfully to ${successfulEmails.length} users`,
      failedCount: failedEmails.length,
      failedEmails: failedEmails.map(f => ({ email: f.email, error: f.error })),
      event: {
        id: event._id,
        title: event.title,
        date: event.startDateTime,
      },
    });

  } catch (error) {
    console.error('Error sending emails to registered users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};