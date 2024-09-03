import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (data) => {
  let response;
  try {
    response = await api.post("/login", data);
  } catch (error) {
    
    return error;
  }

  return response;
};


export const singup = async (data) =>{
  let response;
  // console.log(data);

  try {
    response = await api.post("/register", data);
  } catch (error) {
    return error;
  }

  return response;

}

export const signout = async () =>{
let response;

try {
  response = await api.post("/logout");
  
} catch (error) {
  return error
}

return response;
}


export const getAllBlogs = async() =>{
  let response;

  try {
    response = await api.get('/blog/all');

  } catch (error) {
    return error
  }
  console.log(response);

  return response;
}


export const submitBlog = async(data)=>{
  let response;

  try {
    response = await api.post('/blog', data);
    console.log(response);
  } catch (error) {
    console.log(error);
    return error;
  }

  return response;
}

export const getBlogById = async (id) => {
  let response;

  try {
    response = await api.get(`/blog/${id}`);
  } catch (error) {
    return error;
  }

  return response;
};

export const getCommentsById = async (id) => {
  let response;

  try {
    response = await api.get(`/comment/${id}`, {
      validateStatus: false,
    });
  } catch (error) {
    return error;
  }

  return response;
};

export const postComment = async (data) => {
  let response;

  try {
    response = await api.post("/comment", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const deleteBlog = async (id) => {
  let response;
  try {
    response = await api.delete(`/blog/${id}`);
  } catch (error) {
    return error;
  }

  return response;
};

export const updateBlog = async (data) => {
  let response;

  try {
    response = await api.put('/blog', data)
  } catch (error) {
    return error;
  }

  return response;
};


api.interceptors.response.use(
  config => config,
  async (error) => {
    const originalReq = error.config;

    if ( (error.response.status === 401 || error.response.status === 500) && originalReq && !originalReq._isRetry){
      originalReq._isRetry = true;

      try {
        await axios.get('http://localhost:5000/refresh', {withCredentials:true});

        return api.request(originalReq);
        
      } catch (error) {
        console.log(error);
        return error;
      }
    }


  }
)
