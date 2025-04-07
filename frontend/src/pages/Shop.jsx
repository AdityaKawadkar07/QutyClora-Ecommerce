import React, { useState, useEffect, useContext } from 'react';
import '../pages/CSS/Shop.css';
import Item from '../components/Item/Item';
// import all_product from '../components/assets/all_product';
import { ShopContext } from '../context/ShopContext';
// import { ShopContext } from '../context/ShopContext';

const Shop = () => {
  const {all_product} = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(all_product);

  // Function to handle search and apply filter
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Function to handle sorting
  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  // Apply filtering and sorting whenever searchQuery or sortOption changes
  useEffect(() => {
    if (!all_product) return;
    let filtered = all_product.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );

    if (sortOption === 'az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'za') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'priceLowHigh') {
      filtered.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOption === 'priceHighLow') {
      filtered.sort((a, b) => b.new_price - a.new_price);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, sortOption,all_product]);

  return (
    <div>
      <div className="shop">
        <h1>GO Naturals, With Our Exclusive Products </h1>
        <hr />
        <div className="shop-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <select onChange={handleSort} className="sort-dropdown" value={sortOption}>
            <option value="">Sort by</option>
            <option value="az">Alphabetically A-Z</option>
            <option value="za">Alphabetically Z-A</option>
            <option value="priceLowHigh">Cost Price: Low to High</option>
            <option value="priceHighLow">Cost Price: High to Low</option>
          </select>
        </div>

        {/* Real-time Search Results Section */}
        <div className="products-container">
          {filteredProducts.length > 0 ? (
            <div className="products">
              {filteredProducts.map((item, i) => (
                <Item
                  key={i}
                  id={item.id}
                  name={item.name}
                  image={item.image[0]}
                  new_price={item.new_price}
                  old_price={item.old_price}
                />
              ))}
            </div>
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
