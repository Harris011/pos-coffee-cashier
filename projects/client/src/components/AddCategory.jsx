import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    Skeleton ,
    Button,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";

function AddCategory(props) {
    let token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');

    const handleClose = () => {
        setCategory('');
        props.handleCloseComponent();
    }

    const onBtnCreate = async () => {
        try {
            if (category == '') {
                return toast({
                    position: 'top',
                    title: 'Create new category',
                    description: 'Please complete required fields',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            }

            setLoading(true);

            let response = await axios.post(`http://localhost:8000/api/category/create`, {
                category: category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Create new category',
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
                        description: 'Fail to create new category',
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
            px={'1.5'}
            w={'100%'}
            rounded={'xl'}
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
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                >
                                    Category name
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
                                    placeholder={`Enter the Category's Name`}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
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
                                        props.handleCloseComponent();
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

export default AddCategory;