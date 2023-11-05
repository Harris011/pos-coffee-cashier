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
    MenuItem,
    useToast,
    Switch
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
    const toast = useToast();
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
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productStock, setProductStock] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');

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

    // Delete product
    const onBtnDelete = async (uuid, isDeleted) => {
        try {
            let response = await axios.patch(`http://localhost:8000/api/product/delete/${uuid}`, {
                isDeleted: isDeleted
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                toast({
                    position: 'top',
                    title: 'Product status',
                    description: response.data.message,
                    status: 'info',
                    duration: 2000,
                    isClosable: true
                })
                getProduct();
            }
        } catch (error) {
            console.log(error);
            toast({
                position: 'top',
                title: 'Product status',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    useEffect(() => {
        getProduct();
    }, [page, size, sortby, order, name, category, selectedOption]);

    const printProduct = () => {
        return productList.map((val, idx) => {
            const itemNumber = (page * size) + idx + 1;
            const formattedPrice = val.price.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
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
                            px={'1'}
                        >
                            #{itemNumber}
                        </Flex>
                    </Td>
                    <Td>
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'120px'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            display={'block'}
                        >
                            {val.name}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                        px={'1'}
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
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'60px'}
                        >
                            {formattedPrice}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            flexDir={'row'}
                            w={'80px'}
                            justifyContent={'space-between'}
                        >
                            <Switch
                                colorScheme='red'
                                size={'sm'}
                                isChecked={val.isDeleted}
                                onChange={() => {
                                    onBtnDelete(val.uuid, !val.isDeleted)
                                }}
                            />
                            <Box
                                color={val.isDeleted ? 'red.500' : 'green.500'}
                            >
                                <Text
                                    letterSpacing={'tight'}
                                    fontSize={'sm'}
                                >
                                    {val.isDeleted ? 'Inactive' : 'Active'}
                                </Text>
                            </Box>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'center'}
                        >
                            <Text
                                as={'button'}
                                onClick={() => {
                                    setActiveComponent('details');
                                    setSelectedProduct(val.uuid);
                                    setProductName(val.name);
                                    setProductCategory(val.category.id);
                                    setProductStock(val.stock);
                                    setProductPrice(val.price);
                                    setProductImage(val.product_image);
                                }}
                            >
                                Detail
                            </Text>
                        </Flex>
                    </Td>
                </Tr>
            )
        })
    }

    const paginate = pageNumbers => {
        setPage(pageNumbers)
    }

    const onSuccess = () => {
        getProduct();
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
                                    Products
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
                                            <MenuButton
                                                bg={'gray.100'}
                                                boxSize={'8'}
                                                rounded={'sm'}
                                            >
                                                <Flex
                                                    align={'center'}
                                                    justify={'center'}
                                                    h={'100%'}
                                                    w={'100%'}
                                                >
                                                    <BiFilterAlt size={'20px'} />
                                                </Flex>
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
                            position={'relative'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                rounded={'xl'}
                            >
                                <TableContainer
                                    w={'65vw'}
                                    whiteSpace={'pre-line'}
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
                                                    px={'1'}
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
                                                    px={'1'}
                                                >
                                                    Category
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Stock
                                                </Th>
                                                <Th
                                                    textAlign={'start'}
                                                >
                                                    Price (Rp)
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
                                            {
                                                totalData ?
                                                printProduct()
                                                :
                                                <Tr>
                                                    <Td>
                                                        <Flex
                                                            position={'absolute'}
                                                            top={'50%'}
                                                            left={'50%'}
                                                            transform={'translate(-50%, -50%)'}
                                                        >
                                                            <Text>
                                                                No Products Found
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            }
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
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Flex
                                    flexDir={'row'}
                                    alignItems={'baseline'}
                                    w={'115px'}
                                    justifyContent={'space-between'}
                                >
                                    <Flex
                                        w={'20%'}
                                        justifyContent={'end'}
                                    >
                                        <Text
                                            textAlign={'center'}
                                        >
                                            {Math.min(productList.length)}
                                        </Text>
                                    </Flex>
                                    <Text
                                        textAlign={'center'}
                                    >
                                        of {totalData} results
                                    </Text>
                                </Flex>
                            </Skeleton>
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
                                    onSuccess={onSuccess}
                                />
                            }
                            {
                                activeComponent === 'details' && 
                                <ProductDetails
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                    uuid={selectedProduct}
                                    name={productName}
                                    category={productCategory}
                                    stock={productStock}
                                    price={productPrice}
                                    image={productImage}
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