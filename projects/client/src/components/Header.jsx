import React, { useState, useEffect } from 'react';
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
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { BsSearch } from 'react-icons/bs';
import { BiFilterAlt } from 'react-icons/bi';

function Header(props) {
    const name = useSelector((state) => state.authUser.username);
    const role = useSelector((state => state.authUser.role));
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchProduct, setSearchProduct] = useState('');
    const [sortPorduct, setSortProduct] = useState('name');
    const [orderProduct, setOrderProduct] = useState('ASC');

    const handleInput = (e) => {
        const name = e.target.value;
        setSearchProduct(name);
        props.onSearch(name)
    }

    const handleSortOrder = (sortValue, orderValue) => {
        setSortProduct(sortValue);
        setOrderProduct(orderValue);
        props.onSortOrder(sortValue, orderValue);
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
            w={'100%'}
            h={'8vh'}
        >
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                h={'8vh'}
            >
                <Flex
                    flexDir={'column'}
                    alignItems={'start'}
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
                <Flex
                    gap={'6'}
                >
                    <Skeleton
                        isLoaded={isLoaded}
                    >
                        <Box>
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
                                    size={'sm'}
                                    variant={'filled'}
                                    type={'search'}
                                    value={searchProduct}
                                    onChange={handleInput}
                                />
                            </InputGroup>
                        </Box>
                    </Skeleton>
                    <Skeleton
                        isLoaded={isLoaded}
                    >
                        <Box>
                            <Menu
                                placement={'top-end'}
                                size={'sm'}
                            >
                                <MenuButton>
                                    <IconButton
                                        icon={<BiFilterAlt size={'20px'} />}
                                        size={'sm'}
                                        rounded={'sm'}
                                    />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            handleSortOrder('name', 'ASC');
                                        }}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                        >
                                            Sort by Name: (A - Z)
                                        </Text>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleSortOrder('name', 'DESC');
                                        }}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                        >
                                            Sort by Name: (Z - A)
                                        </Text>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleSortOrder('price', 'ASC');
                                        }}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                        >
                                            Sort by Price: (low - high)
                                        </Text>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleSortOrder('price', 'DESC');
                                        }}
                                    >
                                        <Text
                                            fontSize={'sm'}
                                        >
                                            Sort by Price: (high - low)
                                        </Text>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Box>
                    </Skeleton>
                </Flex>
            </Flex>
        </Box>
     );
}

export default Header;