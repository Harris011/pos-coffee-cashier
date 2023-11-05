import React, { useEffect, useState } from 'react';
import { 
    Box,
    Button,
    Flex,
    Input,
    Skeleton
} from '@chakra-ui/react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    defaults
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SalesChart() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const date = new Date();
    const dateOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    };

    // Date in a week
    const [datesWeek, setDatesWeek] = useState([]);

    let getDatesInWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);

        const dates = [];
        for (let i = 0; i < 7 ; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const formattedDate = date.toLocaleDateString('en-UK', dateOptions);
            dates.push(formattedDate);
        }
        return setDatesWeek(dates);
    }

    useEffect(() => {
        getDatesInWeek()
    }, []);

    // Date in a month
    const [datesMonth, setDatesMonth] = useState([]);

    const getAllDatesInMonth = (year, month) => {
        let startDate = new Date(year, month, 1);
        let endDate = new Date(year, month + 1, 0);

        const dates = [];
        while (startDate <= endDate) {
            const formattedDate = startDate.toLocaleDateString('en-UK', dateOptions);
            dates.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1);
        }
        setDatesMonth(dates);
    }

    useEffect(() => {
        const year = date.getFullYear();
        const month = date.getMonth();
        getAllDatesInMonth(year, month);
    }, []);

    // Date between
    const [datesBetween, setDatesBetween] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getDatesBetween = (startDate, endDate) => {
        const currentDate = new Date(startDate.getTime());
        const dates = [];

        while (currentDate <= endDate) {
            const formattedDate = currentDate.toLocaleDateString('en-UK', dateOptions);
            dates.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates
    };

    const handleDatesSearch = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate)
            const datesInBetween = getDatesBetween(start, end)
            setDatesBetween(datesInBetween)
        }
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setDatesBetween([]);
        const year = date.getFullYear();
        const month = date.getMonth();
        getAllDatesInMonth(year, month);
        document.getElementById('startDateInput').value = '';
        document.getElementById('endDateInput').value = '';
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins : {
            legend:{
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 10
                    }
                }
            },
            title: {
                display: true,
                text: 'Sales Report Monthly'
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Dates',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                        weight: 'normal'
                    }
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sales',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
            },
        },
    };

    // Data sales
    const [sortby, setSortby] = useState('id');
    const [order, setOrder] = useState('ASC');
    const [sales, setSales] = useState([]);

    let getSales = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/list?sortby=${sortby}&order=${order}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSales(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSales();
    }, [startDate, endDate]);

    const mapDatesToSalesData = (dates, sales) => {
        return dates.map((formattedDate) => {
            const sale = sales.find((val) => val.formatted_date === formattedDate);
            return sale ? sale.total_price_sum : 0;
        });
    };

    const getDataBasedOnCondition = () => {
        if (datesBetween.length > 0) {
            return mapDatesToSalesData(datesBetween, sales);
        } else {
            return mapDatesToSalesData(datesMonth, sales);
        }
    };

    const labels = datesBetween.length ? datesBetween : datesMonth

    const data = {
        labels: labels.map((formattedDate) => {
            const day = formattedDate.split('/');
            return day[0];
        }),
        datasets: [
            {
                label: date.getFullYear(),
                data: getDataBasedOnCondition(),
                backgroundColor: 'skyblue',
                borderWidth: 1,
            },
        ]
    };

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
            py={'2'}
        >
            <Flex
                h={'100%'}
                w={'100%'}
                flexDir={'column'}
                gap={'1'}
            >
                <Flex
                    justifyContent={'end'}
                >
                    <Flex
                        justifyContent={'space-around'}
                        alignItems={'center'}
                        gap={'2'}
                    >
                        {/* <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Input
                                size={'xs'}
                                type='date'
                                placeholder='start date'
                                id='startDateInput'
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Skeleton> */}
                        {/* <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Input
                                size={'xs'}
                                type='date'
                                placeholder='end date'
                                id='endDateInput'
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Skeleton> */}
                        <Flex>
                            {/* <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'xs'}
                                    onClick={handleDatesSearch}
                                    bg={'black'}
                                    color={'white'}
                                >
                                    Search
                                </Button>
                            </Skeleton> */}
                        </Flex>
                        <Flex>
                            {/* <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'xs'}
                                    onClick={handleClear}
                                    bg={'red.500'}
                                    color={'white'}
                                >
                                    Clear
                                </Button>
                            </Skeleton> */}
                        </Flex>
                    </Flex>
                </Flex>
                <Skeleton
                    isLoaded={isLoaded}
                    h={'100%'}
                    w={'100%'}
                >
                    <Flex
                        h={'100%'}
                        w={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        px={'0.5'}
                    >
                        <Bar 
                            options={options}
                            data={data} 
                            width={100}
                            height={50}
                        />  
                    </Flex>
                </Skeleton>
            </Flex>
        </Box>
     );
}

export default SalesChart;