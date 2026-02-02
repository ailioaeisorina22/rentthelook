import React from "react";
import "./ProductPage.css";
import Feedback from "./Feedback";
import NavigationBar from "./NavigationBar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect  } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

const ProductPage = () => {
    const {pid} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qualityInfo, setQualityinfo] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [availabilityMessage, setAvailabilityMessage] = useState(null);


    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${pid}`)
        .then((res)=>res.json())
        .then((data)=>setProduct(data))
        .catch((err) => console.error("Eroare la preluarea produsului: ", err));
    }, [pid]);

    useEffect(() => {
      if (!selectedSize) return;
    
      fetch(`http://localhost:8080/api/rentals/blocked-dates?variantId=${selectedSize}`)
        .then(res => res.json())
        .then(data => setBlockedDates(data.map(d => new Date(d))))
        .catch(err => console.error("Eroare date ocupate:", err));
    }, [selectedSize]);

    useEffect(() => {
      if (product?.ProductSizes?.length > 0) {
        setSelectedSize(product.ProductSizes[0].SizeId); // selectează prima mărime automat
        setSelectedStock(product.ProductSizes[0].Stock);
      }
    }, [product]);

    if (!product) {
        return <p>Se încarcă produsul...</p>;
    }
   
    const handleAddToCart = async () => {
      const userId = localStorage.getItem("userId");

      if(!userId) {
        alert("Trebuie să fii autentificat pentru a închiria.");
        navigate('/login');
        return;
      }
    
      if (!selectedSize || !dateRange[0] || !dateRange[1]) {
        alert("Selectează o mărime și un interval de date!");
        return;
      }
    
      const days = Math.ceil((dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24));
      const totalPrice = days * product.PricePerDay;

      try {
        const response = await fetch("http://localhost:8080/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            UserId: userId,
            SizeId: selectedSize,
            StartDate: dateRange[0],
            EndDate: dateRange[1],
            ItemPrice: totalPrice
          })
        });
    
        const data = await response.json();
    
        if (response.ok) {
          alert("Produsul a fost adăugat în coș!");
          navigate('/cart');
        } else {
          alert("Eroare la adăugare: " + data.error);
        }
      } catch (err) {
        console.error("Eroare:", err);
        alert("Eroare la conectarea cu serverul.");
      }
    };
    
    
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const zi = String(date.getDate()).padStart(2, '0');
    const luna = String(date.getMonth() + 1).padStart(2, '0'); // lunile sunt 0-based
    const an = date.getFullYear();
    return `${zi}/${luna}/${an}`;
  };

  const handleAvailabilityCheck = async () => {
    const response = await fetch(`http://localhost:8080/api/rentals/blocked-dates?variantId=${selectedSize}`);
    const blocked = await response.json();
  
    const blockedDates = blocked.map(d => new Date(d));
    const conflict = blockedDates.some(date => {
      return date >= dateRange[0] && date <= dateRange[1];
    });
  
    if (conflict) {
      setAvailabilityMessage("Produsul nu este disponibil în perioada aleasă! Alegeți altă dată!");
    } else {
      setAvailabilityMessage("Produsul este pe stoc în perioada selectată!");
    }
  };

    return (
            <div> 
            <NavigationBar/>
            <h2 className="product-title">{product.ProductName}</h2>
            <div className="product-content">
                <div className="product-details">
                  <p className="product-subtitle">{product.Desription} {product.Brand}</p>
                  <div className="quality-detalis">
                    <p className="product-description">Calitate: {product.Quality}</p>
                    <button className="quality-info" onClick={() => setQualityinfo(true)} onBlur={() => setQualityinfo(false)}></button>
                    {
                      qualityInfo && 
                      <div className="quality-details-more">
                      <p>INFO Calitate produse:</p>
                      <li>Nouă: Produs nou, nepurtat, cu etichete.</li>
                      <li>Foarte bună: Produs purtat 1-2 ori.</li>
                      <li>Bună: Produs purtat de câteva ori, mai mult de 2 purtări.</li>
                      <li>Moderată: Produs purtat mai des, pot exista urme de uzură.</li>
                      </div>
                    }
                  </div>
                  <div className="size-selector">
                    <label htmlFor="size" className="size-label">Mărime:</label>
                    <select id="size" className="size-dropdown" onChange={(e) => {
                            const index = e.target.selectedIndex;
                            setSelectedSize(e.target.value);
                            setSelectedStock(product.ProductSizes[index].Stock);
                            setAvailabilityMessage(null);
                          }}>
                    {product.ProductSizes?.map((sizeObj, index) => (
                    <option key={index} value={sizeObj.SizeId}>
                      {sizeObj.Size }
                    </option>
                    ))}
                    </select>
                  </div>
                  <p className="product-description">Garanție: {product.Deposit} lei</p>
                  <p className="product-price">{product.PricePerDay} lei/zi</p>
                  <button className="rent-button" onClick={() => { setShowCalendar(!showCalendar); setDateRange([null, null])}}>Închiriază</button>

                  {showCalendar && (
                    <div>
                      <p className="product-subtitle">Alege data: </p>
                      <p className="product-description">Atenție! Durata de livrare poate fi între 2 și 5 zile!</p>
                      <div className="calendar">
                      <Calendar
                        onChange={setDateRange}
                        value={dateRange}
                        selectRange={true}
                        minDate={new Date()}
                      />
                      </div>
                      {dateRange[0] && dateRange[1] && (<div>
                                  <p className="product-description">
                                  De la: {formatDate(dateRange[0])}<br />
                                  Până la: {formatDate(dateRange[1])}
                                  </p>
                                  </div>)}
                      {dateRange[0] && dateRange[1] && (
                          selectedStock > 0 ? (
                            <div className="total-price">
                              <p>Număr zile: {Math.ceil((dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24))}</p>
                              <p>Total: {Math.ceil((dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24)) * product.PricePerDay} lei</p>
                              <button onClick={handleAddToCart}>Adaugă în coș</button>
                            </div>
                          ) : (
                            <>
                              <div className="availability-check">
                                <button className="disp-button" onClick={handleAvailabilityCheck}>Verifică disponibilitatea</button>
                                {availabilityMessage && (
                                  <span className={availabilityMessage.includes("pe stoc") ? "available" : "not-available"}>
                                    {availabilityMessage}
                                  </span>
                                )}
                              </div>

                              {availabilityMessage?.includes("pe stoc") && dateRange[0] && dateRange[1] && (
                                <div className="total-price">
                                  <p> Număr zile: {Math.ceil((dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24))}</p>
                                  <p> Total: {Math.ceil((dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24)) * product.PricePerDay} lei</p>
                                  <button onClick={handleAddToCart}>Adaugă în coș</button>
                                </div>
                            )}
                            </>
                          )
                        )}
                      
                      
                    </div>
                   )}
                </div>
                <div className="col-feedback">
                <div className="product-slider">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                  >
                    {product.Images?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img.Url} alt={product.ProductName} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <Feedback productId={pid} />
                </div>
            </div>
            </div>
          );
}

export default ProductPage;