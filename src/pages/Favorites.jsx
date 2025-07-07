import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Favorites = () => {
  const { favorites } = useContext(ShopContext);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">المفضلة</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد منتجات مفضلة بعد.</p>
      ) : (
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
          {favorites.map((item) => (
            <ProductItem
              key={item.product_id}
              id={item.product_id}
              name={item.name}
              image={item.image}
              price={item.price}
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 