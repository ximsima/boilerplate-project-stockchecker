'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock } = req.query;
      const { like } = req.query;
      console.log("stock:", stock, "like:", like);

      const stocks = Array.isArray(stock) ? stock : [stock];
      console.log("stocks", stocks);

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
