import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from './Reducers/authUser';
import axios from 'axios';
import Login from './pages/Login';
import SideBar from './components/Sidebar';
import DashBoard from './pages/DashBoard';
import ProductsManagement from './pages/ProductsManagement';
import CategoriesManagement from './pages/CategoriesManagement';

function App() {
  const dispatch = useDispatch();
  const roleId = useSelector((state) => state.authUser.role_id);

  const keeplogin = async () => {
    try {
      let token = localStorage.getItem('coffee_login');
      if (token) {
        let response = await axios.get(`http://localhost:8000/api/user/keeplogin`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.setItem('coffee_login', response.data.token);
        dispatch(loginAction(response.data));
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    keeplogin()
  }, []);

  return (
    <div className="App">
      <Box>
        {
          roleId ? (
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Box
                h={'100vh'}
                w={'6vw'}
              >
                <SideBar/>
              </Box>
              <Box
                h={'100vh'}
                w={'94vw'}
              >
                <Routes>
                  {/* <Route path='/' element={<Login/>} /> */}
                  <Route path='/dashboard' element={<DashBoard/>} />
                  <Route path='/products' element={<ProductsManagement/>} />
                  <Route path='/categories' element={<CategoriesManagement/>} />
                </Routes>
              </Box>
            </Flex>
          ) : (
            <Login/>
          )}
      </Box>
    </div>
  );
}

export default App;
