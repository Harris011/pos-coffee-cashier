import React from 'react';
import { 
    Box,
    Button,
    Flex,
    Text
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PageNotFound() {
    const navigate = useNavigate();
    const roleId = useSelector((state) => state.authUser.role_id);

    const handleGoBack = () => {
        if (roleId === 1) {
            navigate('/dashboards', {replace: true});
        } else if (roleId === 2) {
            navigate('/dashboard', {replace: true});
        } else {
            navigate('/', {replace: true});
        }
    }

    return ( 
        <Box
            h={'100vh'}
            w={'100%'}
        >
            <Flex
                h={'100%'}
                w={'100%'}
                pt={'28'}
                alignItems={'center'}
                flexDir={'column'}
            >
                <Flex
                    h={'20%'}
                    w={'auto'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Text
                        fontSize={'8xl'}
                        fontWeight={'bold'}
                        color={'black'}
                    >
                        404
                    </Text>
                </Flex>
                <Flex
                    w={'auto'}
                    flexDir={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    gap={'4'}
                >
                    <Text
                        fontSize={'xl'}
                        fontWeight={'semibold'}
                    >
                        Page Not Found
                    </Text>
                    <Flex
                        h={'auto'}
                        w={'100%'}
                        alignItems={'center'}
                    >
                        <Text
                            fontSize={'lg'}
                            color={'gray.500'}
                            textAlign={'start'}
                            fontWeight={'light'}
                        >
                            We're sorry, but the page you're looking for can't be found or doesn't exist.
                        </Text>
                    </Flex>
                    <Button
                        size={'sm'}
                        fontWeight={'light'}
                        fontSize={'lg'}
                        leftIcon={<ArrowBackIcon/>}
                        bg={'black'}
                        color={'white'}
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>
                </Flex>
            </Flex>
        </Box>
     );
}

export default PageNotFound;