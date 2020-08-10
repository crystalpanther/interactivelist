import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ProductsList from './ProductsList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Context from '../context/context';
import update from 'immutability-helper';
import Pagination from '@material-ui/lab/Pagination';

let data = require('../data/data.json');

export default function Main() {
    const [value, setValue] = useState('');
    const [open, setOpen] = React.useState(false);
    const [newValue, setNewValue] = useState('');
    const [edit, setEdit] = useState('');
    const [products, setProducts] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const handleClose = () => {
        setOpen(false);
    };
    

    useEffect(() => {
        localStorage.setItem('productsInCart', JSON.stringify(products));
        
    }, [products])

    data =  JSON.parse(localStorage.getItem('productsInCart',products));
    console.log(data)
    const submitHandler = (event) => {
        event.preventDefault()
        if (value) {
            let product = {
                id: parseInt(Math.random(Date.now()) * 100) ,
                product: value
            }
            products.unshift(product)
            localStorage.setItem('productsInCart', JSON.stringify(products))
            alert('Добавлен продукт');
        }
        else {
            alert("Введите продукт")
        }
        setValue('');
    }

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id))
        localStorage.setItem('productsInCart', JSON.stringify(products))
    }
    const editProduct = (name, id) => {
        setEdit(products.filter(product => product.id === id))
        localStorage.setItem('productsInCart', JSON.stringify(products))
    }
    const handleClickOpen = (product, id) => {
        setOpen(true)
        editProduct(product, id)
        setNewValue(product)
    };
    const handleChangeProduct = () => {
        // eslint-disable-next-line
        products.map(product => {
            if (product.id === edit[0].id) {
                product.product = newValue
                return product
            }
        })
        localStorage.setItem('productsInCart', JSON.stringify(products))
        handleClose();
    }

    const moveCard = (dragIndex, hoverIndex) => {
        const dragCard = products[dragIndex]
        setProducts(
            update(products, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }),
        )
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <Context.Provider value={{deleteProduct, editProduct, handleClickOpen, moveCard}}>
            <div className={"Main"}>
                <Container>
                    <Grid
                        item
                        xs={7}
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid container item xs={12} spacing={3}>
                            <h1>Products list</h1>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            <div className={"Main--Form"}>
                                <form  noValidate autoComplete="off" onSubmit={(e) => submitHandler(e)}>
                                    <Grid container item xs={12} className={"Main--FormRow"}>
                                        <TextField required id="product" label="Product Name" type="text" value={value} onChange={e => setValue(e.target.value)} />
                                        <div className={"Main--FormButton"}>
                                            <Button type="submit" className={"Main--FormButton"} variant="contained" color="primary">
                                                Add product
                                            </Button>
                                        </div>
                                    </Grid>
                                </form>
                            </div>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            <div className={"ProductsList"}>
                                {products.length > 0 ?
                                    <DndProvider backend={HTML5Backend}>
                                        <ProductsList products={currentProducts} />
                                    </DndProvider> :
                                    <p>Список пуст!</p>}
                                <Pagination color={"primary"} count={productsPerPage} page={currentPage} onChange={handleChangePage} />
                            </div>
                        </Grid>
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Edit"}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    onChange={e => setNewValue(e.target.value)}
                                    autoFocus
                                    id="name"
                                    type="text"
                                    fullWidth
                                    value={newValue}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Disagree
                                </Button>
                                <Button onClick={() => handleChangeProduct()} color="primary" autoFocus>
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Container>
            </div>
        </Context.Provider>
    )
}