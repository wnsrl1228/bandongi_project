
const isLogin = () => {
    return !!sessionStorage.getItem('token');
    
}
export default isLogin;

