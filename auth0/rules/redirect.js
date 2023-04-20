const redirect = function (user, context, callback) {
  const metadata = user.app_metadata || {};

  // すでに規約同意している場合は何もせず終了
  if (metadata.agreed) {
    return callback(null, user, context);
  }

  context.redirect = {
    url: "https://google.com"
  };

  return callback(null, user, context);
}
