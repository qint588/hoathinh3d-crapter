const listener = async (req, res) => {
  console.table(req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
};

module.exports = {
  listener,
};
