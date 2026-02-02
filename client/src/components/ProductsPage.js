import React from "react";
import NavigationBar from "./NavigationBar";
import './ProductsPage.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect  } from "react";
import { useSearchParams } from "react-router-dom";

const ProductsPage = () => {
    const location= useLocation();
    const [products, setProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/women/accs') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=WAccs'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/women/clothes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=WClothes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/women/shoes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=WShoes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    }else if (location.pathname === '/men/clothes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=MClothes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/men/accs') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=MAccs'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/men/shoes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=MShoes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/kids/clothes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=KClothes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/kids/shoes') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=KShoes'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
    } else if (location.pathname === '/kids/accs') {
        const sub = searchParams.get('subcategory');
        const url = sub 
        ? `http://localhost:8080/api/productsub?subcategory=${sub}`
        :'http://localhost:8080/api/products?category=KAccs'
        fetch(url) 
          .then(res => res.json())  
          .then(data => setProducts(data)) 
          .catch(err => console.error('Eroare la preluarea produselor:', err));  
      }  
  }, [location.pathname,searchParams]);  // useEffect se va executa de fiecare dată când ruta se schimbă

    const handleProductClick = (gender, category, productId) => {
        navigate(`/${gender}/${category}/${productId}`);
    };

    const handleFilterClick = (subcategory) => {
        setSearchParams({subcategory});
    }

    if(location.pathname === '/women/clothes'){
    return (
        <div className="women-clothes">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("wrochie")}>ROCHII</button>
                <button onClick={() => handleFilterClick("wbluza")}>BLUZE/CĂMĂȘI</button>
                <button onClick={() => handleFilterClick("wsacou")}>SACOURI</button>
                <button onClick={() => handleFilterClick("wpantaloni")}>PANTALONI</button>
                <button onClick={() => handleFilterClick("wfusta")}>FUSTE</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("women","clothes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/women/shoes'){
    return (
        <div className="women-shoes">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("wpantofi")}>PANTOFI</button>
                <button onClick={() => handleFilterClick("wsandale")}>SANDALE</button>
                <button onClick={() => handleFilterClick("wghete")}>GHETE</button>
                <button onClick={() => handleFilterClick("wpantofis")}>PANTOFI SPORT</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button" onClick={() => handleProductClick("women","shoes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/women/accs'){
    return (
        <div className="women-accs">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("wgeanta")}>GENȚI</button>
                <button onClick={() => handleFilterClick("wcercei")}>CERCEI</button>
                <button onClick={() => handleFilterClick("wcolier")}>COLIERE</button>
                <button onClick={() => handleFilterClick("wbratara")}>BRĂȚĂRI</button>
            </div>
            <div className="product-list">
            {products.map((product) => (
            <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("women","accs" ,product.ProductId)}>
                {product.Images && product.Images.length > 0 ? (
                <img 
                    src={`${product.Images[0].Url}`} 
                    alt={product.ProductName} 
                />
                ) : (
                <p>Fără imagine disponibilă</p>
                )}
                <p>{product.ProductName}</p>
                <p>{product.PricePerDay} lei/zi</p>
            </button>
            ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/men/clothes'){
    return (
        <div className="men-clothes">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("mbluza")}>BLUZE/CĂMĂȘI</button>
                <button  onClick={() => handleFilterClick("msacou")}>SACOURI</button>
                <button  onClick={() => handleFilterClick("mpantaloni")}>PANTALONI</button>
                <button  onClick={() => handleFilterClick("mcostum")}>COSTUME</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("men","clothes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/men/shoes'){
    return (
        <div className="men-shoes">
            <NavigationBar/>
            <div className="filter-bar">
                <button  onClick={() => handleFilterClick("mpantofi")}>PANTOFI</button>
                <button  onClick={() => handleFilterClick("mpantofis")}>PANTOFI SPORT</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("men","shoes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/men/accs'){
    return (
        <div className="men-accs">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("mbratara")}>BRĂȚĂRI</button>
                <button onClick={() => handleFilterClick("mcurea")}>CURELE</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("men","accs" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/kids/clothes'){
    return (
        <div className="kids-clothes">
            <NavigationBar/>
            <div className="filter-bar">
                <button  onClick={() => handleFilterClick("krochie")}>ROCHIȚE</button>
                <button  onClick={() => handleFilterClick("kcostum")}>COSTUME</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("kids","clothes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/kids/shoes'){
    return (
        <div className="kids-shoes">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("kpantofi")}>PANTOFI</button>
                <button onClick={() => handleFilterClick("kpantofis")}>PANTOFI SPORT</button>
                <button onClick={() => handleFilterClick("ksandale")}>SANDALE</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("kids","shoes" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
   else if(location.pathname === '/kids/accs'){
    return (
        <div className="kids-accs">
            <NavigationBar/>
            <div className="filter-bar">
                <button onClick={() => handleFilterClick("kgeanta")}>GENȚI</button>
                <button onClick={() => handleFilterClick("kcercei")}>CERCEI</button>
                <button onClick={() => handleFilterClick("kbratara")}>BRĂȚĂRI</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                <button key={product.ProductId} className="product-button"  onClick={() => handleProductClick("kids","accs" ,product.ProductId)}>
                    {product.Images && product.Images.length > 0 ? (
                    <img 
                        src={`${product.Images[0].Url}`} 
                        alt={product.ProductName} 
                    />
                    ) : (
                    <p>Fără imagine disponibilă</p>
                    )}
                    <p>{product.ProductName}</p>
                    <p>{product.PricePerDay} lei/zi</p>
                </button>
                ))}
            </div>
        </div>
    );
   }
}

export default ProductsPage;