import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Flex,
    Skeleton,
    Table,
    TableContainer,
    Thead,
    Text,
    Th,
    Tr,
    Td,
    Tbody
} from '@chakra-ui/react';
import Pagination from '../components/Pagination';
import axios from 'axios';
import Payment from '../components/Payment';
import TransactionDetails from '../components/TransactionDetails';

function Transaction() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(14);
    const [sortby, setSortby] = useState('id');
    const [order, setOrder] = useState('DESC');
    const [transactionList, setTransactionList] = useState([]);
    const [totalData, setTotalData] = useState(0);

    let getTransaction = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/recent-activity?page=${page}&size=${size}&sortby=${sortby}&order=${order}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactionList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTransaction();
    }, [page, size, sortby, order]);

    const printTransaction = () => {
        return transactionList.map((val, idx) => {
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
                        px={'1'}
                    >
                        <Flex
                            w={'95px'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            display={'block'}
                        >
                            {val.user}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'center'}
                        >
                            <Flex
                                w={'65px'}
                                justifyContent={'center'}
                                color={val.status =='Incomplete' ? 'red.500' : 'green.500'}
                            >
                                {val.transaction_date}
                            </Flex>
                        </Flex>
                    </Td>
                    <Td
                        color={val.status =='Incomplete' ? 'red.500' : 'green.500'}
                    >
                        {val.total_price_tax_sum}
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'center'}
                        >
                            <Flex
                                w={'65px'}
                                justifyContent={'center'}
                                color={val.status =='Incomplete' ? 'red.500' : 'green.500'}
                            >
                                {val.status}
                            </Flex>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <TransactionDetails
                            id={val.id}
                            user={val.user}
                            date={val.transaction_date}
                            itemNumber={itemNumber}
                        />
                    </Td>
                </Tr>
            )
        })
    }

    const paginate = pageNumber => {
        setPage(pageNumber)
    }

    const onSuccess = () => {
        getTransaction();
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
                h={'100vh'}
                w={'94vw'}
                flexDir={'row'}
            >
                <Flex
                    h={'100vh'}
                    w={'64vw'}
                    flexDir={'column'}
                    px={'4'}
                >
                    <Flex
                        flexDir={'column'}
                        h={'90vh'}
                        w={'100%'}
                    >
                        <Flex
                            h={'8vh'}
                            w={'100%'}
                            justifyContent={'start'}
                            alignItems={'center'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text
                                    textAlign={'center'}
                                    fontWeight={'semibold'}
                                    fontSize={'xl'}
                                >
                                    Transaction List
                                </Text>
                            </Skeleton>
                        </Flex>
                        <Flex
                            h={'82vh'}
                            w={'100%'}
                            border={'1px'}
                            rounded={'xl'}
                            px={'2'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                rounded={'xl'}
                                w={'100%'}
                            >
                                <TableContainer
                                    h={'100%'}
                                    w={'100%'}
                                    whiteSpace={'pre-line'}
                                    borderBottomColor={'white'}
                                >
                                    <Table
                                        variant={'simple'}
                                        size={'sm'}
                                        maxW={'100%'}
                                        fontWeight={'light'}
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th
                                                    textAlign={'center'}
                                                    fontWeight={'light'}
                                                >
                                                    Number
                                                </Th>
                                                <Th
                                                    px={'1'}
                                                    textAlign={'start'}
                                                    fontWeight={'light'}
                                                >
                                                    Cashier
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                    fontWeight={'light'}
                                                >
                                                    Date
                                                </Th>
                                                <Th
                                                    letterSpacing={'tight'}
                                                    fontWeight={'light'}
                                                >
                                                    Total Transaction
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                    fontWeight={'light'}
                                                >
                                                    Status
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                    fontWeight={'light'}
                                                >
                                                    Details
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {printTransaction()}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Skeleton>
                        </Flex>
                    </Flex>
                    <Flex
                        h={'10vh'}
                        w={'100%'}
                    >
                        <Flex
                            w={'100%'}
                            justifyContent={'end'}
                            alignItems={'center'}
                            px={'1'}
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
                <Flex
                    h={'100vh'}
                    w={'30vw'}
                    bg={'black'}
                    flexDir={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    px={'4'}
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
                                    fontSize={'lg'}
                                >
                                    Select Payment Method
                                </Text>
                            </Skeleton>
                        </Box>
                    </Flex>
                    <Box
                        h={'92vh'}
                        w={'100%'}
                    >
                        <Flex
                            h={'90vh'}
                            mt={'2'}
                            mb={'1'}
                        >
                            <Payment
                                onSuccess={onSuccess}
                            />
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default Transaction;