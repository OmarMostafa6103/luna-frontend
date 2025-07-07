import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProduct = ({ category, subCategory, scrollToProduct }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 10));
    }
  }, [products]);

  return (
    <div className='my-24'>
      <div className="text-center py-2 text-3xl">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
        <p className="w-3/4 m-auto text-xs sm:text:sm md:text-base ">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </p>
      </div>

    
      <div className="grid overflow-hidden grid-cols-2 mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {related.map((item, index) => (
          <div className="cursor-pointer border-2 rounded-md dark:border-none border-gray-400 px-3"
            key={index}
            
            onClick={() => {
              scrollToProduct(); 
              window.location.href = `/product/${item.product_id}`; 
            }}
          >
            <ProductItem id={item.product_id} image={item.image} name={item.name} price={item.price} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProduct;
