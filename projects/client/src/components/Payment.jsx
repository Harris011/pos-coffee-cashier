import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Flex, 
    Skeleton,
    Text,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import PaymentCard from './PaymentCard';
import PulseLoader from "react-spinners/PulseLoader";
import { BsCashCoin } from 'react-icons/bs';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function Payment(props) {
    const token = localStorage.getItem('coffee_login');
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [latestTransaction, setLatestTransaction] = useState([]);
    const [cashier, setCashier] = useState("");
    const [date, setDate] = useState("");
    const [bills, setBills] = useState("");
    const [transactionId, setTransactionId] = useState("");

    const paymentMetodData = {
        cash: {
            title: "Cash",
            description: "Pay with cash",
            icon: BsCashCoin,
            disable: false,
            check: true
        },
        visa: {
            title: "Visa",
            description: "Enter card data",
            icon: FaCcVisa,
            disable: true,
            check: false
        },
        mastercard: {
            title: "Mastercard",
            description: "Enter card data",
            icon: FaCcMastercard,
            disable: true,
            check: false
        },
    }

    // get latest Transactions
    const getlatestTransactions = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/latest-transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLatestTransaction(response.data.data);

            if (response.data.data.length > 0) {
                setCashier(response.data.data[0].user);
                setDate(response.data.data[0].transaction_date);
                setBills(response.data.data[0].total_price_sum);
                setTransactionId(response.data.data[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getlatestTransactions();
    }, []);

    // update the transaction
    const onBtnUpdate = async () => {
        try {
            setLoading(true);
            let response = await axios.patch(`http://localhost:8000/api/transaction/pay/${transactionId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                toast({
                    position: 'top',
                    title: 'Transaction',
                    description: response.data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                setTimeout(() => {
                    props.onSuccess();
                    getlatestTransactions();
                    setCashier('');
                    setDate('');
                    setBills('');
                }, 1500)
                setLoading(false)
            } else {
                setTimeout(() => {
                    toast({
                        position: 'top',
                        title: 'Transaction',
                        description: response.data.message,
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
                    title: 'Transaction',
                    description: latestTransaction.length === 0 ? "Transaction not found" : error.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                })
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
            w={'100%'}
        >
            <Flex
                h={'90vh'}
                w={'100%'}
                flexDir={'column'}
            >
                <Flex
                    h={'60vh'}
                    w={'100%'}
                    flexDir={'column'}
                    alignItems={'start'}
                >
                    <Flex
                        h={'60vh'}
                        w={'100%'}
                        flexDir={'column'}
                        gap={'1'}
                        py={'1.5'}
                    >
                        {Object.keys(paymentMetodData).map((method) => {
                            return (
                                <PaymentCard
                                    key={method}
                                    title={paymentMetodData[method].title}
                                    description={paymentMetodData[method].description}
                                    icon={paymentMetodData[method].icon}
                                    disable={paymentMetodData[method].disable}
                                    check={paymentMetodData[method].check}
                                />
                            )
                        })}
                    </Flex>
                </Flex>
                <Flex
                    h={'30vh'}
                    w={'100%'}
                    flexDir={'column'}
                    px={'5'}
                >
                    <Skeleton
                        isLoaded={isLoaded}
                        h={'20vh'}
                        w={'100%'}
                        rounded={'lg'}
                    >
                        <Flex
                            h={'20vh'}
                            w={'100%'}
                            bg={'white'}
                            flexDir={'column'}
                            justifyContent={'space-between'}
                            px={'4'}
                            py={'1'}
                            border={'1px'}
                            borderColor={'white'}
                            rounded={'lg'}
                            mt={'1'}
                        >
                            <Flex
                                h={'100%'}
                                w={'100%'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'normal'}   
                                    color={'black'}
                                >
                                    Cashier :
                                </Text>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'semibold'}
                                    textTransform={'capitalize'}
                                    color={cashier ? 'black' : 'gray.400'}
                                >
                                    {cashier || "N/A"}
                                </Text>
                            </Flex>
                            <Flex
                                h={'100%'}
                                w={'100%'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'normal'}   
                                    color={'black'}
                                >
                                    Date : 
                                </Text>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'semibold'}
                                    color={date ? 'black' : 'gray.400'}
                                >
                                    {date || "N/A"}
                                </Text>
                            </Flex>
                            <Flex
                                h={'100%'}
                                w={'100%'}
                                justifyContent={'space-between'}
                                alignItems={'baseline'}
                                pt={'1'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'normal'}   
                                    color={'black'}
                                >
                                    Total Bills : 
                                </Text>
                                <Text
                                    fontSize={'md'}
                                    fontWeight={'semibold'}
                                    color={bills ? 'black' : 'gray.400'}
                                >
                                    {bills || "N/A"}
                                </Text>
                            </Flex>
                        </Flex>
                    </Skeleton>
                    <Flex
                        h={'10vh'}
                        w={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        gap={'12'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'lg'}
                        >
                            <Button
                                size={'sm'}
                                bg={'white'}
                                color={'white'}
                                rounded={'lg'}
                                leftIcon={<AiOutlineArrowLeft/>}
                                bgColor={'green.500'}
                                onClick={() => {navigate('/dashboard', {replace: true})}}
                            >
                                Back
                            </Button>
                        </Skeleton>
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'lg'}
                        >
                            <Button
                                size={'sm'}
                                bg={'white'}
                                color={'black'}
                                rounded={'lg'}
                                isLoading={loading}
                                spinner={<PulseLoader size={8} color='black' />}
                                onClick={onBtnUpdate}
                            >
                                Pay Now
                            </Button>
                        </Skeleton>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default Payment;