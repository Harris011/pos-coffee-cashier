import React, { useEffect, useState } from 'react';
import { 
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    Skeleton,
    useToast,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios';

function AddUser(props) {
    let token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState('password');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    
    const handleClose = () => {
        setEmail('');
        setUsername('');
        setRoleId('');
        setPassword('');
        setConfirmationPassword('');
        props.handleCloseComponent();
    }

    const handleVisible = () => {
        if (visible == 'password') {
            setVisible('text');
        } else {
            setVisible('password');
        }
    }

    const onBtnCreate = async () => {
        try {
            if (!token) {
                return toast({
                    position: 'top',
                    title: 'Create new product',
                    description: 'unauthorized access',
                    duration: 2000,
                    isClosable: true
                })
            }
            if (email == '' || username == '' || roleId == '' || password == '' || confirmationPassword == '') {
                return toast({
                    position: 'top',
                    title: 'Create new product',
                    description: 'Please complete all required fields',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            }
            setLoading(true);
            let response = await axios.post(`http://localhost:8000/api/user/register`, {
                email: email,
                username: username,
                role_id: roleId,
                password: password,
                confirmationPassword: confirmationPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Create new Employee',
                    description: response.data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                setTimeout(() => {
                    props.onSuccess();
                    handleClose();
                }, 1500)
                setLoading(false);
            } else {
                setTimeout(() => {
                    toast({
                        position: 'top',
                        title: 'Create new category',
                        description: 'Fail to create new Employee',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                })
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                toast({
                    position: 'top',
                    title: 'Create new category',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            }, 1500)
            setLoading(false);
        }
    }

    // Get Role
    const [roleList, setRoleList] = useState([]);
    
    const getRole = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/user/role-list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRoleList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRole();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            setIsLoaded(true)
        }, 2000)

        return () => {
            clearTimeout(delay);
        }
    }, []);

    return ( 
        <Box
            h={'90vh'}
            w={'23.5vw'}
            rounded={'xl'}
            px={'1.5'}
        >
            {/* add user */}
            <Flex
                flexDir={'column'}
                justifyContent={'space-between'}
                h={'90vh'}
            >
                <Flex
                    flexDir={'column'}
                    alignItems={'center'}
                    h={'80vh'}
                    pt={'2'}
                >
                    <Box
                        w={'90%'}
                        py={'1'}
                    >
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                >
                                    User name
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Input
                                    size={'xs'}
                                    color={'black'}
                                    bg={'white'}
                                    variant={'outline'}
                                    type='text'
                                    letterSpacing={'tight'}
                                    placeholder={`Enter the User's Name`}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Email
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Input
                                    size={'xs'}
                                    color={'black'}
                                    bg={'white'}
                                    variant={'outline'}
                                    type='email'
                                    letterSpacing={'tight'}
                                    placeholder='Enter User Email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Role
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Select
                                    placeholder='Select User Role'
                                    size={'xs'}
                                    variant={'outline'}
                                    color={'black'}
                                    bg={'white'}
                                    onChange={(e) => {
                                        setRoleId(parseInt(e.target.value))
                                    }}
                                >
                                    {
                                        roleList.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role?.role}
                                            </option>
                                        ))
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Password
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <InputGroup
                                    size={'xs'}
                                >
                                    <Input
                                        color={'black'}
                                        bg={'white'}
                                        variant={'outline'}
                                        type={visible}
                                        letterSpacing={'tight'}
                                        placeholder='Enter password'
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
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Confirmation Password
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <InputGroup
                                    size={'xs'}
                                >
                                    <Input
                                        color={'black'}
                                        bg={'white'}
                                        variant={'outline'}
                                        type={visible}
                                        letterSpacing={'tight'}
                                        placeholder='Enter Confirmation Password'
                                        onChange={(e) => setConfirmationPassword(e.target.value)}
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
                            </Skeleton>
                        </FormControl>
                    </Box>
                </Flex>
                <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    h={'8vh'}
                    mb={'2'}
                    borderTop={'1px'}
                    borderColor={'white'}
                    pt={'2.5'}
                >
                    <Flex
                        w={'90%'}
                        justifyContent={'space-evenly'}
                    >
                        <Box>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'sm'}
                                    colorScheme={'red'}
                                    color={'white'}
                                    onClick={() => {
                                        handleClose();
                                    }}
                                >
                                    Close
                                </Button>
                            </Skeleton>
                        </Box>
                        <Flex
                            justifyContent={'center'}
                            w={'30%'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'sm'}
                                    colorScheme={'green'}
                                    color={'white'}
                                    isLoading={loading}
                                    spinner={<PulseLoader size={8} color='white' />}
                                    onClick={onBtnCreate}
                                >
                                    Create
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default AddUser;