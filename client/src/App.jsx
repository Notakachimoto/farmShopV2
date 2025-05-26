import { useEffect, useState } from 'react';
import map from './assets/map.svg';
import logo from './assets/logo.svg';
import search from './assets/search.svg';
import bag from './assets/bag.svg';
import PriceFilter from './components/PriceFilter';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import Cart from './components/Cart'
import MoreInfo from './components/MoreInfo'

function App() {
  const [user, setUser] = useState([])
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([])
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [actualProduct, setActualProduct] = useState(undefined)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 8;

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/decode-token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка токена');
      
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error('Ошибка:', err);
      localStorage.removeItem('token');
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const url = selectedCategory
      ? `http://localhost:3000/api/products?category=${encodeURIComponent(selectedCategory)}`
      : 'http://localhost:3000/api/products';
    
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, [selectedCategory]);

  const handlePriceChange = (minPrice, maxPrice) => {
    setMinPrice(minPrice)
    setMaxPrice(maxPrice)
    setCurrentPage(1);
    console.log(`Price range changed: ${minPrice} – ${maxPrice} ₽`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesSearch;
  });
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser([]);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  const removeFromCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex >= 0) {
        const existingProduct = prevCart[existingProductIndex];
        
        if (existingProduct.quantity === 1) {
          return prevCart.filter(item => item.id !== product.id);
        } else {
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex] = {
            ...existingProduct,
            quantity: existingProduct.quantity - 1
          };
          return updatedCart;
        }
      }
      return prevCart;
    });
  };
  const removeProduct = (product) =>{
    const prevCart = cart.filter(item => item.id !== product.id)
    setCart(prevCart)
    return
  }
  const selectProduct = (product) =>{
    setShowMoreInfo(true) 
    setActualProduct(product)
    return
  }
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="footer1">      
        <div className="adress">
          <img src={map} className="map-icon"/>
          <p>Улица Пушкина Дом Колотушкина</p>
        </div>
          {user.length !== 0 ? (
            <div className="reg">
            <p className="user-name">Ваше имя: {user.name}</p>
            <p className="user-email">Ваша почта: {user.email}</p>
            <p onClick={handleLogout}>Выйти</p>
            </div>
          ) : (  
            <div className="reg2">
              <p onClick={() => setShowLoginModal(true)}>Войти</p>
              {showLoginModal && (
                <LoginModal 
                  onSuccess={fetchUserData}
                  onClose={() => setShowLoginModal(false)}
                  onLoginClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                />
              )}
              <p>/</p>
              <p onClick={() => setShowRegisterModal(true)}>Регистрация</p>
              {showRegisterModal && (
                <RegisterModal 
                  onClose={() => setShowRegisterModal(false)}
                  onSuccess={fetchUserData}
                  onLoginClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                />
              )}
            </div>
          )}
      </div>
      <div className="footer2">
        <div className="logo-container">
          <img src={logo} className="logo" />
          <h1>ЭкоБазар</h1>
        </div>
        <div className="search-container">
          <div className="search">
            <img src={search} className="search-icon"/>
            <input placeholder="поиск"
            value={searchQuery}
            onChange={handleSearchChange}
            />
          </div>
          <button>Поиск</button>
        </div>
        <div className="bag-container">
          <img src={bag} onClick={() => setShowCart(true)} />
          <div className="bag-name">
            <p>корзина</p>
            <h1>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ₽</h1>
          </div>
          {showCart &&
          <Cart 
            cartItems={cart} 
            onAdd={addToCart} 
            onRemove={removeFromCart}
            onDelete={removeProduct}
            onClose={() => {setShowCart(false)}
          }
          />}
        </div>
      </div>
      <div className="background">
        <p>8 (800) 333-88-68</p>
      </div>
      <div className="main-pos">
        <div className="main-container">
          <div className="left-side">
            <div className="filter-container">
              <h1>Категории</h1>
              <label className="circle-checkbox">
                <input 
                  type="radio" 
                  className="circle-checkbox__input" 
                  name="foodCategory" 
                  value=""
                  onChange={() => setSelectedCategory('')}
                />
                <span className="circle-checkbox__control"></span>
                <p>Все категории</p>
              </label>
              <label className="circle-checkbox">
                <input 
                  type="radio" 
                  className="circle-checkbox__input" 
                  name="foodCategory" 
                  value="Овощи"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span className="circle-checkbox__control"></span>
                <p>Овощи</p>
              </label>
              <label className="circle-checkbox">
                <input 
                  type="radio" 
                  className="circle-checkbox__input" 
                  name="foodCategory" 
                  value="Фрукты"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span className="circle-checkbox__control"></span>
                <p>Фрукты</p>
              </label>
              <label className="circle-checkbox">
                <input 
                  type="radio" 
                  className="circle-checkbox__input" 
                  name="foodCategory" 
                  value="Сыры"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span className="circle-checkbox__control"></span>
                <p>Сыры</p>
              </label>
            </div>
            <div>
              <h1>Цена</h1>
              <PriceFilter onPriceChange={handlePriceChange} />
            </div>
          </div>
          <div className="right-side">
            <div className="product-slider">
              <div className="slider-container2">
                {currentProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                    <div className="product-info">
                      <p className="product-name">{product.name}</p>
                      <p className="product-price">{product.price} ₽</p>
                    </div>
                    <button className="add-to-cart" onClick={() => selectProduct(product)} >Подробнее</button>
                    <button className="add-to-cart" onClick={() => addToCart(product)} >Добавить</button>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button onClick={handlePrevPage} className="prev-btn" disabled={currentPage === 1}>
                  ←
                </button>
                <span className="page-number">{currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} className="next-btn" disabled={currentPage === totalPages}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
        {showMoreInfo && 
          <MoreInfo 
            product={actualProduct}
            onClose={() => setShowMoreInfo(false)}
          />
        }
      </div>
    </>
  );
}

export default App;