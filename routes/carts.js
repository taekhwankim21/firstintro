const express = require("express");

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");
const router = express.Router();

router.get("/carts", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => {
    return cart.goodsId;
  })

  const goods = await Goods.find({ goodsId: goodsIds });
  // Goods에 해당하는 모든 정보를 가지고 올건데,
  // 만약 goodsIds 변수 안에 존재하는 값일 때에만 조회하라.

  const results = carts.map((cart) => {
		return {
			"quantity": cart.quantity,
			"goods": goods.find((item) => item.goodsId === cart.goodsId)
		};
  });

  res.json({
    "carts": results,
  });
});

module.exports = router;