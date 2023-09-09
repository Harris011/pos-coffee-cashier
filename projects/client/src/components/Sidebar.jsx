import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Icon,
    Link,
    IconButton,
    Tooltip,
    Skeleton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { GiCoffeeBeans } from 'react-icons/gi';
import { BsBoxes } from 'react-icons/bs';
import { BiCategoryAlt } from 'react-icons/bi';
import { IoIosPeople } from 'react-icons/io';
import { FaRegChartBar } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { logoutAction } from '../Reducers/authUser';
import { useDispatch } from 'react-redux';

function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    
    const logoutBtn = () => {
        localStorage.removeItem('coffee_login');
        dispatch(logoutAction());
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
            bg={'black'}
            h={'100vh'}
            w={'6vw'}
        >
            <Flex
                flexDir={'column'}
                h={'100vh'}
            >
                <Flex
                    flexDir={'column'}
                >
                    {/* Logo */}
                    <Flex
                        justifyContent={'center'}
                        alignItems={'center'}
                        h={'8vh'}
                        borderBottom={'1px'}
                        borderColor={'white'}
                        mx={'2'}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            fitContent='true'
                        >
                            <Icon
                                as={GiCoffeeBeans}
                                fontSize={'3xl'}
                                color={'white'}
                            />
                        </Skeleton>
                    </Flex>
                    {/* Menu */}
                    <Flex
                        flexDir={'column'}
                        gap={'1.5'}
                        alignItems={'center'}
                        h={'82vh'}
                        pt={'2'}
                    >
                        <Link
                            onClick={() => navigate('/dashboard')}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                fitContent='true'
                            >
                                <Tooltip
                                    label={'Dashboard'}
                                    hasArrow
                                    bg={'white'}
                                    color={'black'}
                                    placement={'right'}
                                    closeOnClick={false}
                                >
                                    <IconButton
                                        icon={<AiFillHome size={'25px'} />}
                                        size={'sm'}
                                        variant={'unstyled'}
                                        color={'white'}
                                        px={'1'}
                                    />
                                </Tooltip>
                            </Skeleton>
                        </Link>
                        <Link
                            onClick={() => navigate('/products')}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                fitContent='true'
                            >
                                <Tooltip
                                    label={'Products'}
                                    hasArrow
                                    bg={'white'}
                                    color={'black'}
                                    placement={'right'}
                                    closeOnClick={false}
                                >
                                    <IconButton
                                        icon={<BsBoxes size={'25px'} />}
                                        size={'sm'}
                                        variant={'unstyled'}
                                        color={'white'}
                                        px={'1'}
                                    />
                                </Tooltip>
                            </Skeleton>
                        </Link>
                        <Link
                            onClick={() => navigate('/dashboard')}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                fitContent='true'
                            >
                                <Tooltip
                                    label={'Categorys'}
                                    hasArrow
                                    bg={'white'}
                                    color={'black'}
                                    placement={'right'}
                                    closeOnClick={false}
                                >
                                    <IconButton
                                        icon={<BiCategoryAlt size={'25px'} />}
                                        size={'sm'}
                                        variant={'unstyled'}
                                        color={'white'}
                                        px={'1'}
                                    />
                                </Tooltip>
                            </Skeleton>
                        </Link>
                        <Link
                            onClick={() => navigate('/dashboard')}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                fitContent='true'
                            >
                                <Tooltip
                                    label={'Employee'}
                                    hasArrow
                                    bg={'white'}
                                    color={'black'}
                                    placement={'right'}
                                    closeOnClick={false}
                                >
                                    <IconButton
                                        icon={<IoIosPeople size={'25px'} />}
                                        size={'sm'}
                                        variant={'unstyled'}
                                        color={'white'}
                                        px={'1'}
                                    />
                                </Tooltip>
                            </Skeleton>
                        </Link>
                        <Link
                            onClick={() => navigate('/dashboard')}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                                fitContent='true'
                            >
                                <Tooltip
                                    label={'Report'}
                                    hasArrow
                                    bg={'white'}
                                    color={'black'}
                                    placement={'right'}
                                    closeOnClick={false}
                                >
                                    <IconButton
                                        icon={<FaRegChartBar size={'25px'} />}
                                        size={'sm'}
                                        variant={'unstyled'}
                                        color={'white'}
                                        px={'1'}
                                    />
                                </Tooltip>
                            </Skeleton>
                        </Link>
                    </Flex>
                </Flex>
                {/* Footer */}
                <Flex
                    alignItems={'center'}
                    h={'10vh'}
                    justifyContent={'center'}
                    borderTop={'1px'}
                    borderColor={'white'}
                    mb={'1'}
                    mx={'2'}
                >
                    <Skeleton
                        isLoaded={isLoaded}
                        fitContent='true'
                    >
                        <Tooltip
                            label={'Logout'}
                            hasArrow
                            bg={'white'}
                            color={'black'}
                            placement={'right'}
                            closeOnClick={false}
                        >
                            <IconButton
                                icon={<FiLogOut size={'20px'} />}
                                size={'xs'}
                                onClick={() => {
                                    logoutBtn();
                                    {navigate('/', {replace: true})}
                                }}
                            />
                        </Tooltip>
                    </Skeleton>
                </Flex>
            </Flex>
        </Box>
     );
}

export default SideBar;