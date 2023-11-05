import React, { useEffect, useState } from 'react';
import { 
    Card, 
    CardBody, 
    Flex, 
    Text,
    Radio,
    Icon,
    Skeleton
} from '@chakra-ui/react';

function PaymentCard(props) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setIsLoaded(true)
        }, 2000)

        return () => {
            clearTimeout(delay);
        }
    }, []);

    return ( 
        <Flex
            h={'14vh'}
            w={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Card
                h={'14vh'}
                w={'80%'}
                bg={'white'}
                rounded={'lg'}
            >
                <Skeleton
                    isLoaded={isLoaded}
                    rounded={'lg'}
                    h={'100%'}
                    w={'100%'}
                >
                    <CardBody
                        w={'100%'}
                    >
                        <Flex
                            justifyContent={'center'}
                            gap={'6'}
                            alignItems={'center'}
                            h={'100%'}
                        >
                            <Flex
                                flexDir={'row'}
                                gap={'4'}
                            >
                                <Radio
                                    isDisabled={props.disable}
                                    isChecked={props.check}
                                />
                                <Flex
                                    flexDir={'column'}
                                    alignItems={'start'}
                                    w={'24'}
                                >
                                    <Text
                                        fontSize={'sm'}
                                        color={props.disable? 'gray.400' : 'black'}
                                    >
                                        {props.title}
                                    </Text>
                                    <Text
                                        fontSize={'sm'}
                                        color={props.disable? 'gray.400' : 'black'}
                                    >
                                        {props.description}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex>
                                <Icon
                                    as={props.icon}
                                    boxSize={'8'}
                                    color={props.disable? 'gray.400' : 'black'}
                                />
                            </Flex>
                        </Flex>
                    </CardBody>
                </Skeleton>
            </Card>
        </Flex>
     );
}

export default PaymentCard;