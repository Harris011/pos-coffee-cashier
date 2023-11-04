import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    IconButton,
    Skeleton,
    Tr,
    Td,
    Th,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    InputRightAddon,
    MenuButton,
    Menu,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { BsSearch } from 'react-icons/bs';
import { BiFilterAlt } from 'react-icons/bi';
import AddProduct from '../components/AddProduct';
import ProductDetails from '../components/ProductDetails';

function ProductsManagement() {
    const token = localStorage.getItem('coffee_login');
    const [isLoaded, setIsLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [sortby, setSortby] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [selectedOption, setSelectedOption] = useState('name');
    const [productList, setProductList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [activeComponent, setActiveComponent] = useState('none');

    console.log("Product List :", productList);

    let getProduct = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/product/list?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${name}&category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log('error');
        }
    }

    useEffect(() => {
        getProduct();
    }, [page, size, sortby, order, name, category, selectedOption]);

    const printProduct = () => {
        return productList.map((val, idx) => {
            const itemNumber = (page * size) + idx + 1;
            return (
                <Tr
                    key={val.uuid}
                >
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            #{itemNumber}
                        </Flex>
                    </Td>
                    <Td>
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'120px'}
                        >
                            {val.name}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'120px'}
                        >
                            {val.category.category}
                        </Flex>
                    </Td>
                    <Td>
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {val.stock}
                        </Flex>
                    </Td>
                    <Td>
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {val.price}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Box
                            color={val.isDeleted ? 'red.500' : 'green.500'}
                        >
                            {val.isDeleted ? 'inactive' : 'active'}
                        </Box>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Text
                            as={'button'}
                            onClick={() => setActiveComponent('details')}
                        >
                            Detail
                        </Text>
                    </Td>
                </Tr>
            )
        })
    }

    const paginate = pageNumbers => {
        setPage(pageNumbers)
    }

    const handleCloseComponent = () => {
        setActiveComponent('none');
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
                flex={'row'}
                justifyContent={'space-between'}
            >
                <Flex
                    h={'100vh'}
                    w={'75%'}
                    flexDir={'column'}
                    px={'6'}
                >
                    {/* Title & Add Product */}
                    <Flex
                        h={'8vh'}
                        flexDir={'column'}
                        justifyContent={'center'}
                        borderBottom={'1px'}
                        borderColor={'gray.300'}
                        px={'1'}
                    >
                        <Flex
                            flexDir={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text
                                    fontSize={'xl'}
                                    fontWeight={'semibold'}
                                >
                                    Product
                                </Text>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'xs'}
                                    color={'white'}
                                    leftIcon={
                                        <AddIcon
                                            boxSize={'3'}
                                        />
                                    }
                                    letterSpacing={'tight'}
                                    border={'0.5px'}
                                    borderColor={'black'}
                                    variant={'solid'}
                                    bg={'black'}
                                    onClick={() => setActiveComponent('add')}
                                >
                                    Add Product
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                    {/* Search and sort product */}
                    <Box
                        h={'8vh'}
                    >
                        <Flex
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            w={'100%'}
                            py={'2'}
                            px={'1'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Text>
                                    Product List ({totalData})
                                </Text>
                            </Skeleton>
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
                                                placeholder={'Search by'}
                                                letterSpacing={'tight'}
                                                variant={'filled'}
                                                type={'search'}
                                                value={selectedOption === 'category' ? category : name}
                                                onChange={(e) => {
                                                  if (selectedOption === 'category') {
                                                      setCategory(e.target.value);
                                                } else {
                                                      setName(e.target.value);
                                                  }
                                                }}
                                            />
                                            <InputRightAddon>
                                                <Select
                                                    size={'xs'}
                                                    variant={'unstyled'}
                                                    color={'black'}
                                                    w={'100%'}
                                                    onChange={(e) => setSelectedOption(e.target.value)}
                                                >
                                                    <option
                                                        value={'name'}
                                                    >
                                                        Product
                                                    </option>
                                                    <option
                                                        value={'category'}
                                                    >
                                                        Category
                                                    </option>
                                                </Select>
                                            </InputRightAddon>
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
                                                        setSortby('name')
                                                        setOrder('ASC')
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
                                                        setSortby('name')
                                                        setOrder('DESC')
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
                                                        setSortby('price')
                                                        setOrder('ASC')
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
                                                        setSortby('price')
                                                        setOrder('DESC')
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
                    {/* Table */}
                    <Flex
                        flexDir={'column'}
                        h={'84vh'}
                        justifyContent={'space-between'}
                        border={'1px'}
                        rounded={'xl'}
                        px={'2'}
                        mb={'1'}
                    >
                        <Flex
                            justifyContent={'center'}
                            borderBottom={'1px'}
                            h={'74vh'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                rounded={'xl'}
                            >
                                <TableContainer
                                    w={'65vw'}
                                >
                                    <Table
                                        size={'sm'}
                                        variant={'simple'}
                                        maxW={'100%'}
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Number
                                                </Th>
                                                <Th
                                                    textAlign={'start'}
                                                >
                                                    Product Name
                                                </Th>
                                                <Th
                                                    textAlign={'start'}
                                                >
                                                    Category
                                                </Th>
                                                <Th
                                                    textAlign={'ce'}
                                                >
                                                    Stock
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Price
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Status
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Product Details
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {printProduct()}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Skeleton>
                        </Flex>
                        <Flex
                            justifyContent={'space-between'}
                            px={'1'}
                            alignItems={'center'}
                            h={'8vh'}
                        >
                            <Flex
                                justifyContent={'start'}
                                alignItems={'baseline'}
                                flexDir={'row'}
                                w={'20%'}
                            >
                                <Flex
                                    w={'20%'}
                                    justifyContent={'end'}
                                    mr={'1.5'}
                                >
                                    <Skeleton
                                        isLoaded={isLoaded}
                                    >
                                        <Text
                                            textAlign={'center'}
                                        >
                                            {Math.min(productList.length)}
                                        </Text>
                                    </Skeleton>
                                </Flex>
                                <Skeleton
                                    isLoaded={isLoaded}
                                >
                                    <Text
                                        textAlign={'center'}
                                    >
                                        of {totalData} results
                                    </Text>
                                </Skeleton>
                            </Flex>
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
                {/* Add Product & Product Detail */}
                <Flex
                    bg={'black'}
                    w={'25%'}
                    h={'100vh'}
                    flexDir={'column'}
                    px={'2'}
                >
                    <Flex
                        h={'8vh'}
                        alignItems={'center'}
                        borderBottom={'1px'}
                        borderColor={'white'}
                    >
                        <Box
                            px={'2'}
                        >
                            {
                                activeComponent === 'none' && (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            -
                                        </Text>
                                    </Skeleton>
                                )
                            }
                            {
                                activeComponent === 'add' && (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                        w={'max-content'}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Create New Product
                                        </Text>
                                    </Skeleton>
                                )
                            }
                            {
                                activeComponent === 'details' && (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                        w={'max-content'}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Product Detail
                                        </Text>
                                    </Skeleton>
                                )
                            }
                        </Box>
                    </Flex>
                    {/* add & detail product component */}
                    <Box
                        h={'92vh'}
                    >
                        <Flex
                            h={'90vh'}
                            mt={'2'}
                            mb={'1'}
                            border={'1px'}
                            rounded={'xl'}
                            borderColor={'white'}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {
                            activeComponent === 'none' && 
                                (
                                    <Flex>
                                        <Skeleton
                                            isLoaded={isLoaded}
                                        >
                                            <Text
                                                color={'white'}
                                            >
                                                No Items
                                            </Text>
                                        </Skeleton>
                                    </Flex>
                                )
                            }
                            {
                                activeComponent === 'add' && 
                                <AddProduct
                                    handleCloseComponent={handleCloseComponent}
                                />
                            }
                            {
                                activeComponent === 'details' && 
                                <ProductDetails
                                    handleCloseComponent={handleCloseComponent}
                                />
                            }
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default ProductsManagement;