import React, { useEffect, useRef, useState }  from 'react';
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Image,
    Button,
    Select,
    IconButton,
    Tooltip,
    Skeleton,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import PulseLoader from "react-spinners/PulseLoader";

function ProductDetails(props) {
    let token = localStorage.getItem('coffee_login')
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const inputFile = useRef(null);
    const [name, setName] = useState(props.name);
    const [price, setPrice] = useState(props.price);
    const [stock, setStock] = useState(props.stock);
    const [category, setCategory] = useState(props.category);
    const [productImage, setProductImage] = useState(null);

    const handleClose = () => {
        setName(props.name);
        setPrice(props.price);
        setStock(props.stock);
        setCategory(props.category);
        props.handleCloseComponent();
    }

    useEffect(() => {
        inputFile.current = document.createElement('input');
        inputFile.current.type='file';
        inputFile.current.style.display= 'none';
        document.body.appendChild(inputFile.current);
    }, []);

    // Edit Product
    const onBtnEdit = async () => {
        try {
            let formData = new FormData();
            if (!token) {
                return toast({
                    position: 'top',
                    title: 'Edit product',
                    description: 'unauthorized access',
                    duration: 2000,
                    isClosable: true
                })
            }
            if (name == '' || price == '' || stock == '' || category == '') {
                return toast({
                    position: 'top',
                    title: 'Edit product',
                    description: 'Please complete all required fields',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
            }

            formData.append(
                "data",
                JSON.stringify({
                    name: name,
                    price: price,
                    stock: stock,
                    category_id: category
                })
            );

            if (productImage != null) {
                formData.append('images', productImage);
            }

            setLoading(true);

            let response = await axios.patch(`http://localhost:8000/api/product/edit/${props.uuid}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success == true) {
                toast({
                    position: 'top',
                    title: 'Edit product',
                    description: response.data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                handleClose();
                setTimeout(() => {
                    props.onSuccess();
                    handleClose();
                }, 1500)
                setLoading(false);
            } else {
                setTimeout(() => {
                    toast({
                        position: 'top',
                        title: 'Edit product',
                        description: 'Fail to edit product',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    })
                }, 1500)
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                toast({
                    position: 'top',
                    title: 'Edit product',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                })
            }, 1500)
            setLoading(false);
        }
    }

    // Get Category
    const [categoryList, setCategoryList] = useState([]);

    const getCategory = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/api/category/category-list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategoryList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

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
            h={'90vh'}
            px={'1.5'}
            w={'100%'}
            rounded={'xl'}
        >
            <Flex
                flexDir={'column'}
                justifyContent={'space-between'}
                h={'90vh'}
            >
                <Flex
                    flexDir={'column'}
                    alignItems={'center'}
                    h={'80vh'}
                    pt={'2'}
                >
                    <Box
                        border={'1px'}
                        borderColor={'white'}
                        position={'relative'}
                        mt={'0.5'}
                        rounded={'md'}
                        w={{lg:'210px', xl:'250px'}}
                        h={{lg:'150px', xl:'150px'}}
                    >
                        <Skeleton
                            isLoaded={isLoaded}
                            rounded={'md'}
                        >
                            <Image
                                objectFit={'cover'}
                                w={'250px'}
                                h={'150px'}
                                src={productImage ? URL.createObjectURL(productImage) : `http://localhost:8000/api${props.image}`}
                                alt='Product Image'
                                color={'white'}
                                rounded={'md'}
                            />
                        </Skeleton>
                        <Skeleton
                            isLoaded={isLoaded}
                        >
                            <Tooltip
                                label={'Upoad Image'}
                                hasArrow
                                bg={'black'}
                                color={'white'}
                                placement={'left'}
                                closeOnClick={false}
                                fontSize={'xs'}
                            >
                                <IconButton 
                                    icon={<FaUpload/>}
                                    position={'absolute'}
                                    top={'1'}
                                    right={'1'}
                                    size={'xs'}
                                    color={'white'}
                                    bg={'gray.700'}
                                    onClick={() => inputFile.current.click()}
                                />
                            </Tooltip>
                            <Input
                                type={'file'}
                                ref={inputFile}
                                onChange={(e) => {
                                    setProductImage(e.target.files[0])
                                }}
                                display={'none'}
                            />
                        </Skeleton>
                    </Box>
                    <Box
                        w={'90%'}
                        py={'1'}
                    >
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                >
                                    Product name
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Input
                                    size={'xs'}
                                    color={'black'}
                                    bg={'white'}
                                    variant={'outline'}
                                    type='text'
                                    letterSpacing={'tight'}
                                    placeholder={`Enter the Product's Name`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Category
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Select
                                    placeholder='Select Category'
                                    size={'xs'}
                                    variant={'outline'}
                                    color={'black'}
                                    bg={'white'}
                                    defaultValue={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {
                                        categoryList.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category?.category}
                                            </option>
                                        ))
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Stock
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Input
                                    size={'xs'}
                                    color={'black'}
                                    bg={'white'}
                                    variant={'outline'}
                                    type='number'
                                    letterSpacing={'tight'}
                                    placeholder='Product Stock'
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <Skeleton
                                isLoaded={isLoaded}
                                w={'max-content'}
                            >
                                <FormLabel
                                    fontSize={'sm'}
                                    color={'white'}
                                    mt={'0.5'}
                                >
                                    Price
                                </FormLabel>
                            </Skeleton>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Input
                                    size={'xs'}
                                    color={'black'}
                                    bg={'white'}
                                    variant={'outline'}
                                    type='number'
                                    letterSpacing={'tight'}
                                    placeholder='Product Price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Skeleton>
                        </FormControl>
                    </Box>
                </Flex>
                <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    h={'8vh'}
                    mb={'2'}
                    borderTop={'1px'}
                    borderColor={'white'}
                    pt={'2.5'}
                >
                    <Flex
                        w={'90%'}
                        justifyContent={'space-evenly'}
                    >
                        <Box>
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'sm'}
                                    colorScheme={'red'}
                                    color={'white'}
                                    onClick={() => props.handleCloseComponent()}
                                >
                                    Close
                                </Button>
                            </Skeleton>
                        </Box>
                        <Flex
                            justifyContent={'center'}
                            w={'30%'}
                        >
                            <Skeleton
                                isLoaded={isLoaded}
                            >
                                <Button
                                    size={'sm'}
                                    colorScheme={'green'}
                                    color={'white'}
                                    isLoading={loading}
                                    spinner={<PulseLoader size={8} color='white' />}
                                    onClick={onBtnEdit}
                                >
                                    Save
                                </Button>
                            </Skeleton>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
     );
}

export default ProductDetails;