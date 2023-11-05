import React, { useState } from 'react';
import { 
    Box, 
    Card, 
    CardBody, 
    Flex, 
    Text,
    Image,
    IconButton
} from '@chakra-ui/react';
import { AiOutlineCloseCircle, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { removeItem } from '../Reducers/transaction';

function OrderProductCard(props) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(props.quantity);
    const [price, setPrice] = useState(props.price);

    const handleRemoveItem = () => {
        dispatch(removeItem({id: props.id}));
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            props.onQuantityChange(props.id, quantity - 1);
        }
    }

    const handleIncrement = () => {
        if (quantity < props.stock) {
            setQuantity(quantity + 1)
            props.onQuantityChange(props.id, quantity + 1);
        }
    }

    return ( 
        <Box
            h={'14vh'}
            w={'100%'}
        >
            <Card
                h={'14vh'}
                w={'100%'}
                bg={'white'}
                rounded={'lg'}
            >
                <CardBody
                    w={'100%'}
                >
                    <Flex
                        flexDir={'row'}
                        mx={'-4'}
                        my={'-4'}
                        position={'relative'}
                    >
                        <Flex
                            h={'100%'}
                            w={'30%'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            m={'auto'}
                            p={'1'}
                        >
                            <Image
                                src={`http://localhost:8000/api${props.image}`}
                                maxW={'100%'}
                                maxH={'100%'}
                            />
                        </Flex>
                        <Flex
                            flexDir={'column'}
                            h={'12.5vh'}
                            w={'70%'}
                            px={'1'}
                        >
                            <Flex
                                justifyContent={'start'}
                                alignItems={'center'}
                                h={'100%'}
                                w={'100%'}
                            >
                                <Text
                                    overflow={'hidden'}
                                    whiteSpace={'nowrap'}
                                    textOverflow={'ellipsis'}
                                    fontSize={'sm'}
                                    fontWeight={'light'}
                                >
                                    {props.name}
                                </Text>
                            </Flex>
                            <Flex
                                h={'100%'}
                                justifyContent={'start'}
                                alignItems={'center'}
                            >
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'light'}
                                >
                                    {price}
                                </Text>
                            </Flex>
                            <Flex
                                h={'100%'}
                                justifyContent={'end'}
                                alignItems={'center'}
                                gap={'3'}
                                mx={'1'}
                            >
                                <Flex
                                    w={'25px'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <IconButton
                                        size={'xs'}
                                        icon={<AiOutlineMinus/>}
                                        onClick={handleDecrement}
                                    />
                                </Flex>
                                <Flex
                                    w={'20px'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'semibold'}
                                    >
                                        {quantity}
                                    </Text>
                                </Flex>
                                <Flex
                                    w={'25px'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <IconButton
                                        size={'xs'}
                                        icon={<AiOutlinePlus/>}
                                        display={quantity >= props.stock ? 'none' : 'flex'}
                                        onClick={handleIncrement}
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                        <IconButton
                            icon={<AiOutlineCloseCircle style={{fontSize:'16px'}}/>}
                            position={'absolute'}
                            top={'-1.5'}
                            left={'-1.5'}
                            size={'xs'}
                            color={'red.500'}
                            bg={'transparent'}
                            _hover={{bg:'transparent'}}
                            onClick={handleRemoveItem}
                        />
                    </Flex>
                </CardBody>
            </Card>
        </Box>
     );
}

export default OrderProductCard;