import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td
} from '@chakra-ui/react';
import axios from 'axios';

function TransactionDetails(props) {
    const token = localStorage.getItem('coffee_login');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [transactionDetails, setTransactionDetails] = useState();
    const [totalPrice, setTotalPrice] = useState('');

    let getTransactionDetails = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/transaction/details/${props.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTransactionDetails(response.data.data);
            setTotalPrice(response.data.data.total_price_tax_sum);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTransactionDetails();
    }, []);

    const printTransactionDetails = () => {
        if (!transactionDetails || !transactionDetails.transaction_details) {
            return null;
        }
        return transactionDetails.transaction_details.map((detail, idx) => {
            return (
                <Tr
                    key={detail.productId}
                >
                    <Td>
                        <Box
                            w={'120px'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            display={'block'}
                        >
                            {detail.name}
                        </Box>
                    </Td>
                    <Td
                        textAlign={'center'}
                    >
                        <Flex
                            justifyContent={'center'}
                        >
                            <Text>
                                {detail.quantity}
                            </Text>
                        </Flex>
                    </Td>
                    <Td
                        textAlign={'start'}
                    >
                        <Box
                            w={'45px'}
                        >
                            {detail.price_tax}
                        </Box>
                    </Td>
                    <Td
                        textAlign={'end'}
                    >
                        <Box
                            w={'60px'}
                        >
                            {detail.subTotal}
                        </Box>
                    </Td>
                </Tr>
            )
        })
    }

    return ( 
        <Box>
            <Text
                as={'button'}
                fontWeight={'light'}
                fontSize={'sm'}
                onClick={onOpen}
            >
                Details
            </Text>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={'lg'}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Flex
                            flexDir={'column'}
                            w={'100%'}
                        >
                            <Text
                                fontSize={'md'}
                                style={{ textDecoration: 'underline' }}
                            >
                                Transaction Details No. {props.itemNumber}
                            </Text>
                            <Flex
                                flexDir={'row'}
                                gap={'1'}
                                w={'100%'}
                            >
                                <Text
                                    fontSize={'md'}
                                    w={'65px'}
                                    textAlign={'start'}
                                >
                                    Date
                                </Text>
                                <Box>
                                    <Text
                                        textAlign={'start'}
                                        fontSize={'md'}
                                    >
                                        : {props.date}
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex
                                flexDir={'row'}
                                gap={'1'}
                                w={'100%'}
                            >
                                <Text
                                    fontSize={'md'}
                                    w={'65px'}
                                    textAlign={'start'}
                                >
                                    Cahsier
                                </Text>
                                <Box
                                    w={'80%'}
                                >
                                    <Text
                                        fontSize={'md'}
                                        textAlign={'start'}
                                        overflow={'hidden'}
                                        whiteSpace={'nowrap'}
                                        textOverflow={'ellipsis'}
                                        display={'block'}
                                    >
                                        : {props.user}
                                    </Text>
                                </Box>
                            </Flex>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody
                        mx={'-3'}
                    >
                        <TableContainer>
                            <Table
                                variant={'unstyled'}
                            >
                                <Thead>
                                    <Tr>
                                        <Th>
                                            Product item(s)
                                        </Th>
                                        <Th
                                            textAlign={'center'}
                                        >
                                            quantity
                                        </Th>
                                        <Th
                                            textAlign={'start'}
                                        >
                                            Price
                                        </Th>
                                        <Th
                                            textAlign={'start'}
                                        >
                                            Subtotal
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {printTransactionDetails()}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Flex
                            w={'100%'}
                            h={'100%'}
                            flexDir={'row'}
                            justifyContent={'space-between'}
                            px={'6'}
                            borderTop={'1.5px'}
                            borderColor={'gray.400'}
                            borderStyle={'dashed'}
                            pt={'1'}
                        >
                            <Box
                                w={'100%'}
                            >
                                <Text>
                                    Total
                                </Text>
                            </Box>
                            <Box
                                mr={'1'}
                            >
                                <Text>
                                    {totalPrice}
                                </Text>
                            </Box>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme='green'
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
     );
}

export default TransactionDetails;