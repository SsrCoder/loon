function main() {
  var store = getStore();
  if (typeof store == "undefined") {
    $notification.post("阿里云盘签到", "提示", "没找到 Cookie");
    return;
  }

  signInList(store);
  signInTaskReward(store);
}

function signInCallback(err, response, data) {
    if (err != null) {
    // ignore
    //   $notification.post("阿里云盘签到", "提示", "签到失败");
      console.log(err);
      console.log(response);
      console.log(data);
      return;
    }
    var resp = JSON.parse(data);
    if (!resp.success) {
    // ignore
    //   $notification.post("阿里云盘签到", "提示", "签到失败：" + resp.message);
      console.log(err);
      console.log(response);
      console.log(data);
      return;
    }

    // ignore
    // $notification.post(
    //   "阿里云盘签到",
    //   "提示",
    //   "签到成功：" + resp.result.name + "·" + resp.result.description
    // );
}

function signInList(store) {
  var authorization = store.authorization;
  var signInDay = store.signInDay;

  var param = {
    url: "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile",
    headers: {
      authorization,
    },
    body: {
      signInDay: signInDay,
    },
  };

  $httpClient.post(param, signInCallback);
}

function signInTaskReward(store) {
  var authorization = store.authorization;
  var signInDay = store.signInDay;

  var param = {
    url: "https://member.aliyundrive.com/v2/activity/sign_in_task_reward?_rx-s=mobile",
    headers: {
      authorization,
    },
    body: {
      signInDay: signInDay,
    },
  };

  $httpClient.post(param, signInCallback);
}

function getStore() {
  var ALI_HEADER_KEY = "AliYunSignInStore";
  var value = $persistentStore.read(ALI_HEADER_KEY);
  if (typeof value == "undefined") {
    return undefined;
  }
  return JSON.parse(value);
}

main();
