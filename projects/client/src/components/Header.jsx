import React from 'react';
import {
    Box,
    Text,
    Flex,
    Skeleton,
    Input,
    InputGroup,
    InputLeftAddon,
    IconButton,
    InputLeftElement,
    Button
} from '@chakra-ui/react';
// import { loginAction } from '../Reducers/authUser';
import { useSelector } from 'react-redux';
import { BsSearch } from 'react-icons/bs';
import { BiFilterAlt } from 'react-icons/bi';

function Header() {
    const name = useSelector((state) => state.authUser.username);
    const role = useSelector((state => state.authUser.role));

    console.log("user that login:", name);
    console.log("role user that login:", role);

    return ( 
        <Box
            // bg={'royalblue'}
            w={'100%'}
        >
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'3'}
                mx={'4'}
            >
                <Flex
                    flexDir={'column'}
                    alignItems={'start'}
                >
                    <Text
                        fontWeight={'semibold'}
                        fontSize={'xl'}
                    >
                        Welcome, {name}
                    </Text>
                    <Text
                        fontWeight={'light'}
                        fontSize={'sm'}
                        color={'gray.700'}
                        mt={'-1'}
                    >
                        {role}
                    </Text>
                </Flex>
                <Flex
                    justifyContent={'space-around'}
                    w={'50%'}
                >
                    <Box
                        w={'80%'}
                    >
                        <InputGroup
                            size={'sm'}
                        >
                            <InputLeftElement>
                                <IconButton
                                    icon={<BsSearch/>}
                                    size={'sm'}
                                    variant={'link'}
                                    color={'black'}
                                />
                            </InputLeftElement>
                            <Input
                                placeholder={'Search product'}
                                letterSpacing={'tight'}
                                // size={'sm'}
                                variant={'filled'}
                            />
                        </InputGroup>
                    </Box>
                    <Box
                        w={'20%'}
                    >
                        <IconButton
                            icon={<BiFilterAlt size={'20px'}/>}
                            size={'sm'}
                            rounded={'sm'}
                        />
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default Header;