Mobile.Fav = function (params) {
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

            BindData(this);
        },
        itemData: new DevExpress.data.DataSource({
            store: []
        }),
        listOptions: {
            dataSource: this.itemData,
            height: "100%",
            useNativeScrolling: false,
            allowItemDeleting: true,
            itemDeleteMode: 'slideItem',
            onItemDeleted:function(e){
                var ITEMID = e.itemData.ITEMID;
                DeleteFav(ITEMID);
            },
            onItemClick: function (e) {
                var funcid = e.itemData.ITEMOBJ;
                OpenListView(this, funcid);
            }
        }
    };


    return viewModel;

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetUserFav?UserName=" + u;
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
            DevExpress.ui.notify(e.message, "error", 1000);
        }
    };

    function OpenListView(viewModel, funcid, functype) {
        var view = "FormList?FUNCID=" + funcid;
        Mobile.app.navigate(view);
    }

    function DeleteFav(ITEMID)
    {
        var sessionStorage = window.sessionStorage;
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/DeleteFavorite?UserName=" + u + "&ITEMID=" + ITEMID;
        $.ajax({
            type: 'GET',
            url: url,
            cache: false,
            success: function (data, textStatus) {
                DevExpress.ui.notify(SysMsg.delSuccess, "success", 1000);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                ServerError(xmlHttpRequest.responseText);
            }
        });
    }

    function SetLanguage() {
        if (DeviceLang() == "CHS") {
            viewModel.title("收藏夹");
        }
        else {
            viewModel.title("Favorites");
        }
    }
};