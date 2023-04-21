const onRedirect = function (user, context, callback) {
  // context.redirect からの再開でない場合は本処理を終了する
  if (context.protocol && context.protocol !== 'redirect-callback') {
    return callback(null, user, context);
  }

  // クエリパラメータを取得
  const request = context.request || {};
  const query = request.query || {};

  // ユーザが同意すれば認証成功
  if (query.answer && query.answer === 'yes') {
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.agreed = 'yes';
    auth0.users
      .updateAppMetadata(user.user_id, user.app_metadata)
      .then(function () {
        callback(null, user, context);
      })
      .catch(function (err) {
        callback(err);
      });

    return;
  }

  // ユーザが拒否すれば認証失敗
  return callback(
    new UnauthorizedError('同意しないと使えません'),
    user,
    context,
  );
};
