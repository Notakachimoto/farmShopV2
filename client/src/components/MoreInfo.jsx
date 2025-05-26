import React, { useState } from 'react';

const MoreInfo = ({ product, onClose,}) =>{
    return(
        <div className="modal-overlay">
            <div className="modal-content moreInfo-content">
            <button className="cart-modal-close" onClick={() => onClose()}>X</button>
                <div className="moreInfo">
                    <div className="moreInfo-left">
                        <img src={product.image_url} />
                        <h1>{product.category}</h1>
                        <p>{product.price} руб.</p>
                    </div>
                    <div className="moreInfo-right">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoreInfo