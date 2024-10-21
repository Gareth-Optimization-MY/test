import React from 'react'

import { Tile, reactExtension, useApi, useCartSubscription } from '@shopify/ui-extensions-react/point-of-sale'

function getRoundingPrice(price){
  const scndDecimalPrice = Math.floor(price * 100) % 10;
  const firstDecimalPrice = Math.floor(price * 10) % 10;

  if (scndDecimalPrice < 3){
    return Math.floor(price) + (firstDecimalPrice/10)
  } else if (scndDecimalPrice >= 3 && scndDecimalPrice <= 5){
    return Math.floor(price) + 0.05 + (firstDecimalPrice/10)
  } else if(scndDecimalPrice > 5 && scndDecimalPrice <= 7) {
    return Math.floor(price) + 0.05 + (firstDecimalPrice/10)
  } else {  
    return Math.floor(price) + ((firstDecimalPrice+1)/10)
  }
};

function getRoundingDecimal(originalPrice){
  return getRoundingPrice(originalPrice) - originalPrice
}

const TileComponent = () => { 
  const api = useApi();
  const cart = useCartSubscription();
  const item = cart.lineItems.filter(item=>item.title === 'Rounding');
 
  const removeRounding = async (items) => {
    if (items.length > 0 ){
      await api.cart.removeLineItem(items[0].uuid)
      saleDiscountClassifier(cart.grandTotal - items[0].price)
    } else {
      saleDiscountClassifier(cart.grandTotal)
    }
  }

  const saleDiscountClassifier = async (originalPrice) => {
    if (item)
    await api.cart.addCustomSale({
      title: 'Rounding',
      quantity: 1,
      price: getRoundingDecimal(originalPrice).toString(),
      taxable: false,
    })
  }

  return (
    <Tile
      title="Round Cart Price"
      subtitle={`Total: MYR ${(cart.grandTotal-(item[0]?.price || 0)).toFixed(2)}\nRounded: MYR ${(getRoundingPrice(cart.grandTotal-(item[0]?.price || 0))).toFixed(2)}`}
      enabled
      onPress={() => removeRounding(item)}
    />
  );
};

export default reactExtension('pos.home.tile.render', () => {   
  return <TileComponent />
})