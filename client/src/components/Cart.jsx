import React, { useState } from 'react';

const Cart = ({ cartItems, onAdd, onRemove, onClose, onDelete }) =>{
    return(
        <div className="cart-modal">
            <div className="cart">
                <button className="cart-modal-close" onClick={() => onClose()}>Х</button>
                <div className="cart-table-container">
                <table>
                    <colgroup>
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th scope="col">Продукт</th>
                        <th scope="col">Цена</th>
                        <th scope="col">Количество</th>
                        <th scope="col">Суммарная цена</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((product) => (
                        <tr key={product.id}>
                            <td scope="row" className="td1">
                            <div className="product-name-img">
                                <img src={product.image_url} alt={product.name} />
                                <p>{product.name}</p>
                            </div>
                            </td>
                            <td className="td2">{product.price} руб.</td>
                            <td className="td3">
                            <button onClick={() => onRemove(product)}>-</button>
                            <span>{product.quantity}</span>
                            <button onClick={() => onAdd(product)}>+</button>
                            </td>
                            <td className="td4">{product.quantity * product.price} руб.</td>
                            <td className="td5" onClick={() => onDelete(product)}>Х</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                            Корзина пуста
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                <div className="cart-total">
                <button>Купить</button>
                <h1>Итого: {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)} руб.</h1>
                </div>
            </div>
        </div>
    )
}

export default Cart