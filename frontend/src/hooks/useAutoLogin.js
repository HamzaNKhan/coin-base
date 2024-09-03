import { useState, useEffect } from "react";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

function useAutoLogin() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const INTERNAL_API_PATH = "http://localhost:5000"

  useEffect(() => {
    //IIFE
    (async function useAutoLoginApiCall() {
      try {
        const response = await axios.get(
          `${INTERNAL_API_PATH}/refresh`,
          { withCredentials: true }
        );
        
        if (response.status === 200) {
            //1. setUser
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth,
            };
            dispatch(setUser(user));
            
        }
    } catch (error) {
      console.log(error);
    }
    finally{
        setLoading(false)

    }
    })();
  }, []);

  return loading;
}

export default useAutoLogin;
