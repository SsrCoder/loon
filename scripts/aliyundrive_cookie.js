function main() {
  if (!check()) {
    $done({});
    return
  }

  var authorization = getAuthorization();
  var signInDay = getSignInDay();

  var ALI_HEADER_KEY = "AliYunSignInStore";

  var store = {
    authorization,
    signInDay,
  };

  $persistentStore.write(JSON.stringify(store), ALI_HEADER_KEY);
  $done({});
}

function getSignInDay() {
  return JSON.parse($response.body).signIn.day;
}

function getAuthorization() {
  return $request.headers.authorization;
}

function check() {
  if ($response.status != 200) {
    return false;
  }
  return true;
}

main();
