import React, { useContext } from 'react'
import {ShopContext} from '../context/ShopContext'
import {useParams} from 'react-router-dom'
import Breadcrum from '../components/Breadcrums/Breadcrum';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';
import UtilityBox from '../components/UtilityBox/UtilityBox';

const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}= useParams();
  const product = all_product.find((e)=> e.id === Number(productId));

  if (!product) {
    return <div>Loading product...</div>
  }

  return (
    <div >
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <UtilityBox product={product} />
      <RelatedProducts/>
    </div>
  )
}

export default Product