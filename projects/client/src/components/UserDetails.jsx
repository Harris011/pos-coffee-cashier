import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Image,
    Button,
    Select,
    IconButton,
    Tooltip,
    Skeleton,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";

function UserDetails(props) {
    let token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [email, setEmail] = useState(props.email);
    const [username, setUsername] = useState(props.username);
    const [roleId, setRoleId] = useState(props.roleId);

    const handleClose = () => {
        setEmail(props.email);
        setUsername(props.username);
        setRoleId(props.roleId);
        props.handleCloseComponent();
    }

    // Edit user
    const onBtnEdit = async () => {
        try {
            if (!token) {
                return toast({
                    position: 'top',
                    title: 'User Update',
                    description: 'unauthorized access',
                    duration: 2000,
                    isClosable: true
                })
            }
            if (email == '' || username == '' || roleId == '') {
                return toast({
                    position: 'top',
                    title: 'User Update',
                    description: 'Please complete all required fields',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            }
            setLoading(true);
            let response = await axios.patch(`http://localhost:8000/api/user/edit/${props.uuid}`, {
                email: email,
                username: username,
                role_id: roleId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'User Update',
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
                toast({
                    position: 'top',
                    title: 'User Update',
                    description: response.data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                toast({
                    position: 'top',
                    title: 'User Update',
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
            {/* user details */}
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
                                    value={username}
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
                                    value={email}
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
                                    value={roleId}
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
                                    onClick={() => props.handleCloseComponent()}
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
                                    onClick={onBtnEdit}
                                >
                                    Save
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default UserDetails;