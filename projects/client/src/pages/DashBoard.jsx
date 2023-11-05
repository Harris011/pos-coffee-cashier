import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    SimpleGrid,
    Skeleton,
    useToast
} from '@chakra-ui/react';
import Header from '../components/Header';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Order from '../components/Order';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../Reducers/transaction';

function DashBoard() {
    const token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(8);
    const [sortby, setSortby] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [productList, setProductList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transaction.transactions);

    let getProduct = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/product/product-list?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${name}&category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProduct();
    }, [page, size, sortby, order, name, category]);

    const handleSelectedProduct = (productDetail) => {
        const existItem = transactions.find(item => item.id === productDetail.id);

        if (!existItem) {
            dispatch(addItem(productDetail));
        } else {
            return toast({
                position: 'top',
                title: 'Current Order',
                description: 'This item is already in the current order',
                status: 'info',
                duration: 1500,
                isClosable: true
            })
        }
    }

    const onSuccess = () => {
        getProduct();
    }

    const printProduct = () => {
        return productList.map((val) => {
            return (
                <ProductCard
                    key={val.uuid}
                    uuid={val.uuid}
                    id={val.id}
                    name={val.name}
                    image={val.product_image}
                    stock={val.stock}
                    price={val.price}
                    onSelectedProduct = {handleSelectedProduct}
                />
            )
        });
    }

    // Get Category List
    const [categoryList, setCategoryList] = useState([]);

    const getCategory = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/category/category-list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategoryList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    const printCategory = () => {
        return categoryList.map((category) => (
            <Skeleton
                isLoaded={isLoaded}
                key={category.id}
            >
                <Button
                    key={category.id}
                    value={category.id}
                    size={'xs'}
                    border={'1px'}
                    borderColor={'black'}
                    onClick={() => {
                        setCategory(category?.category);
                      }}
                    textTransform={'capitalize'}
                >
                    {category?.category}
                </Button>
            </Skeleton>
        ));
    }

    const paginate = pageNumbers => {
        setPage(pageNumbers)
    }

    const handleSearch = (name) => {
        setName(name);
    }

    const handleSortOrder = (sort, order) => {
        setSortby(sort);
        setOrder(order);
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
            h={'100vh'}
            w={'94vw'}
        >
            <Flex
                flexDir={'row'}
                justifyContent={'center'}
                alignContent={'center'}
            >
                <Flex
                    w={'75%'}
                    h={'100vh'}
                    flexDir={'column'}
                    px={'4'}
                >
                    <Header
                        onSearch={handleSearch}
                        onSortOrder={handleSortOrder}
                    />
                    <Flex
                        flexDir={'column'}
                        h={'84vh'}
                        >
                        <Flex
                            h={'6vh'}
                            pt={'2'}
                            w={'100%'}
                            alignItems={'baseline'}
                            justifyContent={'space-between'}
                        >
                                <Flex
                                    gap={'2'}
                                    overflowX={'auto'}
                                    overflowY={'hidden'}
                                    whiteSpace={'nowrap'}
                                    maxW={category ? '86%' : '100%'}
                                    scrollBehavior={'smooth'}
                                    sx={{
                                        '::-webkit-scrollbar': {
                                            width: '0'
                                        },
                                    }}
                                    mr={'1'}
                                    px={'0.5'}
                                >
                                    {printCategory()}
                                </Flex>
                                <Flex
                                    maxW={category ? '14%' : 'none'}
                                >
                                    {category && (
                                        <Button
                                            size={'xs'}
                                            colorScheme={'red'}
                                            border={'1px'}
                                            borderColor={'black'}
                                            letterSpacing={'tight'}
                                            onClick={() => setCategory('')}
                                            ml={'1'}
                                            maxW={'fit-content'}
                                        >
                                            Clear category
                                        </Button>
                                    )}
                                </Flex>
                        </Flex>
                        <Flex
                            h={'76vh'}
                            w={'100%'}
                            py={'1'}
                            position={'relative'}
                        >
                            <SimpleGrid
                                columns={'4'}
                                rows={'2'}
                                gap={'2'}
                                minW={'0'}
                                w={'100%'}
                            >
                                {
                                    totalData ?
                                    printProduct()
                                    :
                                    <Flex
                                        position={'absolute'}
                                        top={'50%'}
                                        left={'50%'}
                                        transform={'translate(-50%, -50%)'}
                                    >
                                        <Text>
                                            No Products Found
                                        </Text>
                                    </Flex>
                                }
                            </SimpleGrid>
                        </Flex>
                    </Flex>
                    <Flex
                        h={'10vh'}
                        justifyContent={'space-between'}
                        px={'1'}
                        alignItems={'center'}
                        mb={'1'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Flex
                                flexDir={'row'}
                                alignItems={'baseline'}
                                w={'110px'}
                                justifyContent={'space-between'}
                            >
                                <Flex
                                    w={'18%'}
                                    justifyContent={'end'}
                                >
                                    <Text>
                                        {Math.min(productList.length)}
                                    </Text>
                                </Flex>
                                <Text>
                                    of {totalData} results
                                </Text>
                            </Flex>
                        </Skeleton>
                        <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Pagination
                                page={page}
                                size={size}
                                totalData={totalData}
                                paginate={paginate}
                            />
                        </Skeleton>
                    </Flex>
                </Flex>
                <Flex
                    w={'25%'}
                    h={'100vh'}
                    bg={'black'}
                    flexDir={'column'}
                    justifyContent={'center'}
                    alignContent={'center'}
                    px={'2'}
                >
                    <Flex
                        h={'8vh'}
                        w={'100%'}
                        alignItems={'center'}
                        borderBottom={'1px'}
                        borderBottomColor={'white'}
                    >
                        <Box
                            px={'2'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text
                                    color={'white'}
                                    textAlign={'start'}
                                    fontWeight={'semibold'}
                                >
                                    Current Orders :
                                </Text>
                            </Skeleton>
                        </Box>
                    </Flex>
                    <Box
                        h={'92vh'}
                    >
                        <Flex
                            h={'90vh'}
                            mt={'2'}
                            mb={'1'}
                        >
                            <Order
                                onSuccess={onSuccess}
                            />
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default DashBoard;