import React, { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Image,
    FormControl,
    FormLabel,
    Input,
    Button,
    InputGroup,
    InputRightAddon,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import SyncLoader from "react-spinners/SyncLoader";
import { useDispatch } from 'react-redux';
import { loginAction } from '../Reducers/authUser';
import login_image from '../asset/login_image.jpg';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState('password');
    const [loading, setLoading] = useState(false);
    
    const handleVisible = () => {
        if (visible == 'password') {
            setVisible('text');
        } else {
            setVisible('password');
        }
    }

    const onBtnLogin = async () => {
        try {
            if (email == '' || password == '') {
                return toast({
                    position: 'top',
                    title: 'Login',
                    description: 'Please complete all requier fields',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            };

            setLoading(true);

            let response = await axios.post(`http://localhost:8000/api/user/auth`, {
                email: email,
                password: password
            });
            if (response.data.length == 0) {
                setLoading(false);
                return toast({
                    position: 'top',
                    title: 'Login',
                    description: 'Account not found',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            } else {
                toast({
                    position: 'top',
                    title: 'Login',
                    description: 'Login success',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                setTimeout(() => {
                    localStorage.setItem('coffee_login', response.data.token);
                    dispatch(loginAction(response.data))
                    navigate('/dashboard', {replace: true});
                }, 1500);
                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            toast({
                position: 'top',
                title: 'Login',
                description: error.response.data.message,
                status:'error',
                duration: 2000,
                isClosable: true
            })
            setLoading(false);
        }
    }

    return ( 
        <Flex
            h={'100vh'}
            w={'100vw'}
            bg={'whitesmoke'}
            justifyContent={'center'}
            alignContent={'center'}
        >
            <Box
                h={'90vh'}
                w={'75vw'}
                my={'8'}
                borderRadius={'xl'}
                shadow={'2xl'}
            >
                <Flex
                    flexDir={'row'}
                    justifyContent={'space-evenly'}
                    h={'100%'}
                >
                    <Flex
                        justifyContent={'center'}
                        alignContent={'center'}
                        bg={'black'}
                        w={'50%'}
                        roundedLeft={'xl'}
                    >
                        <Box
                            my={'12'}
                            w={'80%'}
                        >
                            <Text
                                color={'white'}
                                fontSize={'3xl'}
                                fontWeight={'semibold'}
                                textAlign={'start'}
                                mb={'4'}
                            >
                                Welcome to Coffee Shop
                            </Text>
                            <FormControl
                                my={'2'}
                            >
                                <FormLabel
                                    color={'white'}
                                >
                                    Email
                                </FormLabel>
                                <Input
                                    type='email'
                                    placeholder='Enter your email'
                                    bg={'white'}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl
                                my={'2'}
                            >
                                <FormLabel
                                    color={'white'}
                                >
                                    Password
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        placeholder='Enter your Password'
                                        bg={'white'}
                                        type={visible}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputRightAddon
                                        onClick={handleVisible}
                                    >
                                        {
                                            visible == 'password' ?
                                            <AiFillEyeInvisible/>
                                            :
                                            <AiFillEye/>
                                        }
                                    </InputRightAddon>
                                </InputGroup>
                            </FormControl>
                            
                            <Button
                                bg={'white'}
                                my={'6'}
                                w={'full'}
                                isLoading={loading}
                                spinner={<SyncLoader size={8} color='black'/>}
                                onClick={onBtnLogin}
                            >
                                Login
                            </Button>

                            <Text
                                textAlign={'start'}
                                fontSize={'sm'}
                                color={'whitesmoke'}
                                letterSpacing={'tight'}
                                pt={'1'}
                            >
                                Forgot password ? Please contact the Admin
                            </Text>
                        </Box>
                    </Flex>
                    <Flex
                        justifyContent={'center'}
                        alignContent={'center'}
                        w={'50%'}
                    >
                        <Image 
                            src={login_image}
                            objectFit={'cover'}
                            h={'100%'}
                            w={'100%'}
                            alt='Login Picture'
                            roundedRight={'xl'}
                        />
                    </Flex>
                </Flex>
            </Box>
        </Flex>
     );
}

export default Login;