import React, { useEffect, useState } from 'react';
import { 
    Box,
    Card, 
    CardBody,
    Flex,
    IconButton,
    Image,
    Skeleton,
    Text,
    Tooltip
} from '@chakra-ui/react';
import { BsFillBasket2Fill } from 'react-icons/bs';

function ProductCard(props) {
    const [isLoaded, setIsLoaded] = useState(false);

    const selectedProduct = () => {
        props.onSelectedProduct({
          id: props.id,
          name: props.name,
          image: props.image,
          stock: props.stock,
          price: props.price
        });
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
        <Skeleton
            isLoaded={isLoaded}
            rounded={'md'}
            h={'36vh'}
            w={'16.5vw'}
        >
            <Card
                size={'sm'}
                rounded={'md'}
                h={'36vh'}
                w={'16.5vw'}
                border={'1px'}
                borderColor={'gray.200'}
            >
                <Box
                    position={'relative'}
                >
                    <Image
                        w={'100%'}
                        h={'140px'}
                        src={`http://localhost:8000/api${props.image}`}
                        objectFit={'fill'}
                        alt='Product Image'
                        roundedTop={'md'}
                    />
                    <Tooltip
                        label={'Add to cart'}
                        hasArrow
                        bg={'black'}
                        color={'white'}
                        placement={'left'}
                        closeOnClick={false}
                        fontSize={'xs'}
                    >
                        <IconButton 
                            size={'sm'}
                            icon={<BsFillBasket2Fill size={'18px'} />}
                            position={'absolute'}
                            top={'1'}
                            right={'1'}
                            colorScheme={'blackAlpha'}
                            color={'white'}
                            display={props.stock === 0 ? 'none' : 'flex'}
                            onClick={selectedProduct}
                        />
                    </Tooltip>
                </Box>
                <CardBody
                    py={'1'}
                >
                    <Flex>
                        <Text
                            fontSize={'sm'}
                        >
                            {props.price}
                        </Text>
                    </Flex>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        {
                            props.stock === 0 ? (
                                <Text
                                    fontSize={'sm'}
                                    color={'red.500'}
                                    fontWeight={'semibold'}
                                    letterSpacing={'tight'}
                                >
                                    Out of stock
                                </Text>
                            ) : (
                                <Text
                                    fontSize={'sm'}
                                    color={'gray.500'}
                                    fontWeight={'hairline'}
                                >
                                    Stock : {props.stock}
                                </Text>
                            )}
                    </Flex>
                    <Flex
                        justifyContent={'end'}
                    >
                        <Text
                            fontSize={'sm'}
                            fontWeight={'semibold'}
                            letterSpacing={'tight'}
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            display={'block'}
                        >
                            {props.name}
                        </Text>
                    </Flex>
                </CardBody>
            </Card>
        </Skeleton>
     );
}

export default ProductCard;