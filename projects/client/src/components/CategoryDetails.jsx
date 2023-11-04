import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    Skeleton,
    Button,
    Text,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";

function CategoryDetails(props) {
    let token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(100);
    const [order, setOrder] = useState('ASC');
    const [category, setCategory] = useState(props.category);

    const handleClose = () => {
        setCategory(props.category);
        props.handleCloseComponent();
    }

    // Edit Category
    const onBtnEdit = async () => {
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
            let response = await axios.patch(`http://localhost:8000/api/category/edit/${props.id}`, {
                category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Edit Category',
                    description: response.data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                handleClose();
                setTimeout(() => {
                    props.onSuccess();
                    handleClose();
                }, 1500)
                setLoading(false);
            } else {
                setTimeout(() => {
                    toast({
                        position: 'top',
                        title: 'Edit category',
                        description: 'Fail to edit category',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                }, 1500)
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                toast({
                    position: 'top',
                    title: 'Edit category',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                })
            }, 1500)
            setLoading(false);
        }
    }

    // Get Product
    const [productList, setProductList] = useState([]);

    const getProduct = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/product/list?&size=${size}&order=${order}&category=${props.category}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProduct();
    }, [size, order, props.category, props.id]);

    const printProduct = () => {
        return productList.map((val) => {
            return (
                <Tr>
                    <Td
                        color={'white'}
                        whiteSpace={'nowrap'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        display={'block'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            w={'max-content'}
                        >
                            <Text
                                fontSize={'sm'}
                            >
                                {val.name}
                            </Text>
                        </Skeleton>
                    </Td>
                </Tr>
            )
        })
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
                        h={'10vh'}
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
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                    </Box>
                    <Box
                        h={'70vh'}
                        w={'100%'}
                        pt={'2'}
                    >
                        <Flex>
                            <TableContainer
                                w={'100%'}
                            >
                                <Table
                                    size={'sm'}
                                    variant={'unstyled'}
                                    maxW={'100%'}
                                >
                                    <Thead>
                                        <Tr>
                                            <Th
                                                textAlign={'start'}
                                                color={'white'}
                                                textTransform={'capitalize'}
                                            >
                                                <Skeleton
                                                    isLoaded={isLoaded}
                                                    w={'max-content'}
                                                >
                                                    <Text>
                                                        Products in this category :
                                                    </Text>
                                                </Skeleton>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Box
                                        h={'60vh'}
                                        overflow={'auto'}
                                        position={'relative'}
                                        scrollBehavior={'smooth'}
                                        sx={{
                                            '::-webkit-scrollbar': {
                                                width: '0'
                                            },
                                        }}
                                    >
                                        <Tbody>
                                            {printProduct()}
                                        </Tbody>
                                    </Box>
                                </Table>
                            </TableContainer>
                        </Flex>
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

export default CategoryDetails;