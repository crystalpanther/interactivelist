import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import ProductsItem from "./ProductsItem";
import Context from "../context/context";

function ProductsList(props) {
    const {moveCard} = useContext(Context);

    return (
        <>
            {props.products.map((product, i) => (
                <ProductsItem
                    moveCard={moveCard}
                    key={product.id}
                    index={i}
                    productId={product.id}
                    productName={product.product}
                />
            ))}
        </>
    )
}

export default ProductsList;

ProductsList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired
}