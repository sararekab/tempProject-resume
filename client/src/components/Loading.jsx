import React from "react";
import { PropagateLoader } from 'react-spinners';
const Loading = () => {
    return (
        <div className='app'>
              <h1>Loading, please wait...</h1>
              <p></p>
             <PropagateLoader color={'#36D7B7'}  />
          
        </div>
    );
};

export default Loading;