
const isLogin = () => {
    return !!localStorage.getItem('token');
}
export default isLogin;

