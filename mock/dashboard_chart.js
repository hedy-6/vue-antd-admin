function chart(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [20, 40, 87, 65, 38, 17];
      break;
    default:
      res = null;
      break;
  }
  return res;
}

module.exports = chart;
