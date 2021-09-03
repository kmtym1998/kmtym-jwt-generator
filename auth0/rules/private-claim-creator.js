// TODO: auth0 deploy cli 使いたい

// 実際は関数名いらない
function redundantDefinition(user, context, callback) {
  // user_metadataをidTokenのプライベートクレームに突っ込む
  context.idToken['https://kmtym-jwt-generator.vercel.app'] =
    user.user_metadata;

  // app_metadataをaccessTokenのプライベートクレームに突っ込む
  context.accessToken['https://kmtym-jwt-generator.vercel.app'] =
    user.app_metadata;

  return callback(null, user, context);
}
