import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Flex, 
    Table, 
    TableContainer, 
    Tbody, 
    Text,
    Th,
    Thead,
    Tr,
    Td,
    Skeleton
} from '@chakra-ui/react';
import axios from 'axios';

function BestSellers() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortby, setSortby] = useState('total_quantity_sum');
    const [order, setOrder] = useState('DESC');
    const [productList, setProductList] = useState([]);

    const getProduct = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/popular-product?sortby=${sortby}&order=${order}`, {
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
    }, [sortby, order]);

    const printProduct = () => {
        return productList.map((val) => {
            return (
                <Tr
                    key={val.product_id}
                >
                    <Td
                        whiteSpace={'nowrap'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        display={'block'}
                    >
                        <Text
                            fontSize={'sm'}
                            color={'white'}
                        >
                            {val.product.name}
                        </Text>
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
            h={'100%'}
            w={'100%'}
            bg={'black'}
            rounded={'lg'}
        >
            <Skeleton
                isLoaded={isLoaded}
                rounded={'lg'}
                h={'100%'}
            >
                <Flex
                    pt={'1'}
                    flexDir={'column'}
                    h={'100%'}
                    w={'100%'}
                >
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
                                        textTransform={'capitalize'}
                                    >
                                        <Text
                                            color={'white'}
                                            style={{ textDecoration: 'underline' }}
                                        >
                                            Best Sellers Products :
                                        </Text>
                                    </Th>
                                </Tr>
                            </Thead>
                            {/* <Box
                                h={'55vh'}
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
                            </Box> */}
                        </Table>
                    </TableContainer>
                    <TableContainer
                        w={'100%'}
                        style={{ height: '55vh', overflow: 'auto' }}
                    >
                        <Table
                            size={'sm'}
                            variant={'unstyled'}
                            maxW={'100%'}
                        >
                            <Tbody>
                                {printProduct()}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </Skeleton>
        </Box>
     );
}

export default BestSellers;