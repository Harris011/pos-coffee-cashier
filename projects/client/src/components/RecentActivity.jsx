import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Flex, 
    TableContainer,
    Tbody,
    Table,
    Thead,
    Td,
    Th,
    Tr,
    Text,
    Skeleton
} from '@chakra-ui/react';
import axios from 'axios';
import Pagination from './Pagination';

function RecentActivity() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(2);
    const [sortby, setSortby] = useState('id');
    const [order, setOrder] = useState('DESC');
    const [activityList, setActivityList] = useState([]);
    const [totalData, setTotalData] = useState(0);

    let getActivity = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/recent-activity?page=${page}&size=${size}&sortby=${sortby}&order=${order}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setActivityList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getActivity();
    }, [page, size, sortby, order]);

    const printActivity = () => {
        return activityList.map((val, idx) => {
            const itemNumber = (page * size) + idx + 1;
            return (
                <Tr
                    key={val.id}
                >
                    <Td
                        textAlign={'center'}
                    >
                        #{itemNumber}
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        {val.user}
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        {val.transaction_date}
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            w={'50%'}
                            justifyContent={'start'}
                            mx={'auto'}
                            px={'2'}
                        >
                            {val.total_price_sum}
                        </Flex>
                    </Td>
                </Tr>
            )
        })
    }

    const paginate = pageNumbers => {
        setPage(pageNumbers);
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
            h={'27vh'}
            w={'100%'}
        >
            <Flex
                flexDir={'column'}
                h={'27vh'}
                w={'100%'}
            >
                <Flex
                    h={'17vh'}
                    bg={'gray.50'}
                    roundedTop={'lg'}
                >
                    {/* Table */}
                    <Flex
                        h={'100%'}
                        w={'100%'}
                        px={'2'}
                        flexDir={'column'}
                        gap={'1'}
                    >
                        <Flex
                            px={'2'}
                            h={'1.5vh'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'semibold'}
                                    style={{ textDecoration: 'underline' }}
                                >
                                    Recent Transaction Activity:
                                </Text>
                            </Skeleton>
                        </Flex>
                        <Skeleton
                            isLoaded={isLoaded}
                            h={'15.5vh'}
                            borderBottom={'1px'}
                            borderBottomColor={'blackAlpha.200'}
                            px={'2'}
                        >
                            <TableContainer
                                w={'100%'}
                                h={'100%'}
                                whiteSpace={'pre-line'}
                                borderBottomColor={'blackAlpha.200'}
                            >
                                <Table
                                    variant={'unstyled'}
                                    size={'sm'}
                                    maxW={'100%'}
                                    fontWeight={'light'}
                                >
                                    <Thead>
                                        <Tr>
                                            <Th
                                                textAlign={'center'}
                                                fontWeight={'normal'}
                                            >
                                                Number
                                            </Th>
                                            <Th
                                                textAlign={'center'}
                                                fontWeight={'normal'}
                                            >
                                                Cashier
                                            </Th>
                                            <Th
                                                textAlign={'center'}
                                                fontWeight={'normal'}
                                            >
                                                Date
                                            </Th>
                                            <Th
                                                textAlign={'center'}
                                                fontWeight={'normal'}
                                            >
                                                Total Transaction
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {printActivity()}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Skeleton>
                    </Flex>
                </Flex>
                <Flex
                    h={'10vh'}
                    bg={'gray.50'}
                    roundedBottom={'lg'}
                    w={'100%'}
                    mb={'1'}
                    px={'1'}
                >
                    <Flex
                        w={'100%'}
                        justifyContent={'end'}
                        alignItems={'center'}
                    >
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
            </Flex>
        </Box>
     );
}

export default RecentActivity;