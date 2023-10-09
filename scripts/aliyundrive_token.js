var ALI_HEADER_KEY = "AliYunSignInStore";

function main() {
  if (!check()) {
    return
  }

  var refreshToken = getRefreshToken();
  console.log("refresh_token: " + refreshToken);

  var store = {
    refreshToken,
  };

  $persistentStore.write(JSON.stringify(store), ALI_HEADER_KEY);

  if (isFirstRecord(ALI_HEADER_KEY)) {
    notify();
  }
}

function notify() {
  $notification.post(
    "阿里云盘签到",
    "提示",
    "获取 refresh_token 成功"
  );
}

function isFirstRecord() {
  var value = $persistentStore.read(ALI_HEADER_KEY);
  if (typeof value == "undefined") {
    return true;
  }
  return value.refreshToken === '';
}

function getRefreshToken() {
  return JSON.parse($response.body).refresh_token;
}

function check() {
  if ($response.status != 200) {
    return false;
  }
  return true;
}

main();
$done({});