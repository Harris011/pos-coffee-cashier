import React, { useEffect, useState } from 'react';
import {
    Box, 
    Button, 
    Flex,
    Skeleton,
    Text,
    useToast
} from '@chakra-ui/react';
import OrderProductCard from './OrderProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, updateQuantity } from '../Reducers/transaction';
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from 'react-router-dom';

function Order(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const transactions = useSelector((state) => state.transaction.transactions);
    const [currentTransaction, setCurrentTransaction] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const transactionItem = transactions.map(item => {
            return {
                id: item.id,
                price: item.price,
                quantity: item.quantity
            };
        });
        setCurrentTransaction(transactionItem)
    }, [transactions]);

    const handleQuantityChange = (productId, newQuantity) => {
        const updateTransactions = transactions.map((item) => {
            if (item.id === productId) {
                const updateQuantity = Math.min(Math.max(1, newQuantity), item.stock);
                return {...item, quantity: updateQuantity};
            }
            return item;
        });
        dispatch(updateQuantity({id: productId, quantity: newQuantity}));
    };

    useEffect(() => {
        currentTransaction.forEach(item => {
            handleQuantityChange(item.productId, item.newQuantity);
        });
    }, []);

    const printTransaction = () => {
        return transactions.map((val) => {
            return (
                <OrderProductCard
                    key={val.id}
                    id={val.id}
                    name={val.name}
                    image={val.image}
                    stock={val.stock}
                    price={val.price}
                    quantity={val.quantity}
                    onQuantityChange={handleQuantityChange}
                />
            )
        });
    }

    // format currency
    function formatCurrency(price) {
        return price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // calculate subtotal per product
    const calculateSubTotal = () => {
        let subtotals = 0;
        currentTransaction.forEach((item) => {
            const price = parseFloat(item.price.replace(/[^0-9,-]+/g, '').replace(',', '.'));
            subtotals += (price * item.quantity);
        });
        return formatCurrency(parseInt(subtotals));
    };

    const subtotal = calculateSubTotal();

    // calculate taxrate per product
    const calculateTaxRate = () => {
        let productTax = 0;
        currentTransaction.forEach((item) => {
            const price = parseFloat(item.price.replace(/[^0-9,-]+/g, '').replace(',', '.'));
            const taxRate = 0.10 * price
            productTax += (taxRate * item.quantity);
        });
        return formatCurrency(parseInt(productTax));
    };

    const taxRate = calculateTaxRate();

    // calculate the total
    const calculateTotal = (subtotalString, productTaxString) => {
        const subtotal = parseFloat(subtotalString.replace(/[^0-9,-]+/g, '').replace(',', '.'));
        const tax = parseFloat(productTaxString.replace(/[^0-9,-]+/g, '').replace(',', '.'));
        
        const total = subtotal + tax;
        
        return formatCurrency(parseInt(total));
    };
    
    const total = calculateTotal(subtotal, taxRate);

    useEffect(() => {
        const subtotal = calculateSubTotal();
        const taxRate = calculateTaxRate();
        const total = calculateTotal(subtotal, taxRate);
    }, [transactions]);

    
    // transaction details
    const transactionDetails = currentTransaction.map(item => {
        return {
            product_id: item.id,
            total_quantity: item.quantity
        }
    });
    
    const onSuccessClearState = () => {
        for (const item of currentTransaction) {
            dispatch(removeItem({id: item.id}));
        }
    };

    // create transaction
    const onBtnCreate = async () => {
        try {
            if (!token) {
                return toast({
                    position: 'top',
                    title: 'Create Transaction',
                    description: 'Unauthorized Access',
                    duration: 2000,
                    isClosable: true
                })
            }
            setLoading(true);
            let response = await axios.post(`http://localhost:8000/api/transaction/create`, {
                transactionDetails
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Create Transaction',
                    description: 'Transaction created successfully.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                setTimeout(() => {
                    onSuccessClearState();
                    props.onSuccess();
                    navigate('/transaction', {replace: true});
                }, 1500)
                setLoading(false);
            } else {
                setTimeout(() => {
                    toast({
                        position: 'top',
                        title: 'Create Transaction',
                        description: 'Failed to create a new transaction!',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                }, 1500)
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                toast({
                    position: 'top',
                    title: 'Create Transaction',
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
                        overflowY={'scroll'}
                        sx={{'::-webkit-scrollbar': {display: 'none'}}}
                    >
                        {printTransaction()}
                    </Flex>
                </Flex>
                <Flex
                    h={'30vh'}
                    w={'100%'}
                    flexDir={'column'}
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
                            px={'2'}
                            py={'1'}
                            border={'1px'}
                            borderColor={'white'}
                            rounded={'lg'}
                            mt={'1'}
                        >
                            <Flex
                                flexDir={'column'}
                                h={'70%'}
                                justifyContent={'start'}
                                alignContent={'start'}
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
                                        color={'gray.500'}
                                    >
                                        Subtotal
                                    </Text>
                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'normal'}
                                    >
                                        {subtotal}
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
                                        color={'gray.500'}
                                    >
                                        Tax (10%)
                                    </Text>
                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'normal'}
                                    >
                                        {taxRate}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                h={'30%'}
                                w={'100%'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                borderTop={'1.5px'}
                                borderColor={'gray.500'}
                                borderTopStyle={'dashed'}
                            >
                                <Text
                                    fontSize={'md'}
                                    fontWeight={'normal'}
                                >
                                    Total
                                </Text>
                                <Text
                                    fontSize={'md'}
                                    fontWeight={'normal'}
                                >
                                    {total}
                                </Text>
                            </Flex>
                        </Flex>
                    </Skeleton>
                    <Flex
                        h={'10vh'}
                        w={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'lg'}
                        >
                            <Button
                                size={'sm'}
                                bgColor={'white'}
                                color={'black'}
                                fontWeight={'normal'}
                                rounded={'lg'}
                                isLoading={loading}
                                spinner={<PulseLoader size={8} color='black' />}
                                onClick={onBtnCreate}
                            >
                                Print Receipt
                            </Button>
                        </Skeleton>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default Order;