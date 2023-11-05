import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    CardBody,
    Flex,
    Select, 
    Skeleton, 
    Text
} from '@chakra-ui/react';
import axios from 'axios';

function TotalRevenue() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [revenueYearlyList, setRevenueYearlyList] = useState([]);
    const [revenueMonthlyList, setRevenueMonthlyList] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('en-UK', {month: 'long'});
        const currentYear = currentDate.getFullYear();
        setSelectedMonth(`${currentMonth} ${currentYear}`);
        setSelectedYear(`${currentYear}`);
    }, []);

    // Yearly Revenue
    let getYearlyRevenue = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/yearly-revenue`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRevenueYearlyList(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getYearlyRevenue();
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    }

    const filteredYearlyRevenue = revenueYearlyList.filter((revenue) => {
        return `${revenue.year === selectedYear}`
    })

    // Monthly Revenue
    let getMonthlyRevenue = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/monthly-revenue`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRevenueMonthlyList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMonthlyRevenue();
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    }

    const filteredMonthlyRevenue = revenueMonthlyList.filter((revenue) => {
        return `${revenue.month} ${revenue.year}` === selectedMonth;
    });

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
            h={'50vh'}
            w={'100%'}
        >
            <Flex
                flexDir={'column'}
                justifyContent={'space-between'}
            >
                <Flex
                    h={'8vh'}
                    w={'100%'}
                    justifyContent={'end'}
                    alignItems={'flex-end'}
                    pr={'2'}
                >
                    <Skeleton
                        isLoaded={isLoaded}
                    >
                        <Text
                            fontWeight={'semibold'}
                            style={{ textDecoration: 'underline' }}
                            fontSize={'md'}
                        >
                            Total Revenue
                        </Text>
                    </Skeleton>
                </Flex>
                <Flex
                    h={'42vh'}
                    w={'100%'}
                    py={'1.5'}
                    flexDir={'column'}
                    gap={'2'}
                >
                    <Card
                        bg={'black'}
                        rounded={'lg'}
                        h={'14vh'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'lg'}
                            h={'100%'}
                        >
                            <CardBody
                                my={'-1.5'}
                            >
                                <Flex
                                    flexDir={'column'}
                                    gap={'2'}
                                    mx={'-3'}
                                >
                                    <Flex
                                        flexDir={'row'}
                                        justifyContent={'start'}
                                        alignItems={'baseline'}
                                        w={'100%'}
                                        px={'2'}
                                        gap={'1.5'}
                                    >
                                        <Box>
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight={'normal'}
                                                letterSpacing={'tight'}
                                                color={'white'}
                                            >
                                                Year of
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Select
                                                size={'sm'}
                                                variant={'unstyled'}
                                                letterSpacing={'tight'}
                                                color={'white'}
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                            >
                                                {
                                                    revenueYearlyList.map((revenue) => (
                                                        <option 
                                                            key={`${revenue.year}`}
                                                            style={{ color: 'black' }}
                                                        >
                                                            {revenue.year}
                                                        </option>
                                                    ))
                                                }
                                            </Select>
                                        </Box>
                                    </Flex>
                                    <Flex
                                        alignItems={'center'}
                                        gap={'2'}
                                        justifyContent={'start'}
                                        px={'2'}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                            fontWeight={'medium'}
                                            color={'white'}
                                        >
                                            Total :
                                        </Text>
                                        {
                                            filteredYearlyRevenue.map((revenue) => (
                                                <Text
                                                    key={`${revenue.year}`}
                                                    fontWeight={'semibold'}
                                                    color={'white'}
                                                >
                                                    {revenue.total_revenue}
                                                </Text>
                                            ))
                                        }
                                    </Flex>
                                </Flex>
                            </CardBody>
                        </Skeleton>
                    </Card>
                    <Card
                        bg={'black'}
                        rounded={'lg'}
                        h={'14vh'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'lg'}
                            h={'100%'}
                        >
                            <CardBody
                                my={'-1.5'}
                            >
                                <Flex
                                    flexDir={'column'}
                                    gap={'2'}
                                    mx={'-3'}
                                >
                                    <Flex
                                        flexDir={'row'}
                                        justifyContent={'start'}
                                        alignItems={'baseline'}
                                        w={'100%'}
                                        px={'2'}
                                        gap={'1.5'}
                                    >
                                        <Box>
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight={'normal'}
                                                letterSpacing={'tight'}
                                                color={'white'}
                                            >
                                                Month of
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Select
                                                size={'sm'}
                                                variant={'unstyled'}
                                                color={'white'}
                                                letterSpacing={'tight'}
                                                value={selectedMonth}
                                                onChange={handleMonthChange}
                                            >
                                                {
                                                    revenueMonthlyList.map((revenue) => (
                                                        <option
                                                            key={`${revenue.month}-${revenue.year}`}
                                                            style={{ color: 'black' }}
                                                        >
                                                            {revenue.month} {revenue.year}
                                                        </option>
                                                    ))
                                                }
                                            </Select>
                                        </Box>
                                    </Flex>
                                    <Flex
                                        alignItems={'center'}
                                        gap={'2'}
                                        justifyContent={'start'}
                                        px={'2'}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                            fontWeight={'medium'}
                                            color={'white'}
                                        >
                                            Total :
                                        </Text>
                                        {filteredMonthlyRevenue.map((revenue) => (
                                            <Text 
                                                key={`${revenue.month}-${revenue.year}`}
                                                fontWeight={'semibold'}
                                                color={'white'}
                                            >
                                                {revenue.total_revenue}
                                            </Text>
                                        ))}
                                    </Flex>
                                </Flex>
                            </CardBody>
                        </Skeleton>
                    </Card>
                </Flex>
            </Flex>
        </Box>
     );
}

export default TotalRevenue;