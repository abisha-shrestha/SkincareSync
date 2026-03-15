// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";  
// import "./ProductGrid.css";


// export default function ProductGrid({ limit }) {
//   const navigate = useNavigate();  
//   const [allProducts, setAllProducts] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     fetch('http://localhost:3000/api/products')
//       .then(res => res.json())
//       .then(data => {
//         setAllProducts(data.products || data || []);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error:', err);
//         setLoading(false);
//       });
//   }, []);


//   const filteredProducts =
//     activeCategory === "All"
//       ? allProducts
//       : allProducts.filter((product) => product.category === activeCategory);


//   const displayedProducts = limit
//     ? filteredProducts.slice(0, limit)
//     : filteredProducts;


//   const handleProductClick = (productId) => {  // ✅ productId is parameter here
//     navigate(`/product/${productId}`);
//   };


//   if (loading) return <div>Loading products...</div>;


//   return (
//     <>
//       {!limit && (
//         <div className="products-filters">
//           {["All", "Hydration", "Repair", "Cleanser", "Toner"].map((category) => (
//             <button
//               key={category}
//               className={`filter-btn ${activeCategory === category ? "active" : ""}`}
//               onClick={() => setActiveCategory(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       )}


//       <div className="products-grid">
//         {displayedProducts.map((product) => (
//           <div
//             key={product._id}  // ✅ FIXED: only _id, no fallback
//             className="product-card"
//             onClick={() => handleProductClick(product._id)}  // ✅ FIXED: pass product._id
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="product-image" />
//             <h3>{product.name}</h3>
//             <p className="product-price">
//               Rs. {product.price.toLocaleString()}
//             </p>
//             <button className="btn btn-soft">
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }



















import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";

export default function ProductGrid({ limit }) {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data.products || data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = activeCategory === "All"
        ? allProducts
        : allProducts.filter(product => product.category === activeCategory);

    const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <>
            {!limit && (
                <div className="products-filters">
                    {["All", "Hydration", "Repair", "Cleanser", "Toner"].map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            <div className="products-grid">
                {displayedProducts.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => handleProductClick(product._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="product-image">
                            {product.imageUrl
                                ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                : null
                            }
                        </div>
                        <h3>{product.name}</h3>
                        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                        <button className="btn btn-soft">View Details</button>
                    </div>
                ))}
            </div>
        </>
    );
}