'use strict';

module.exports = function (app) {

  let likeArray = [{
    stock: "AMD",
    likes: new Set(["::ffff:127.0.0.1"])
  }];

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock } = req.query;
      const { like } = req.query;
      console.log("stock:", stock, "like:", like);
      console.log("IP", req.ip, req.socket.remoteAddress);

      const stocks = Array.isArray(stock) ? stock : [stock];
      console.log("stocks", stocks);

      const addLike = (stock) => {
        const foundStock = likeArray.find(s => s.symbol === stock);
        if (foundStock) {
          foundStock.likes.add(req.ip)
        } else {
          likeArray.add({
            stock: stock,
            likes: new Set([req.ip])
          });
        }
      }

      if (like) stocks.forEach(s => addLike(s));
      console.log(likeArray);

      const stockData = await Promise.all(
        stocks.map(async (stock) => {
          const sData = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
          const data = await sData.json();
          return {
            stock: data.symbol,
            price: data.latestPrice,
            likes: 0
          };
        })
      );

      const result = stockData.length < 2 ? stockData[0] : stockData;
      console.log("result", result);
      res.json(result);
    });

};
