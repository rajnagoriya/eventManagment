import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
// import Events from './pages/Events';
// import MyRegistrations from './pages/MyRegistrations';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminRegistration from './pages/admin/AdminRegistration';
import AdminReminder from './pages/admin/AdminReminder';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          {/* <Route path="/events" element={<Layout><>event</></Layout>} /> */}
          <Route path="/my-registrations" element={<Layout><MyRegistrations/></Layout>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<Layout><AdminDashBoard /></Layout>} />
          <Route path="/admin/feedback" element={<Layout><AdminFeedback /></Layout>} />
          <Route path="/admin/registrations" element={<Layout><AdminRegistration /></Layout>} />
          <Route path="/admin/reminders" element={<Layout><AdminReminder /></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;