import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Skeleton,
    SimpleGrid,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Switch,
    useToast,
    Grid
} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { BsSearch } from 'react-icons/bs';
import { BiFilterAlt } from 'react-icons/bi';
import Pagination from '../components/Pagination';
import CategoryCard from '../components/CategoryCard';
import AddCategory from '../components/AddCategory';
import CategoryDetails from '../components/CategoryDetails';

function CategoriesManagement() {
    const token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeComponent, setActiveComponent] = useState('none');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(16);
    const [sortby, setSortby] = useState('category');
    const [order, setOrder] = useState('ASC');
    const [category, setCategory] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState();

    let getCategory = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/category/list?page=${page}&size=${size}&sortby=${sortby}&order=${order}&category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategoryList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, [page, size, sortby, order, category]);

    // Delete Category
    const onBtnDelete = async (id, isDeleted) => {
        try {
            const updatedCategoryList = categoryList.map((val) =>
            val.id === id ? { ...val, isDeleted } : val);

            setCategoryList(updatedCategoryList);

            let response = await axios.patch(`http://localhost:8000/api/category/delete/${id}`, {
                isDeleted: isDeleted
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.data.success) {
                toast({
                    position: 'top',
                    title: 'Category status',
                    description: response.data.message,
                    status: 'info',
                    duration: 2000,
                    isClosable: true
                })
                getCategory();
            } else{
                toast({
                    position: 'top',
                    title: 'Category status',
                    description: response.data.message,
                    status: 'info',
                    duration: 2000,
                    isClosable: true
                })
                getCategory();
            }
        } catch (error) {
            console.log(error);
            toast({
                position: 'top',
                title: 'Category status',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    const printCategory = () => {
        return categoryList.map((val) => {
            return (
                <CategoryCard
                    key={val.id}
                    id={val.id}
                    category={val.category}
                    isDeleted={val.isDeleted}
                    setActiveComponent={setActiveComponent}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
            )
        })
    }

    const categoryTable = () => {
        return categoryList.map((val) => {
            return (
                <Tr
                    key={val.id}
                >
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'88px'}
                            >
                            <Text
                                overflow={'hidden'}
                                whiteSpace={'nowrap'}
                                textOverflow={'ellipsis'}
                                display={'block'}
                                color={'white'}
                                textAlign={'start'}
                                fontSize={'sm'}
                                fontWeight={'thin'}
                            >
                                {val.category}
                            </Text>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            flexDir={'row'}
                            w={'75px'}
                            justifyContent={'space-between'}
                        >
                            <Switch
                                colorScheme={'red'}
                                size={'sm'}
                                isChecked={val.isDeleted}
                                onChange={() => {
                                    onBtnDelete(val.id, !val.isDeleted)
                                }}
                            />
                            <Box
                                color={val.isDeleted ? 'red.500' : 'green.500'}
                            >
                                <Text
                                    letterSpacing={'tight'}
                                    fontSize={'sm'}
                                    fontWeight={'thin'}
                                >
                                    {val.isDeleted ? 'Inactive' : 'Active'}
                                </Text>
                            </Box>
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
        getCategory();
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
                flexDir={'row'}
                justifyContent={'space-between'}
            >
                <Flex
                    h={'100vh'}
                    w={'75%'}
                    flexDir={'column'}
                    px={'6'}
                >
                    {/* title & add category */}
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
                                    Category
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
                                    Add Category
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                    {/* Search & sort*/}
                    <Box
                        h={'8vh'}
                    >
                        <Flex
                            justifyContent={'end'}
                            alignItems={'center'}
                            w={'100%'}
                            py={'2'}
                            px={'1'}
                        >
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
                                                placeholder={'Search'}
                                                letterSpacing={'tight'}
                                                variant={'filled'}
                                                type={'search'}
                                                onChange={(e) => setCategory(e.target.value)}
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
                                                        setSortby('category')
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
                                                        setSortby('category')
                                                        setOrder('DESC')
                                                    }}
                                                >
                                                    <Text
                                                        fontSize={'sm'}
                                                    >
                                                        Sort by Name: (Z - A)
                                                    </Text>
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                </Skeleton>
                            </Flex>
                        </Flex>
                    </Box>
                    {/* Category list */}
                    <Flex
                        h={'74vh'}
                        w={'100%'}
                        position={'relative'}
                    >
                        <SimpleGrid
                            columns={'4'}
                            rows={'4'}
                            gap={'1'}
                            minW={'0'}
                            w={'100%'}
                            spacingY={'7'}
                            gridAutoRows={'max-content'}
                        >
                            {
                                totalData ? 
                                printCategory()
                                :
                                <Flex
                                    position={'absolute'}
                                    top={'50%'}
                                    left={'50%'}
                                    transform={'translate(-50%, -50%)'}
                                >
                                    <Text>
                                        No Categories Found
                                    </Text>
                                </Flex>
                            }
                        </SimpleGrid>
                    </Flex>
                    {/* Pagination */}
                    <Flex
                        h={'9vh'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        px={'1'}
                        pt={'1'}
                        mb={'1'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Flex
                                flexDir={'row'}
                                alignItems={'baseline'}
                                w={'110px'}
                                justifyContent={'space-between'}
                            >
                                <Flex
                                    w={'18%'}
                                    justifyContent={'end'}
                                >
                                    <Text>
                                        {Math.min(categoryList.length)}
                                    </Text>
                                </Flex>
                                <Text>
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
                {/* add category & category detail */}
                <Flex
                    bg={'black'}
                    h={'100vh'}
                    w={'25%'}
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
                                activeComponent === 'none' && 
                                (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Category List : 
                                        </Text>
                                    </Skeleton>
                                )
                            }
                            {
                                activeComponent === 'add' &&
                                (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Create new category
                                        </Text>
                                    </Skeleton>
                                )
                            }
                            {
                                activeComponent === 'details' &&
                                (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Category details
                                        </Text>
                                    </Skeleton>
                                )
                            }
                        </Box>
                    </Flex>
                    <Box
                        h={'92vh'}
                    >
                        <Flex
                            h={'90vh'}
                            // w={'22vw'}
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
                                    <Flex
                                        py={'1'}
                                        justifyContent={'center'}
                                        w={'22vw'}
                                    >
                                        <Skeleton
                                            isLoaded={isLoaded}
                                            h={'89vh'}
                                            w={'fit-content'}
                                        >
                                            <TableContainer
                                                whiteSpace={'pre-line'}
                                                >
                                                <Table
                                                    variant={'unstyled'}
                                                    size={'sm'}
                                                    w={'22vw'}
                                                >
                                                    <Thead>
                                                        <Tr>
                                                            <Th
                                                                color={'gray.400'}
                                                                textAlign={'start'}
                                                                fontWeight={'light'}
                                                                letterSpacing={'tight'}
                                                            >
                                                                Category name
                                                            </Th>
                                                            <Th
                                                                color={'gray.400'}
                                                                textAlign={'center'}
                                                                fontWeight={'light'}
                                                                letterSpacing={'tight'}
                                                            >
                                                                Status
                                                            </Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {categoryTable()}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </Skeleton>
                                    </Flex>
                                )
                            }
                            {
                                activeComponent === "add" &&
                                <AddCategory
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                />
                            }
                            {
                                activeComponent === 'details' &&
                                <CategoryDetails
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                    category={selectedCategory}
                                    id={selectedCategoryId}
                                />
                            }
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default CategoriesManagement;