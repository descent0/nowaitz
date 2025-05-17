import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import Nav from '../Nav';
import Footer from '../Footer';
import useAuth from '../../utils/checkAuth';
import { useEffect } from 'react';

const LandingPage = () => {


  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default LandingPage;
