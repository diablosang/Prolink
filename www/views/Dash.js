Mobile.Dash = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        versionChecked: ko.observable(false),
        indicatorVisible: ko.observable(false),
        viewShown: function () {
            SetLanguage();

            try
            {
                if (device.platform != "Android") {
                    window.JPush.resetBadge();
                }
            }
            catch(e)
            {}
            

            viewModel.indicatorVisible(true);
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            if (u == null) {
                var view = "Login/0";
                var option = { root: true };
                Mobile.app.navigate(view, option);
                return;
            }

            BindData(this);
        },
        itemData: new DevExpress.data.DataSource({
                store: [],
                group: function (dataItem) {
                    return dataItem.FUNCDESC;
                }
        }),
        listOptions: {
            dataSource: this.itemData,
            height: "100%",
            grouped: true,
            collapsibleGroups: true,
            onItemClick: function (e) {
                var data = e.itemData;
                var func = data.FUNCID;
                var group = data.GROUPID;
                var doc = data.DOCID;
                OpenDoc(func, group, doc);
            }
        },
        onScrollViewPullingDown: function (e) {
            BindData(this);
            e.component.release();
        },
    };
    return viewModel;

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetDashData?UserName=" + u;
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                success: function (data, textStatus) {
                    viewModel.itemData.store().clear();

                    for (var i = 0; i < data.length; i++) {
                        viewModel.itemData.store().insert(data[i]);
                    }
                    viewModel.itemData.load();

                    $("#listDash").dxList({
                        dataSource: viewModel.itemData
                    });
                    viewModel.indicatorVisible(false);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        catch (e) {
            DevExpress.ui.notify(e.message, "error", 1000);
        }
    };

    function OpenDoc(func, group, doc){
        var view = "FormEdit?FUNCID=" + func + "&GROUPID=" + group + "&DOCID=" + doc;
        Mobile.app.navigate(view);
    }

    function SetLanguage() {
        if (DeviceLang() == "CHS") {
            viewModel.title("待办事项");
        }
        else {
            viewModel.title("To Do List");
        }
    }
};