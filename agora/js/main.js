(function (data) {
  console.log(data);
  /* Change the details here */

  document.querySelector(".text").innerText = data.textInstallButton;
  document.querySelector(".unlock").style.background = data.colorInstallButton;
  // document.getElementById(
  //   "merchantLogo"
  // ).src = `images/${data.merchantLogoName}`;
  // document.getElementById("leftSocial").innerText = data.merchantDescription;

  let setVal;

  try {
    if (typeof GlanceAndroidInterface !== "undefined") {
      if (
        GlanceAndroidInterface.getTopOverlayHeight() !== "undefined" &&
        GlanceAndroidInterface.getBottomOverlayHeight() !== "undefined"
      ) {
        document.querySelector(".logo").style.paddingTop = `${GlanceAndroidInterface.getTopOverlayHeight() / window.devicePixelRatio
          }px`;
        document.querySelector(".container").style.bottom =
          GlanceAndroidInterface.getBottomOverlayHeight() /
          window.devicePixelRatio +
          "px";
      }
    }
  } catch (error) {
    console.log(error);
    if (typeof AndroidUtils !== "undefined") {
      if (
        AndroidUtils.getStatusBarHeight() !== "undefined" &&
        AndroidUtils.getNavigationBarHeight() !== "undefined"
      ) {
        document.querySelector(".logo").style.paddingTop = `${AndroidUtils.getStatusBarHeight() / window.devicePixelRatio
          }px`;
        document.querySelector(".container").style.bottom =
          AndroidUtils.getNavigationBarHeight() / window.devicePixelRatio +
          "px";
      }
    }
  }

  sendAnalytics = (action) => {
    const eventType = "webpeekOCI";
    const isKeyguardLocked = AndroidUtils.isKeyguardLocked();
    const isNetworkConnected = AndroidUtils.isNetworkConnected();
    const isAppPresent = GlanceAndroidInterface.isAppInstalled(
      data.packageName
    );
    const extras = {
      packageName: data.packageName,
      action,
      isKeyguardLocked,
      isNetworkConnected,
      isAppPresent,
    };
    if (typeof GlanceAndroidInterface !== "undefined") {
      console.log("Send event", eventType, JSON.stringify(extras));
      GlanceAndroidInterface.sendCustomAnalyticsEvent(
        eventType,
        JSON.stringify(extras)
      );
    }
  };

  onFocus = () => {
    sendAnalytics("onFocus");
  };

  handleClose = () => {
    sendAnalytics("overlayClosed");
    clearInterval(setVal);
    document.querySelector(".overlay").style.display = "none";
  };

  overlayAction = () => {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".over-text").innerHTML =
      " <img src='images/no-internet.svg' alt='no internet'> <p class='ops-title'>Please turn on the Internet <span>To continue Installing</span></p>";
    document.querySelector(".loader1").style.display = "none";
    showCloseButton();
    setVal = setInterval(() => {
      console.log("trying..");
      const isConnected = AndroidUtils.isNetworkConnected();
      if (isConnected) {
        document.querySelector(".over-text").innerText =
          "Taking you to the lock screen..";
        document.querySelector(".loader1").style.display = "block";
        setTimeout(() => {
          sendAnalytics("overlayTimedout");
          document.querySelector(".overlay").style.display = "none";
          GlanceAndroidInterface.launchIntentAfterUnlock(
            "null",
            `glance://binge?url=mi%3A%2F%2Foneclickinstall%3Fpackage_name%3D${data.packageName}%26action_name%3Dinstall`
          );
        }, 1000);
        clearInterval(setVal);
      }
    }, 200);
    setTimeout(() => {
      sendAnalytics("overlayTimedout");
      clearInterval(setVal);
    }, 30000);
  };

  showCloseButton = () => {
    setTimeout(() => {
      document.querySelector(".btn-close").style.visibility = "visible";
    }, 5000);
  };

  likeClick = () => {
    if (typeof GlanceAndroidInterface !== "undefined") {
      GlanceAndroidInterface.likeGlance();
      document.getElementById("likeButton").style.display = "none";
      document.getElementById("unlikeButton").style.display = "block";
    }
  };

  unlikeClick = () => {
    if (typeof GlanceAndroidInterface !== "undefined") {
      GlanceAndroidInterface.unlikeGlance();
      document.getElementById("unlikeButton").style.display = "none";
      document.getElementById("likeButton").style.display = "block";
    }
  };

  whatsappClick = () => {
    if (typeof GlanceAndroidInterface !== "undefined") {
      GlanceAndroidInterface.shareGlance("com.whatsapp");
    }
  };

  moreClick = () => {
    if (typeof GlanceAndroidInterface !== "undefined") {
      GlanceAndroidInterface.shareGlance();
    }
  };

  handleClick = () => {
    /* un-comment while testing in browser*/
    // mockInternetOn();
    /* For testing in browser*/

    sendAnalytics("ctaClicked");
    GlanceAndroidInterface.userEngaged();
    GlanceAndroidInterface.fireBeaconUrl(data.beaconUrl);

    if (GlanceAndroidInterface.isAppInstalled(data.packageName)) {
      if (AndroidUtils.isKeyguardLocked()) {
        GlanceAndroidInterface.launchAppAfterUnlock(data.packageName, null);
      } else {
        GlanceAndroidInterface.launchApp(data.packageName, null);
      }
    } else {
      if (!AndroidUtils.isNetworkConnected()) {
        if (AndroidUtils.isKeyguardLocked()) {
          overlayAction();
        } else {
          GlanceAndroidInterface.launchIntent(
            null,
            `mimarket://details?id=${data.packageName}`
          );
        }
      } else {
        if (AndroidUtils.isKeyguardLocked()) {
          document.querySelector(".over-text").innerText =
            "Taking you to the lock screen..";
          document.querySelector(".overlay").style.display = "block";
          document.querySelector(".loader1").style.display = "block";
          setTimeout(() => {
            document.querySelector(".overlay").style.display = "none";
            GlanceAndroidInterface.launchIntentAfterUnlock(
              "null",
              `glance://binge?url=mi%3A%2F%2Foneclickinstall%3Fpackage_name%3D${data.packageName}%26action_name%3Dinstall`
            );
          }, 1000);
        } else {
          const obj = {
            package_name: data.packageName,
            action_name: "install",
          };
          const jsonString = JSON.stringify(obj);
          GlanceAndroidInterface.sendLocalBroadcast(
            "com.miui.fashiongallery.SDK_WC_APP_EVENT",
            null,
            jsonString
          );
        }
      }
    }
  };

  const handleClickInfo = (type) => {
    if (type === "info") {
      sendAnalytics("infoClicked");
    } else {
      sendAnalytics("permissionsClicked");
    }
    if (AndroidUtils.isKeyguardLocked()) {
      document.querySelector(".overlay").style.display = "block";
      document.querySelector(".over-text").innerText =
        "Taking you to the lock screen..";
      setTimeout(() => {
        document.querySelector(".overlay").style.display = "none";
        GlanceAndroidInterface.launchIntentAfterUnlock(
          null,
          `mimarket://details?id=${data.packageName}`
        );
      }, 1500);
    } else {
      GlanceAndroidInterface.launchIntent(
        null,
        `mimarket://details?id=${data.packageName}`
      );
    }
  };
})(OciVariables);

/* Uncomment below if you're developing in browser. (for testing only) */
// const GlanceAndroidInterface = {
//   isAppInstalled: () => false,
//   getTopOverlayHeight: () => 0,
//   userEngaged: () => true,
//   fireBeaconUrl: () => true,
//   launchIntentAfterUnlock: () => true,
//   launchAppAfterUnlock: () => true,
//   sendCustomAnalyticsEvent: () => true
// };
// const AndroidUtils = {
//   isNetworkConnected: () => false,
//   isKeyguardLocked: () => true
// };
// const mockInternetOn = () => {
//   setTimeout(() => {
//     AndroidUtils.isNetworkConnected = () => true;
//   }, 10000);
// };
/* Uncomment above if you're developing in browser. */
