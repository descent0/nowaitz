import { Outlet } from 'react-router-dom';
import Nav from '../Nav';
import Footer from '../Footer';


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
