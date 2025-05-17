import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isAuthenticated,setIsAuthenticated]=useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/auth/checkAuth", 
        { headers: { "Content-Type": "application/json" }, withCredentials: true, });
        setUser(response.data); 
        setIsAuthenticated(true);
       
        
      } catch (e) {
        if (e.response && e.response.status === 401) {
          setError("User not authenticated");
        } else {
          setError("Failed to check authentication");
        }
        console.error("Error checking auth:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); 

  return { user, isAuthenticated ,isLoading, error };
};

export default useAuth;
