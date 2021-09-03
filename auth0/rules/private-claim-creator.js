// TODO: auth0 deploy cli 使いたい

// 実際は関数名いらない
function redundantDefinition(user, context, callback) {
  const PRV_CLAIM_KEY = 'https://kmtym-jwt-generator.vercel.app';
  const EMOJIs = [
    '😩',
    '🦩',
    '💞',
    '😇',
    '🥀',
    '👽',
    '🐋',
    '🌃',
    '🎯',
    '🥗',
    '🔪',
    '🍣',
    '🚗',
    '⛄',
    '🍄',
  ];
  const randEmoji = EMOJIs[new Date().getSeconds() % EMOJIs.length];

  const { user_metadata, app_metadata } = user;
  if (!user_metadata) {
    const msg = `your user_data is not specified ${randEmoji}`;
    context.idToken[PRV_CLAIM_KEY] = { msg };
  } else if (Object.keys(user_metadata).length !== 0) {
    // user_metadataをidTokenのプライベートクレームに突っ込む
    context.idToken[PRV_CLAIM_KEY] = user_metadata;
  } else {
    const msg = `your user_data is not specified ${randEmoji}`;
    context.idToken[PRV_CLAIM_KEY] = { msg };
  }

  if (!app_metadata) {
    const msg = `your app_metadata is not specified ${randEmoji}`;
    context.accessToken[PRV_CLAIM_KEY] = { msg };
  } else if (Object.keys(app_metadata).length !== 0) {
    // app_metadataをaccessTokenのプライベートクレームに突っ込む
    context.accessToken[PRV_CLAIM_KEY] = app_metadata;
  } else {
    const msg = `your app_metadata is not specified ${randEmoji}`;
    context.accessToken[PRV_CLAIM_KEY] = { msg };
  }

  return callback(null, user, context);
}
