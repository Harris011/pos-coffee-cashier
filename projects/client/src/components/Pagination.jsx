import React from 'react';
import {
    Button,
    Flex,
    Text
} from "@chakra-ui/react";
import { useState } from 'react';

function Pagination(props) {
    const [pageNumber, setPageNumber] = useState(1);

    const buttonNext = () => {
        const maxPageNumber = Math.ceil(props.totalData / props.size);
        if(pageNumber < maxPageNumber) {
            setPageNumber(pageNumber + 1);
            props.paginate(pageNumber);
        }
    }

    const buttonPrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
            props.paginate(pageNumber - 2);
        }
    }

    return ( 
        <Flex 
            justifyContent={'space-evenly'}
            alignItems={'center'}
            gap={'4'}
        >
            {/* BUTTON PERVIOUSE PAGE */}
            <Button
                onClick={buttonPrevious} 
                disabled={pageNumber === 1}
                color={'white'}
                bg={'black'}
                size={'sm'}
                fontSize={'sm'}
                p={'1.5'}
                mr={'0.5'}
                _active={{
                    transform: 'scale(0.98)',
                    bg: 'transparent',
                    color: 'gray.700',
                }}
            >
                Previous
            </Button>
            {/* THE PAGE NUMBER*/}
            <Text
                background={'white'}
                py={'0.5'}
                px={'3'}
                rounded={'lg'}
                fontSize={'md'}
                border={'1px'}
                borderColor={'black'}
            >
                {pageNumber}
            </Text>
            {/* BUTTON NEXT PAGE */}
            <Button
                onClick={buttonNext}
                disabled={pageNumber === Math.ceil(props.totalData / props.size)}
                color={'white'}
                bg={'black'}
                size={'sm'}
                fontSize={'sm'}
                p={'1.5'}
                ml={'0.5'}
                _active={{
                    transform: 'scale(0.98)',
                    bg: 'transparent',
                    color: 'gray.700',
                }}
            >
                Next
            </Button>
        </Flex>
     );
}

export default Pagination;