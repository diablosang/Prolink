Mobile.Login = function (params) {

    var viewModel = {
        title: ko.observable(""),
        chn: ko.observable(""),
        deviceid: ko.observable(""),
        versionChecked: ko.observable(false),
        indicatorVisible:ko.observable(false),
        viewShown: function () {
            SetLanguage();


            var localStorage = window.localStorage;

            var url = localStorage.getItem("serviceurl");
            if (url != null && url != "") {
                $("#WebApiServerURL")[0].value = url;
            }

            $("#logoImg").attr("src",url+"/logo.png");

            var u = localStorage.getItem("username");
            if(u != null)
            {
                var p = localStorage.getItem("password");
                this.username(u);
                this.password(p);
            }

            if (viewModel.versionChecked() == false) {
                try {
                    cordova.getAppVersion.getVersionNumber().then(function (version) {
                        $("#appver").text("Version: "+version);
                        CheckUpdate();
                    });
                }
                catch (e) { }
                
                viewModel.versionChecked(true);
            }
            
            var sessionStorage = window.sessionStorage;
            if(sessionStorage.baiduchn != null)
            {
                this.chn(sessionStorage.baiduchn);
            }
            
            if (sessionStorage.uuid != null)
            {
                this.deviceid(sessionStorage.uuid);
            }
            

        },
        username: ko.observable(""),
        password: ko.observable(""),
        onLoginClick: function () {
            
            Logon(this,this.username(), this.password());
            
        }
    };

    return viewModel;

    function Logon(viewModel,u, p)
    {
        var serverVer = CheckServerVersion();
        viewModel.indicatorVisible(true);
        var sessionStorage = window.sessionStorage;
        if (sessionStorage.baiduchn != null) {
            viewModel.chn(sessionStorage.baiduchn);
        }

        var devicetype = DevExpress.devices.real().platform;

        if (serverVer == "2") {
            var postData = {
                UserName: u,
                Password: p,
                CHN: viewModel.chn(),
                DeviceID: viewModel.deviceid(),
                DeviceType: devicetype,
                Lang: DeviceLang()
            };
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/Logon2";
            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {

                    sessionStorage.removeItem("username");
                    sessionStorage.setItem("username", u);

                    var localStorage = window.localStorage;
                    localStorage.setItem("username", u);
                    localStorage.setItem("password", p);
                    viewModel.indicatorVisible(false);
                    var view = "Dash";
                    var option = { root: true };
                    Mobile.app.navigate(view, option);

                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        else {
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/Logon?UserName=" + u + "&Password=" + p
                + "&CHN=" + viewModel.chn() + "&DeviceID=" + viewModel.deviceid() + "&DeviceType=" + devicetype;

            $.ajax({
                type: 'GET',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {

                    sessionStorage.removeItem("username");
                    sessionStorage.setItem("username", u);

                    var localStorage = window.localStorage;
                    localStorage.setItem("username", u);
                    localStorage.setItem("password", p);
                    viewModel.indicatorVisible(false);
                    var view = "Dash";
                    var option = { root: true };
                    Mobile.app.navigate(view, option);

                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        
    }

    function CheckServerVersion()
    {
        var ver = "1";
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetServerVersion";
        $.ajax({
            type: 'GET',
            url: url,
            cache: false,
            async:false,
            success: function (data, textStatus) {
                ver= data.ver;
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                ver= "1";
            }
        });

        return ver;
    }

    function CheckUpdate() {
        var ver = $("#appver").text();
        ver = ver.replace("Version:", "");
        var url = $("#WebApiServerURL")[0].value + "/Api/Debug/CheckAppVersion2?ver=" + ver;
        var currentplatform = DevExpress.devices.real().platform;

        $.ajax({
            type: 'GET',
            url: url,
            cache: false,
            success: function (data, textStatus) {
                var newver = data.NewVersion;
                if (newver == "1") {
                    var closedDialog;
                    var closedDialog = DevExpress.ui.dialog.custom({
                        title: SysMsg.info,
                        message: SysMsg.newVer,
                        buttons: [{ text: SysMsg.yes, value: true, onClick: function () { return true; } }, { text: SysMsg.no, value: false, onClick: function () { return false; } }]
                    });
                    
                    closedDialog.show().done(function (dialogResult) {
                        if (dialogResult == true) {
                            var apkURL = "";
                            if (currentplatform == 'android') {
                                apkURL = $("#WebApiServerURL")[0].value + "/App/Mobile.apk";
                                window.open(apkURL, '_blank', 'location=yes');
                            }
                            else if (currentplatform == 'ios') {
                                apkURL = "https://itunes.apple.com/us/app/%E4%BC%81%E8%8D%AB%E5%AE%A2%E6%88%B7%E7%AB%AF/id1216043513?mt=8";
                                window.open(apkURL, '_blank', 'location=yes');
                            }
                            return;
                        }
                    });
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                ServerError(xmlHttpRequest.responseText);
            }
        });
    }

    function SetLanguage()
    {
        if (DeviceLang() == "CHS") {
            viewModel.title("登录");
            $("#txtUser").dxTextBox("instance").option("placeholder", "请输入用户名");
            $("#txtPwd").dxTextBox("instance").option("placeholder", "请输入密码");
            $("#btnLogin").dxButton("instance").option("text", "登录");
        }
        else {
            viewModel.title("Logon");
            $("#txtUser").dxTextBox("instance").option("placeholder", "Please input user name");
            $("#txtPwd").dxTextBox("instance").option("placeholder", "Please input password");
            $("#btnLogin").dxButton("instance").option("text", "Login");
        }
    }
};