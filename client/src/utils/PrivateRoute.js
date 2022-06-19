// import React from 'react'
// import {Route, Navigate } from 'react-router-dom';
// import isLogin from './isLogin'

// export default function PrivateRoute({component: Component, ...rest}) {

//     return (
//         <Route {...rest} render={props => (
//             isLogin() ?
//                 <Component {...props}/>
//                 : <Navigate to='/login'/>
//         )}/>
//     );
// };
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isLogin from './isLogin'

// 로그인한 경우에만 접근가능
const PrivateRoute = () => {
    return isLogin() ?  
            <Outlet/> 
            :<Navigate to="/login" />
}
export default PrivateRoute