import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Skeleton,
    InputGroup,
    InputLeftElement,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    Tr,
    Td,
    Th,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Switch,
} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { BsSearch } from 'react-icons/bs';
import { BiFilterAlt } from 'react-icons/bi';
import Pagination from '../components/Pagination';
import AddUser from '../components/AddUser';
import UserDetails from '../components/UserDetails';
import ResetPassword from '../components/ResetPassword';

function EmployeeManagement() {
    const token = localStorage.getItem('coffee_login');
    const toast = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeComponent, setActiveComponent] = useState('none');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [sortby, setSortby] = useState('username');
    const [order, setOrder] = useState('ASC');
    const [username, setUsername] = useState('');
    const [userList, setUserList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserRole, setSelectedUserRole] = useState('');
    const [selectedUserRoles, setSelectedUserRoles] = useState('');
    const [userCount, setUserCount] = useState([]);
    const [activeAdmins, setActiveAdmins] = useState(0);
    const [inactiveAdmins, setInactiveAdmins] = useState(0);
    const [activeCashier, setActiveCashier] = useState(0);
    const [inactiveCashier, setInactiveCashier] = useState(0);

    let getUser = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/user/user-list?page=${page}&size=${size}&sortby=${sortby}&order=${order}&username=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserList(response.data.data);
            setTotalData(response.data.datanum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
    }, [page, size, sortby, order, username]);

    // Delete user
    const onBtnDelete = async (uuid, isDeleted) => {
        try {
            let response = await axios.patch(`http://localhost:8000/api/user/delete/${uuid}`, {
                isDeleted: isDeleted
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                toast({
                    position: 'top',
                    title: 'User status',
                    description: response.data.message,
                    status: 'info',
                    duration: 2000,
                    isClosable: true
                })
                countActiveInactive();
                getUser();
            }
        } catch (error) {
            console.log(error);
            toast({
                position: 'top',
                title: 'User status',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            })
        }
    }

    const printUser = () => {
        return userList.map((val, idx) => {
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
                            px={'1'}
                        >
                            #{itemNumber}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'start'}
                        w={'115px'}
                    >
                        <Flex
                            justify={'start'}
                            alignItems={'center'}
                            w={'115px'}
                        >
                            <Text
                                as={'button'}
                                onClick={() => {
                                    setActiveComponent('details');
                                    setSelectedUser(val.uuid);
                                    setSelectedUserEmail(val.email);
                                    setSelectedUserName(val.username);
                                    setSelectedUserRole(val.role_id);
                                    setSelectedUserRoles(val.role.role);
                                }}
                                overflow={'hidden'}
                                whiteSpace={'nowrap'}
                                textOverflow={'ellipsis'}
                                display={'block'}
                            >
                                {val.username}
                            </Text>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'start'}
                        w={'115px'}
                    >
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'115px'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            display={'block'}
                        >
                            {val.email}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'start'}
                    >
                        <Flex
                            justifyContent={'start'}
                            alignItems={'center'}
                            w={'50px'}
                        >
                            {val.role.role}
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                        w={'80px'}
                    >
                        <Flex
                            justifyContent={'space-between'}
                            w={'80px'}
                        >
                            <Switch
                                size={'sm'}
                                colorScheme={'red'}
                                isChecked={val.isDeleted}
                                onChange={() => {
                                    onBtnDelete(val.uuid, !val.isDeleted)
                                }}
                            />
                            <Box
                                color={val.isDeleted ? 'red.500' : 'green.500'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    letterSpacing={'tight'}
                                >
                                    {val.isDeleted ? 'Inactive' : 'Active'}
                                </Text>
                            </Box>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Text
                            as={'button'}
                            onClick={() => {
                                setActiveComponent('reset');
                                setSelectedUser(val.uuid);
                                setSelectedUserEmail(val.email);
                                setSelectedUserName(val.username);
                                setSelectedUserRoles(val.role.role);
                            }}
                            letterSpacing={'tight'}
                            fontSize={'xs'}
                            fontWeight={'hairline'}
                        >
                            Reset password
                        </Text>
                    </Td>
                </Tr>
            )
        })
    }

    let countActiveInactive = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/user/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserCount(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const countUsers = () => {
        let activeAdminsCount = 0;
        let inactiveAdminsCount = 0;
        let activeCashiersCount = 0;
        let inactiveCashiersCount = 0;
        return userCount.forEach((val)=> {
            if (val.role_id === 1) {
                if (val.isDeleted) {
                    inactiveAdminsCount++
                } else {
                    activeAdminsCount++
                }
            } else if (val.role_id === 2) {
                if (val.isDeleted) {
                    inactiveCashiersCount++
                } else {
                    activeCashiersCount++
                }
            }
            setActiveAdmins(activeAdminsCount)
            setInactiveAdmins(inactiveAdminsCount)
            setActiveCashier(activeCashiersCount)
            setInactiveCashier(inactiveCashiersCount)
        })
    };

    useEffect(() => {
        countActiveInactive();
    }, []);

    useEffect(() => {
        countUsers();
    }, [userCount]);

    const paginate = pageNumbers => {
        setPage(pageNumbers)
    }

    const onSuccess = () => {
        countActiveInactive();
        getUser();
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
                    w={'70.5vw'}
                    flexDir={'column'}
                    px={'6'}
                >
                    {/* Title & Add user */}
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
                                    Employee
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
                                    Add new user
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                    {/* Search and sort user */}
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
                                    Employee List ({totalData})
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
                                                placeholder={'Search'}
                                                letterSpacing={'tight'}
                                                variant={'filled'}
                                                type={'search'}
                                                onChange={(e) => setUsername(e.target.value)}
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
                                                        setSortby('username')
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
                                                        setSortby('username')
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
                                                    Username
                                                </Th>
                                                <Th
                                                    textAlign={'start'}
                                                >
                                                    Email
                                                </Th>
                                                <Th
                                                    textAlign={'start'}
                                                >
                                                    Role
                                                </Th>
                                                <Th
                                                    textAlign={'center'}
                                                >
                                                    Status
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                totalData ?
                                                printUser()
                                                :
                                                <Flex
                                                    position={'absolute'}
                                                    top={'50%'}
                                                    left={'50%'}
                                                    transform={'translate(-50%, -50%)'}
                                                >
                                                    <Text>
                                                        No Employee Found
                                                    </Text>
                                                </Flex>

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
                                            {Math.min(userList.length)}
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
                {/* Add user & user Details */}
                <Flex
                    bg={'black'}
                    h={'100vh'}
                    w={'23.5vw'}
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
                                            Create New User
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
                                            User Details
                                        </Text>
                                    </Skeleton>
                                )
                            }
                            {
                                activeComponent === 'reset' && (
                                    <Skeleton
                                        isLoaded={isLoaded}
                                        w={'max-content'}
                                    >
                                        <Text
                                            color={'white'}
                                            textAlign={'start'}
                                        >
                                            Reset Password
                                        </Text>
                                    </Skeleton>
                                )
                            }
                        </Box>
                    </Flex>
                    {/* component */}
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
                                    <Flex
                                        flexDir={'column'}
                                        h={'90vh'}
                                        w={'100%'}
                                        px={'2'}
                                        pt={'2'}
                                        gap={'1.5'}
                                    >
                                        <Flex
                                            gap={'1'}
                                            w={'100%'}
                                        >
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Text
                                                    color={'white'}
                                                    fontSize={'sm'}
                                                    w={'110px'}
                                                    textAlign={'start'}
                                                >
                                                    Active Admins
                                                </Text>
                                            </Skeleton>
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Box
                                                    w={'100%'}
                                                >
                                                    <Text
                                                        textAlign={'start'}
                                                        color={'white'}
                                                        fontSize={'sm'}
                                                        overflow={'hidden'}
                                                        whiteSpace={'nowrap'}
                                                        textOverflow={'ellipsis'}
                                                        display={'block'}
                                                    >
                                                        : {activeAdmins}
                                                    </Text>
                                                </Box>
                                            </Skeleton>
                                        </Flex>
                                        <Flex
                                            gap={'1'}
                                            w={'100%'}
                                        >
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Text
                                                    color={'white'}
                                                    fontSize={'sm'}
                                                    w={'110px'}
                                                    textAlign={'start'}
                                                >
                                                    Inactive Admins
                                                </Text>
                                            </Skeleton>
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Box
                                                    w={'100%'}
                                                >
                                                    <Text
                                                        textAlign={'start'}
                                                        color={'white'}
                                                        fontSize={'sm'}
                                                        overflow={'hidden'}
                                                        whiteSpace={'nowrap'}
                                                        textOverflow={'ellipsis'}
                                                        display={'block'}
                                                    >
                                                        : {inactiveAdmins}
                                                    </Text>
                                                </Box>
                                            </Skeleton>
                                        </Flex>
                                        <Flex
                                            gap={'1'}
                                            w={'100%'}
                                        >
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Text
                                                    color={'white'}
                                                    fontSize={'sm'}
                                                    w={'110px'}
                                                    textAlign={'start'}
                                                >
                                                    Active Cashier
                                                </Text>
                                            </Skeleton>
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Box
                                                    w={'100%'}
                                                >
                                                    <Text
                                                        textAlign={'start'}
                                                        color={'white'}
                                                        fontSize={'sm'}
                                                        overflow={'hidden'}
                                                        whiteSpace={'nowrap'}
                                                        textOverflow={'ellipsis'}
                                                        display={'block'}
                                                    >
                                                        : {activeCashier}
                                                    </Text>
                                                </Box>
                                            </Skeleton>
                                        </Flex>
                                        <Flex
                                            gap={'1'}
                                            w={'100%'}
                                        >
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Text
                                                    color={'white'}
                                                    fontSize={'sm'}
                                                    w={'110px'}
                                                    textAlign={'start'}
                                                >
                                                    Inactive Cashier
                                                </Text>
                                            </Skeleton>
                                            <Skeleton
                                                isLoaded={isLoaded}
                                            >
                                                <Box
                                                    w={'100%'}
                                                >
                                                    <Text
                                                        textAlign={'start'}
                                                        color={'white'}
                                                        fontSize={'sm'}
                                                        overflow={'hidden'}
                                                        whiteSpace={'nowrap'}
                                                        textOverflow={'ellipsis'}
                                                        display={'block'}
                                                    >
                                                        : {inactiveCashier}
                                                    </Text>
                                                </Box>
                                            </Skeleton>
                                        </Flex>
                                    </Flex>
                                )
                            }
                            {
                                activeComponent === 'add' && 
                                <AddUser
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                />
                            }
                            {
                                activeComponent === 'details' && 
                                <UserDetails
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                    uuid={selectedUser}
                                    email={selectedUserEmail}
                                    username={selectedUserName}
                                    roleId={selectedUserRole}
                                />
                            }
                            {
                                activeComponent === 'reset' && 
                                <ResetPassword
                                    handleCloseComponent={handleCloseComponent}
                                    onSuccess={onSuccess}
                                    uuid={selectedUser}
                                    email={selectedUserEmail}
                                    username={selectedUserName}
                                    role={selectedUserRoles}
                                />
                            }
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Box>
     );
}

export default EmployeeManagement;