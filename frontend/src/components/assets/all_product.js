import p1_img from "./product_1.png";
import p2_img from "./product_2.png";
import p3_img from "./product_3.png";
import p4_img from "./product_4.png";
import p5_img from "./product_5.png";
import p6_img from "./product_6.png";
import p7_img from "./product_7.png";
import p8_img from "./product_8.png";
import p9_img from "./product_9.png";
import p10_img from "./product_10.png";
import p11_img from "./product_11.png";
import p12_img from "./product_12.png";
import p13_img from "./product_13.png";
import p14_img from "./product_14.png";
import p15_img from "./product_15.png";
import p16_img from "./product_16.png";
import p17_img from "./product_17.png";
import p18_img from "./product_18.png";
import p19_img from "./product_19.png";
import p20_img from "./product_20.png";
import p21_img from "./product_21.png";
import p22_img from "./product_22.png";
import p23_img from "./product_23.png";
import p24_img from "./product_24.png";
import p25_img from "./product_25.png";
import p26_img from "./product_26.png";
import p27_img from "./product_27.png";
import p28_img from "./product_28.png";
import p29_img from "./product_29.png";
import p30_img from "./product_30.png";
import p31_img from "./product_31.png";
import p32_img from "./product_32.png";
import p33_img from "./product_33.png";
import p34_img from "./product_34.png";
import p35_img from "./product_35.png";
import p36_img from "./product_36.png";

let all_product = [
  // Women's Collection
  {
    id: 1,
    name: "Inarrch NONI Extract (Herbal)",
    category: "women",
    image: p1_img,
    new_price: 50.0,
    old_price: 80.5,
  },
  {
    id: 2,
    name: "Inarrch OMEGA3 1000mg",
    category: "women",
    image: p2_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 3,
    name: "Chiffon Polka Dot Wrap Dress",
    category: "women",
    image: p3_img,
    new_price: 60.0,
    old_price: 100.5,
  },
  {
    id: 4,
    name: "Inarrch Hand & Foot Skin Polisher",
    category: "women",
    image: p4_img,
    new_price: 100.0,
    old_price: 150.0,
  },
  {
    id: 5,
    name: "Sleeveless Ruffle Trim Blouse",
    category: "women",
    image: p5_img,
    new_price: 85.0,
    old_price: 120.5,
  },

  // Men's Collection
  {
    id: 6,
    name: "Men's Slim Fit Denim Jacket",
    category: "men",
    image: p6_img,
    new_price: 110.0,
    old_price: 160.0,
  },
  {
    id: 7,
    name: "Casual Plaid Cotton Shirt",
    category: "men",
    image: p7_img,
    new_price: 75.0,
    old_price: 110.0,
  },
  {
    id: 8,
    name: "Men's Waterproof Windbreaker",
    category: "men",
    image: p8_img,
    new_price: 95.0,
    old_price: 140.5,
  },
  {
    id: 9,
    name: "Classic Leather Bomber Jacket",
    category: "men",
    image: p9_img,
    new_price: 130.0,
    old_price: 180.0,
  },
  {
    id: 10,
    name: "Cotton Zipper Hoodie",
    category: "men",
    image: p10_img,
    new_price: 80.0,
    old_price: 115.5,
  },

  // Shoes Collection
  {
    id: 11,
    name: "White Low-Top Sneakers",
    category: "shoes",
    image: p11_img,
    new_price: 70.0,
    old_price: 100.0,
  },
  {
    id: 12,
    name: "Black Leather Formal Shoes",
    category: "shoes",
    image: p12_img,
    new_price: 120.0,
    old_price: 160.0,
  },
  {
    id: 13,
    name: "Women's Running Shoes",
    category: "shoes",
    image: p13_img,
    new_price: 90.0,
    old_price: 130.0,
  },
  {
    id: 14,
    name: "High-Top Canvas Sneakers",
    category: "shoes",
    image: p14_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 15,
    name: "Men’s Trail Running Shoes",
    category: "shoes",
    image: p15_img,
    new_price: 110.0,
    old_price: 150.5,
  },

  // Accessories Collection
  {
    id: 16,
    name: "Luxury Leather Wallet",
    category: "accessories",
    image: p16_img,
    new_price: 45.0,
    old_price: 70.0,
  },
  {
    id: 17,
    name: "Men's Stainless Steel Watch",
    category: "accessories",
    image: p17_img,
    new_price: 150.0,
    old_price: 200.0,
  },
  {
    id: 18,
    name: "Classic Aviator Sunglasses",
    category: "accessories",
    image: p18_img,
    new_price: 80.0,
    old_price: 110.5,
  },
  {
    id: 19,
    name: "Women's Elegant Pearl Necklace",
    category: "accessories",
    image: p19_img,
    new_price: 130.0,
    old_price: 180.0,
  },
  {
    id: 20,
    name: "Sports Digital Smartwatch",
    category: "accessories",
    image: p20_img,
    new_price: 200.0,
    old_price: 250.0,
  },
  {
    id: 21,
    name: "Boho Maxi Floral Dress",
    category: "women",
    image: p21_img,
    new_price: 95.0,
    old_price: 140.0,
  },
  {
    id: 22,
    name: "Knitted Winter Cardigan",
    category: "women",
    image: p22_img,
    new_price: 80.0,
    old_price: 120.5,
  },
  {
    id: 23,
    name: "V-Neck Satin Blouse",
    category: "women",
    image: p23_img,
    new_price: 70.0,
    old_price: 110.0,
  },
  {
    id: 24,
    name: "Slim Fit High-Waisted Jeans",
    category: "women",
    image: p24_img,
    new_price: 90.0,
    old_price: 130.0,
  },

  // Men's Collection
  {
    id: 25,
    name: "Classic Woolen Overcoat",
    category: "men",
    image: p25_img,
    new_price: 160.0,
    old_price: 220.0,
  },
  {
    id: 26,
    name: "Striped Cotton Polo T-Shirt",
    category: "men",
    image: p26_img,
    new_price: 55.0,
    old_price: 90.0,
  },
  {
    id: 27,
    name: "Casual Denim Shirt",
    category: "men",
    image: p27_img,
    new_price: 75.0,
    old_price: 110.0,
  },
  {
    id: 28,
    name: "Men's Formal Blazer",
    category: "men",
    image: p28_img,
    new_price: 190.0,
    old_price: 250.0,
  },

  // Shoes Collection
  {
    id: 29,
    name: "Women's Strappy High Heels",
    category: "shoes",
    image: p29_img,
    new_price: 100.0,
    old_price: 140.0,
  },
  {
    id: 30,
    name: "Men’s Casual Loafers",
    category: "shoes",
    image: p30_img,
    new_price: 85.0,
    old_price: 120.0,
  },
  {
    id: 31,
    name: "Sporty Mesh Running Shoes",
    category: "shoes",
    image: p31_img,
    new_price: 110.0,
    old_price: 150.0,
  },
  {
    id: 32,
    name: "Leather Chelsea Boots",
    category: "shoes",
    image: p32_img,
    new_price: 140.0,
    old_price: 200.0,
  },

  // Accessories Collection
  {
    id: 33,
    name: "Unisex Beanie Winter Cap",
    category: "accessories",
    image: p33_img,
    new_price: 25.0,
    old_price: 50.0,
  },
  {
    id: 34,
    name: "Women's Fashion Shoulder Bag",
    category: "accessories",
    image: p34_img,
    new_price: 90.0,
    old_price: 130.0,
  },
  {
    id: 35,
    name: "Men’s Leather Belt",
    category: "accessories",
    image: p35_img,
    new_price: 40.0,
    old_price: 70.0,
  },
  {
    id: 36,
    name: "Minimalist Gold Pendant Necklace",
    category: "accessories",
    image: p36_img,
    new_price: 85.0,
    old_price: 120.5,
  },
];

export default all_product;

