Mobile.Func = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        viewShown: function () {
            SetLanguage();
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            if (u == null) {
                var view = "Login/0";
                var option = { root: true };
                Mobile.app.navigate(view, option);
                return;
            }

            BindData(this, this.parentFunc());
        },
        toolBarOption: {
            items: [
                { location: 'before', widget: 'button', name: 'upper', options: { icon: 'arrowup', text: SysMsg.upperFolder } },
                  { location: 'before', widget: 'button', name: 'root', options: { icon: 'home', text: SysMsg.rootFolder } }
            ],
            onItemClick: function (e) {
                switch (e.itemData.name) {
                    case "upper": BindDataUpper(this); break;
                    case "root":
                        {
                            this.parentFunc("");
                            BindData(this);
                            break;

                        }
                }
            }
        },
        itemData: new DevExpress.data.DataSource({
            store: []
        }),
        parentFunc: ko.observable(""),
        parentOld: ko.observable(""),
        listOptions: {
            dataSource: this.itemData,
            height: "100%",
            useNativeScrolling:false,
            onItemClick: function (e) {
                var funcid = e.itemData.FUNCID;
                var mtype = e.itemData.MTYPE;
                var functype = e.itemData.FUNCTYPE;
                if (mtype == "FUNC") {
                    this.parentOld(this.parentFunc());
                    this.parentFunc(funcid);
                    BindData(this);
                }
                else {
                    OpenListView(this, funcid, functype);
                }
            }
        }
    };

    return viewModel;

    function BindDataUpper(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetUserMenuUpper?UserName=" + u + "&PARENT=" + viewModel.parentFunc();
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                success: function (data, textStatus) {
                    viewModel.itemData.store().clear();

                    for (var i = 0; i < data.length; i++) {
                        if (DeviceLang() == "CHS") {
                            data[i].DES = data[i].DES1;
                        }
                        else {
                            data[i].DES = data[i].DES2;
                        }
                        viewModel.itemData.store().insert(data[i]);
                    }
                    viewModel.itemData.load();

                    if(data.length>0)
                    {
                        viewModel.parentFunc(data[0].PARENT);
                    }

                    $("#listFunc").dxList({
                        dataSource: viewModel.itemData
                    });
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    DevExpress.ui.notify(errorThrown, "error", 1000);
                }
            });
        }
        catch (e) {
            DevExpress.ui.notify(e.message, "error", 1000);
        }
    };

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetUserMenu?UserName=" + u + "&PARENT=" + viewModel.parentFunc();
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                success: function (data, textStatus) {
                    if (data.length == 1 && data[0].MTYPE=="GROUP")
                    {
                        var funcid = data[0].FUNCID;
                        var functype = data[0].FUNCTYPE;
                        OpenListView(viewModel, funcid, functype);
                        viewModel.parentFunc(viewModel.parentOld());
                        return;
                    }

                    
                    viewModel.itemData.store().clear();

                    for (var i = 0; i < data.length; i++) {
                        if (DeviceLang() == "CHS") {
                            data[i].DES = data[i].DES1;
                        }
                        else {
                            data[i].DES = data[i].DES2;
                        }
                        viewModel.itemData.store().insert(data[i]);
                    }
                    viewModel.itemData.load();

                    $("#listFunc").dxList({
                        dataSource: viewModel.itemData
                    });
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        catch (e) {
            ServerError(xmlHttpRequest.responseText);
        }
    };

    function OpenListView(viewModel, funcid,functype)
    {
        if (functype == "2")
        {
            var view = "FormList?FUNCID=" + funcid;
            Mobile.app.navigate(view);
        }
    }

    function SetLanguage() {
        if (DeviceLang() == "CHS") {
            viewModel.title("功能目录");
        }
        else {
            viewModel.title("Function Menu");

        }
    }
};

function GetIconImage(img) {
    var url = $("#WebApiServerURL")[0].value + "/images/Asapment/" + img + ".png";
    return url;
}