import axios from "axios";


export const apiCall = async ({method='POST',uri, body,isJwt= false}) => {
    let data = JSON.stringify(body);
       
      let config = {
        method: method,
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_URL}/${uri}`,
        headers: { 
          "Content-Type": "application/json"
        },
        data : data
      };

      if (isJwt) {
        const token = localStorage.getItem('resume_server_jwt_token');
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      const result = await axios.request(config);
      return result;

}