import React, { useEffect, useState } from 'react';
import { 
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Button,
    Skeleton,
    useToast,
    InputGroup,
    InputRightAddon,
    Text
} from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios';

function ResetPassword(props) {
    let token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState('password');
    const [email, setEmail] = useState(props.email);
    const [username, setUsername] = useState(props.username);
    const [role, setRole] = useState(props.role);
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');

    const handleClose = () => {
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

    // Reset password
    const onBtnReset = async () => {
        try {
            if (!token) {
                return toast({
                    position: 'top',
                    title: 'Edit product',
                    description: 'unauthorized access',
                    duration: 2000,
                    isClosable: true
                })
            }
            if (password == '' || confirmationPassword == '') {
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
            let response = await axios.patch(`http://localhost:8000/api/user/reset-password/${props.uuid}`, {
                password: password,
                confirmationPassword: confirmationPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Reset Password',
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
                        <Flex
                            flexDir={'column'}
                            gap={'1'}
                            w={'100%'}
                        >
                            <Flex
                                gap={'1'}
                                w={'100%'}
                            >
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Text
                                        color={'white'}
                                        fontSize={'sm'}
                                        w={'65px'}
                                        textAlign={'start'}
                                    >
                                        Username
                                    </Text>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Box
                                        w={{ lg:'120px', xl:'175px'}}
                                    >
                                        <Text
                                            textAlign={'start'}
                                            color={'white'}
                                            fontSize={'sm'}
                                            overflow={'hidden'}
                                            whiteSpace={'nowrap'}
                                            textOverflow={'ellipsis'}
                                            display={'block'}
                                        >
                                            : {username}
                                        </Text>
                                    </Box>
                                </Skeleton>
                            </Flex>
                            <Flex
                                gap={'1'}
                                w={'100%'}
                            >
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Text
                                        color={"white"}
                                        fontSize={'sm'}
                                        w={'65px'}
                                        textAlign={'start'}
                                    >
                                        Email
                                    </Text>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Box
                                        w={{ lg:'120px', xl:'175px'}}
                                    >
                                        <Text
                                            textAlign={'start'}
                                            color={'white'}
                                            fontSize={'sm'}
                                            overflow={'hidden'}
                                            whiteSpace={'nowrap'}
                                            textOverflow={'ellipsis'}
                                            display={'block'}
                                        >
                                            : {email} 
                                        </Text>
                                    </Box>
                                </Skeleton>
                            </Flex>
                            <Flex
                                gap={'1'}
                                w={'100%'}
                            >
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Text
                                        color={"white"}
                                        fontSize={'sm'}
                                        w={'65px'}
                                        textAlign={'start'}
                                    >
                                        Role
                                    </Text>
                                </Skeleton>
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Box
                                        w={'100%'}
                                    >
                                        <Text
                                            textAlign={'start'}
                                            color={'white'}
                                            fontSize={'sm'}
                                            overflow={'hidden'}
                                            whiteSpace={'nowrap'}
                                            textOverflow={'ellipsis'}
                                            display={'block'}
                                        >
                                            : {role}
                                        </Text>
                                    </Box>
                                </Skeleton>
                            </Flex>
                        </Flex>
                        <FormControl
                            pt={'2'}
                        >
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
                                    onClick={onBtnReset}
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

export default ResetPassword;