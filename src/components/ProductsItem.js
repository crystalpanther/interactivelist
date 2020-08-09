import React, {useContext, useImperativeHandle, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { DragSource, DropTarget } from 'react-dnd'
import Context from '../context/context';
import {ItemTypes} from './ItemTypes';

const useStyles = makeStyles((theme) =>(
    {
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        root: {
            minWidth: 275,
        },
        title: {
            fontSize: 14,
        }
    }
));

const Card = React.forwardRef(
    ({ productName, productId, isDragging, connectDragSource, connectDropTarget }, ref) => {
        const elementRef = useRef(null)
        const {deleteProduct, handleClickOpen} = useContext(Context);
        const classes = useStyles();
        connectDragSource(elementRef)
        connectDropTarget(elementRef)
        const opacity = isDragging ? 0 : 1
        useImperativeHandle(ref, () => ({
            getNode: () => elementRef.current,
        }))
        return (
            <Grid item xs={12} ref={elementRef} style={{ opacity }}>
                <div className={"ProductsItem"} draggable>
                    <div className={"ProductsItem--Col ProductsItem--Name"}>
                        <p>{productName}</p>
                    </div>
                    <div className={"ProductsItem--Col ProductsItem--Buttons"}>
                        <IconButton aria-label="delete" className={classes.margin}
                                    onClick={handleClickOpen.bind(null, productName, productId)}>
                            <CreateIcon />
                        </IconButton>
                        <IconButton aria-label="delete" className={classes.margin} onClick={deleteProduct.bind(null, productId)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            </Grid>
        )
    },
)

export default DropTarget(
    ItemTypes.CARD,
    {
        hover(props, monitor, component) {
            if (!component) {
                return null
            }
            // node = HTML Div element from imperative API
            const node = component.getNode()
            if (!node) {
                return null
            }
            const dragIndex = monitor.getItem().index
            const hoverIndex = props.index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = node.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            props.moveCard(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            monitor.getItem().index = hoverIndex
        },
    },
    (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }),
)(
    DragSource(
        ItemTypes.CARD,
        {
            beginDrag: (props) => ({
                id: props.productId,
                index: props.index,
            }),
        },
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    )(Card),
)

// export default function ProductsItem(product) {
//     const {deleteProduct, handleClickOpen} = useContext(Context);
//     const classes = useStyles();
//
//     return (
//         <Grid item xs={12}>
//             <div className={"ProductsItem"} draggable>
//                 <div className={"ProductsItem--Col ProductsItem--Name"}>
//                     <p>{product.productName}</p>
//                 </div>
//                 <div className={"ProductsItem--Col ProductsItem--Buttons"}>
//                     <IconButton aria-label="delete" className={classes.margin}
//                                 onClick={handleClickOpen.bind(null, product.productName, product.productId)}>
//                         <CreateIcon />
//                     </IconButton>
//                     <IconButton aria-label="delete" className={classes.margin} onClick={deleteProduct.bind(null, product.productId)}>
//                         <DeleteIcon />
//                     </IconButton>
//                 </div>
//             </div>
//         </Grid>
//     )
// }