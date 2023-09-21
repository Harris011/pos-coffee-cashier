import React, { useEffect, useState } from 'react';
import {
    Card, 
    CardBody, 
    Flex, 
    Skeleton,
    Text
} from '@chakra-ui/react';

function CategoryCard(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [category] = useState(props.category);
    const [id] = useState(props.id);

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
            h={'fit-content'}
            w={'fit-content'}
        >
            <Card
                size={'sm'}
                h={'14vh'}
                w={'16vw'}
                rounded={'md'}
                border={'1px'}
                borderColor={'gray.200'}
                as={'button'}
                onClick={() => {
                    props.setActiveComponent('details');
                    props.setSelectedCategory(category);
                    props.setSelectedCategoryId(id);
                }}
                bgGradient={props.isDeleted ? 'linear(to-br, red.400, red.600)' : 'linear(to-br, gray.100, gray.200)'}
            >
                <CardBody
                    rounded={'md'}
                    h={'14vh'}
                    w={'16vw'}
                >
                    <Flex
                        justifyContent={'center'}
                        alignItems={'center'}
                        h={'full'}
                        w={'full'}
                        rounded={'md'}
                    >
                        <Text
                            textAlign={'center'}
                            color={props.isDeleted ? 'white' : 'gray.800'}
                            fontWeight={'light'}
                            textTransform={'capitalize'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            display={'block'}
                        >
                            {props.category}
                        </Text>
                    </Flex>
                </CardBody>
            </Card>
        </Skeleton>
     );
}

export default CategoryCard;