// express에서 제공되는 Router 함수를 사용해 Router를 생성합니다.
const express = require('express');
const { resourceLimits } = require('worker_threads');
const router = express.Router();

const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

// 상품 목록 조회 API
// ({"goods":goods}) > ({goods}) 만 써도됨
router.get("/goods", (req,res) => {
  res.status(200).json({"goods":goods})
});

// 상품 상세 조회 API
router.get("/goods/:goodsId", (req,res) => {
  const {goodsId} = req.params;
  // let result = null;
  // for(const good of goods){
  //   if( Number(goodsId) === good.goodsId) {
  //     result = good;
  //   }
  // }
  // // 위와 동일한 코드
  const [detail] = goods.filter((good) =>  Number(goodsId) === good.goodsId);
  res.status(200).json({detail});
})

const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async(req,res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId});
  if (existsCarts.length){
    return res.status(400).json({
      success:false,
      errorMessage:"이미 장바구니에 존재합니다"
    })
  }

  await Cart.create({goodsId, quantity});

  res.json({result: "success"});
})

router.put("/goods/:goodsId/cart", async(req,res) => {
  const {goodsId} = req.params;
  const {quantity} =req.body;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.updateOne(
      {goodsId: goodsId},
      {$set: {quantity:quantity}}
    )
  }
  res.status(200).json({success:true});
})

router.delete("/goods/:goodsId/cart", async(req,res) => {
  const {goodsId} = req.params;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }

  res.json({result:"success"});
})

const Goods = require("../schemas/goods.js");
router.post("/goods/", async (req,res) => {
  const {goodsId, name, thumbnailUrl, category, price} = req.body;

  const goods = await Goods.find({goodsId});

  if (goods.length) {
    return res.status(400).json({ 
      success: false, 
      errorMessage: "이미 있는 goodsID입니다." 
    });
  }

  const createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});

  res.json({ goods: createdGoods });
});

// 작성한 Router를 app.js에서 사용하기 위해 하단에 내보내주는 코드를 추가합니다.
module.exports = router;