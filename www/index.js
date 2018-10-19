window.Mobile = window.Mobile || {};




$(function () {
    DevExpress.devices.current({ platform: "generic" });
    //var api_key = "";
    //var platform = DevExpress.devices.real().platform;
    //if (platform == "ios") {
    //    api_key = "vuFXcHLCCeygc4x2em7GOVq0";
    //}
    //else if (platform == "android") {
    //    api_key = "AjjfV3UQ8imhGl42pxVugtIS";
    //}


    $(document).on("deviceready", function () {
        StatusBar.backgroundColorByHexString("#4F94CD");
        //cordova.plugins.backgroundMode.enable();

        navigator.splashscreen.hide();
        if (window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });

        var uuid = device.uuid;
        var sessionStorage = window.sessionStorage;
        sessionStorage.removeItem("uuid");
        sessionStorage.setItem("uuid", uuid);

    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !Mobile.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    if (DeviceLang()=="CHS") {
        Mobile.app = new DevExpress.framework.html.HtmlApplication({
            namespace: Mobile,
            layoutSet: DevExpress.framework.html.layoutSets[Mobile.config.layoutSet],
            navigation: Mobile.config.navigation,
            commandMapping: Mobile.config.commandMapping
        });

        SysMsg = chsMsg;
    }
    else {
        Mobile.app = new DevExpress.framework.html.HtmlApplication({
            namespace: Mobile,
            layoutSet: DevExpress.framework.html.layoutSets[Mobile.config.layoutSet],
            navigation: Mobile.config.navigationEN,
            commandMapping: Mobile.config.commandMapping
        });

        SysMsg = engMsg;
    }
    Mobile.app.router.register(":view/:id", { view: "Dash", id: undefined });
    Mobile.app.on("navigatingBack", onNavigatingBack);
    Mobile.app.navigate();
    
});

