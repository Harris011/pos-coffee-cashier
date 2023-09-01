import React from 'react';
import {
    Box,
    Flex,
    Text
} from '@chakra-ui/react';
import Header from '../components/Header';

function DashBoard() {
    return ( 
        <Box
            h={'100vh'}
            w={'92vw'}
            // bg={'skyblue'}
        >
            <Flex
                flexDir={'row'}
                justifyContent={'center'}
                alignContent={'center'}
            >
                <Flex
                    w={'75%'}
                    // bg={'rosybrown'}
                    h={'100vh'}
                    flexDir={'column'}
                >
                    <Header/>
                    <Box
                        mt={'2'}
                    >
                        <Text>
                            Product
                        </Text>
                    </Box>
                </Flex>
                <Flex
                    w={'25%'}
                    bg={'black'}
                    justifyContent={'center'}
                    alignContent={'center'}
                >
                    <Text
                        color={'white'}
                        textAlign={'center'}
                    >
                        Transaction
                    </Text>
                </Flex>
            </Flex>
        </Box>
     );
}

export default DashBoard;