// import React from 'react'
// import {Route, Navigate } from 'react-router-dom';
// import isLogin from './isLogin'

// export default function PublicRoute({component: Component, restricted,...rest}) {

//     return (
//         <Route {...rest} render={props => (
//             isLogin() && restricted ?
//                 <Navigate  to='/'/>
//                 : <Component {...props}/>
//         )} />
//     );
// };
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isLogin from './isLogin'

// 로그인 X restricted X = 로그인 관계없이 접근가능
// 로그인 X restricted O = 로그인한 상태에서 접근 불가 ex) 로그인화면
const PublicRoute = (restricted) => {
    return isLogin() && restricted ?
            <Navigate to="/" />
            :<Outlet /> 
            
}
export default PublicRoute