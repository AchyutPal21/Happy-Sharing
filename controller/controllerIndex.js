exports.renderHome = function (req, res) {
  res.status(200).render("index", {
    sendMail: `${process.env.APP_BASE_URL}/file/download/email`,
  });
};
