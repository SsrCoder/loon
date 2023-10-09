var ALI_HEADER_KEY = "AliYunSignInStore";

function main() {
  var store = getStore();
  if (typeof store == "undefined") {
    $notification.post(
      "阿里云盘签到",
      "提示",
      "没获取到 refresh_token，请打开阿里云盘 APP"
    );
    return;
  }
  var refreshToken = store.refreshToken;
  console.log("refresh_token: " + refreshToken);
  getAccessToken(refreshToken);
}

function getAccessToken(refreshToken) {
  var param = {
    url: "https://auth.alipan.com/v2/account/token",
    body: {
      refresh_token: refreshToken,
      app_id: "pJZInNHN2dZWk8qg",
      grant_type: "refresh_token",
    },
  };

  function callback(err, resp, data) {
    var resp = JSON.parse(data);
    var accessToken = resp.access_token;
    console.log("access_token: " + accessToken);
    getSignInCount(accessToken);
  }

  $httpClient.post(param, callback);
}

function getSignInCount(accessToken) {
  var param = {
    url: "https://member.aliyundrive.com/v2/activity/sign_in_list?_rx-s=mobile",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: {},
  };

  function callback(err, resp, data) {
    var resp = JSON.parse(data);
    var signInCount = resp.result.signInCount;
    var date = new Date().getDate().toString();
    var signInInfo = resp.result.signInInfos.filter(
      (item) => item.day === date
    )[0];

    console.log("signInCount: " + signInCount);
    console.log("signInInfo: ");
    console.log(signInInfo);


    signInInfo.rewards.forEach((item) => {
      if (item.status !== "finished") {
        return;
      }
      switch (item.type) {
        case "dailySignIn":
          dailySignIn(accessToken, signInCount);
          break;
        case "dailyTask":
          dailyTask(accessToken, signInCount);
          break;
        default:
          break;
      }
    });
  }

  $httpClient.post(param, callback);
}

function dailySignIn(accessToken, signInDay) {
  var param = {
    url: "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: {
      signInDay: signInDay,
    },
  };

  $httpClient.post(param, signInCallback);
}

function dailyTask(accessToken, signInDay) {
  var param = {
    url: "https://member.aliyundrive.com/v2/activity/sign_in_task_reward?_rx-s=mobile",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: {
      signInDay: signInDay,
    },
  };

  $httpClient.post(param, signInCallback);
}

function signInCallback(err, response, data) {
  var resp = JSON.parse(data);
  if (!resp.success) {
    return;
  }

  $notification.post(
    "阿里云盘签到",
    "提示",
    "签到成功：" + resp.result.name + "·" + resp.result.description
  );
}

function getStore() {
  var value = $persistentStore.read(ALI_HEADER_KEY);
  if (typeof value == "undefined") {
    return undefined;
  }
  return JSON.parse(value);
}

main();
