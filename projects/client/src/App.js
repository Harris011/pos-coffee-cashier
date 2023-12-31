import logo from './logo.svg';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
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
import EmployeeManagement from './pages/EmployeeManagement';
import DashBoards from './pages/DashBoards';
import PageNotFound from './pages/PageNotFound';
import Transaction from './pages/Transaction';

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
                  {
                    roleId === 1 && (
                      <>
                        <Route path='/dashboards' element={<DashBoards/>} />
                        <Route path='/products' element={<ProductsManagement/>} />
                        <Route path='/categories' element={<CategoriesManagement/>} />
                        <Route path='/employee' element={<EmployeeManagement/>} />
                      </>
                    )
                  }
                  {
                    roleId === 2 && (
                      <>
                        <Route path='/dashboard' element={<DashBoard/>} />
                        <Route path='/transaction' element={<Transaction/>} />
                      </>
                    )
                  }
                  <Route path='*' element={<PageNotFound/>}/>
                  <Route path='/' element={<Navigate to={roleId === 1 ? '/dashboards' : '/dashboard'}/>} />
                </Routes>
              </Box>
            </Flex>
          ) : (
            <Routes>
              <Route path='/' element={<Login/>} />
              <Route path='*' element={<PageNotFound/>}/>
            </Routes>
          )}
      </Box>
    </div>
  );
}

export default App;
