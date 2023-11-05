import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Flex,
    Skeleton,
    Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import SalesChart from '../components/SalesChart';
import RecentActivity from '../components/RecentActivity';
import TotalRevenue from '../components/TotalRevenue';
import BestSellers from '../components/BestSellers';

function DashBoards() {
    const name = useSelector((state) => state.authUser.username);
    const role = useSelector((state) => state.authUser.role);
    const [isLoaded, setIsLoaded] = useState(false);
    const date = new Date();
    const dateToday = date.toLocaleDateString('en-UK', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
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
            h={'100vh'}
            w={'94vw'}
        >
            <Flex
                flexDir={'row'}
                justifyContent={'space-between'}
            >
                <Flex
                    h={'100vh'}
                    w={'70.5vw'}
                    flexDir={'column'}
                    px={'4'}
                >
                    <Flex
                        h={'8vh'}
                        w={'100%'}
                        flexDir={'row'}
                        alignItems={'flex-end'}
                        justifyContent={'space-between'}
                        borderBottom={'1px'}
                        borderColor={'white'}
                    >
                        <Flex
                            flexDir={'column'}
                            alignItems={'start'}
                            justifyContent={'center'}
                            w={'50%'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'100%'}
                            >
                                <Box
                                    w={'100%'}
                                >
                                    <Text
                                        textAlign={'start'}
                                        fontWeight={'semibold'}
                                        fontSize={'xl'}
                                        overflow={'hidden'}
                                        whiteSpace={'nowrap'}
                                        textOverflow={'ellipsis'}
                                        display={'block'}
                                    >
                                        Welcome, {name}
                                    </Text>
                                </Box>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text
                                    fontWeight={'light'}
                                    fontSize={'sm'}
                                    color={'gray.700'}
                                    mt={'-1'}
                                >
                                    {role}
                                </Text>
                            </Skeleton>
                        </Flex>
                        <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Box>
                                <Text
                                    fontSize={'sm'}
                                    color={'gray.700'}
                                    fontWeight={'light'}
                                >
                                    {dateToday}
                                </Text>
                            </Box>
                        </Skeleton>
                    </Flex>
                    <Flex
                        h={'92vh'}
                        w={'100%'}
                        flexDir={'column'}
                    >
                        <Flex
                            h={'65vh'}
                            w={'100%'}
                            flexDir={'column'}
                        >
                            <SalesChart/>
                        </Flex>
                        <Flex
                            h={'27vh'}
                            w={'100%'}
                        >
                            <RecentActivity/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex
                    h={'100vh'}
                    w={'23.5vw'}
                    flexDir={'column'}
                    px={'2'}
                >
                    <Flex
                        h={'40vh'}
                        w={'100%'}
                    >
                        <TotalRevenue/>
                    </Flex>
                    <Flex
                        h={'60vh'}
                        w={'100%'}
                        mb={'1'}
                    >
                        <BestSellers/>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default DashBoards;