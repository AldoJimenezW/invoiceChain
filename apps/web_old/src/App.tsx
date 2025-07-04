import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PrivateRoute from './PrivateRoute';
import Dashboard from './Dashboard';
import { authClient } from '../lib/auth-client';

const Landing: React.FC = () => (
  <div className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url("/bg.jpg")' }}>
    <div className="text-center">
      <h1 className="text-white text-[100px] font-light">inVoiceChain</h1>
      <p className="mb-8 text-white text-xl">Handmade with soul. Secured by blockchain.</p>
      <div className="flex justify-center gap-4">
        <Link to="/signin" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Sign In</Link>
        <Link to="/signup" className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">Sign Up</Link>
      </div>
    </div>
  </div>
);

const App = () => {
  const { data: session } = authClient.useSession()
  console.log(session)

  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
