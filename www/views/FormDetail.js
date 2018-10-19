Mobile.FormDetail = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        data: {},
        block:{},
        rowIndex:0,
        keepCache: false,
        fieldEvent:true,
        viewShown: function (e) {
            if (viewModel.keepCache == true) {
                viewModel.keepCache = false;
                var viewAction = sessionStorage.getItem("viewAction");
                if (viewAction != null) {
                    sessionStorage.removeItem("viewAction");

                    if (viewAction == "dataWindow") {
                        UpdateDataWindow();
                    }
                }
                return;
            }

            InitView(viewModel);
        },
        viewHidden: function (e) {
            if (viewModel.keepCache == false) {
                var cache = Mobile.app.viewCache;
                cache.removeView(e.viewInfo.key);
            }

            sessionStorage.setItem("viewAction","refreshRow");
        },
        indicatorVisible:ko.observable(false),
        toolBarOption: {
            items: [
                 { location: 'before', widget: 'button', name: 'delete', options: { icon: 'remove', text: '删除' } }
            ],
            onItemClick: function (e) {
                switch (e.itemData.name) {
                    case "delete":
                        {
                            DeleteRow();
                            break;
                        }
                }
            }
        }
    };

    function InitView(viewModel) {
        var param = JSON.parse(sessionStorage.getItem("detailData"));
        var $fieldset = $("#fsDetail");
        var block = param.block;
        viewModel.data = param.data;
        viewModel.block= block;
        viewModel.rowIndex = param.rowIndex;
        if (param.mode == "edit") {
            viewModel.title("修改" + block.DES);
        }
        else if (param.mode == "new") {
            viewModel.title("新建" + block.DES);
        }
        else {
            viewModel.title(block.DES);
        }

        for (var i = 0; i < block.field.length; i++) {
            var field = block.field[i];
            $('<div>').attr('id', 'field' + block.IDNUM + field.FIELDNAME).attr("class", "dx-field").appendTo($fieldset);
            var $field = $("#field" + block.IDNUM + field.FIELDNAME);

            var readonly = true;
            if (field.STATUS == "2") {
                readonly = false;
                if (field.REQUIRED=="1") {
                    $('<div>').attr("class", "dx-field-label EditableR").appendTo($field).html(field.DES);
                }
                else {
                    $('<div>').attr("class", "dx-field-label Editable").appendTo($field).html(field.DES);
                }
            }
            else {
                $('<div>').attr("class", "dx-field-label").appendTo($field).html(field.DES);
            }

            $('<div>').attr('id', 'fv' + block.IDNUM + field.FIELDNAME).attr("class", "dx-field-value").appendTo($field);
            var $fv = $("#fv" + block.IDNUM + field.FIELDNAME);

            var fieldValue = viewModel.data[field.FIELDNAME];

            var editorOption = {
                value: fieldValue,
                readOnly: readonly,
                BLOCKID: block.IDNUM,
                FIELDNAME: field.FIELDNAME,
                DES:field.DES,
                onValueChanged: function (e) {
                    EditValueChanged(e);
                },
                onFocusIn: function (e) {
                    if (this.option("dataWindow") != null) {
                        OpenDataWindow(this);
                    }
                }
            };

            var feID = "fe" + block.IDNUM + field.FIELDNAME;
            createMainControl(feID, $fv, field, editorOption);
        }

    }

    function EditValueChanged(e)
    {
        if (viewModel.fieldEvent == false)
        {
            return;
        }
        var val = e.value;
        viewModel.indicatorVisible(true);

        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/FieldValueChanged";
        var option = e.component.option();
        var postData = {
            userName: u,
            blockID: option.BLOCKID,
            fieldName: option.FIELDNAME,
            fieldValue: e.value,
            rowIndex: viewModel.rowIndex
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            cache: false,
            success: function (data, textStatus) {
                if (data.DATA != null)
                {
                    viewModel.data = data.DATA[0];
                    var dr = data.DATA[0];
                    for (var fieldName in dr)
                    {
                        var feID = "#fe" + option.BLOCKID + fieldName;
                        var editor = $(feID);
                        if(editor.length > 0)
                        {
                            editor[Object.keys($(feID).data())[0]]("instance").option("value", dr[fieldName]);
                        }
                    }
                }
                viewModel.indicatorVisible(false);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                e.component.option("value", e.previousValue);                
                viewModel.indicatorVisible(false);
                ServerError(xmlHttpRequest.responseText);
            }
        });
    }

    function DeleteRow() {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/DeleteRow";
        var postData = {
            userName: u,
            blockID: viewModel.block.IDNUM,
            rowIndex: viewModel.rowIndex
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            cache: false,
            success: function (data, textStatus) {
                sessionStorage.setItem("f_delete", "1");
                (new DevExpress.framework.dxCommand({ onExecute: "#_back" })).execute();
                viewModel.indicatorVisible(false);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                ServerError(xmlHttpRequest.responseText);
            }
        });
        return;
    }

    function OpenDataWindow(e) {
        var option = e.option();
        var p = {
            rowIndex: viewModel.rowIndex,
            blockID: option.BLOCKID,
            fieldName: option.FIELDNAME,
            fieldDES: option.DES
        };

        sessionStorage.setItem("dwParam", JSON.stringify(p));
        viewModel.keepCache = true;
        Mobile.app.navigate("DataWindow");
    }

    function UpdateDataWindow() {
        var dwData = [];
        dwData.push(JSON.parse(sessionStorage.getItem("dwData")));

        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/SetDataWindow";

        var param = JSON.parse(sessionStorage.getItem("dwParam")); 

        var postData = {
            blockID: param.blockID,
            fieldName: param.fieldName,
            data: dwData,
            userName: u,
            rowIndex: viewModel.rowIndex
        };

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            cache: false,
            success: function (data, textStatus) {
                viewModel.fieldEvent = false;
                viewModel.indicatorVisible(false);
                var block = viewModel.block;

                for (var i = 0; i < block.field.length; i++) {
                    var field = block.field[i];
                    var feID = "#fe" + param.blockID + field.FIELDNAME;
                    $(feID)[Object.keys($(feID).data())[0]]("instance").option("value", data[0][field.FIELDNAME]);
                }

                viewModel.fieldEvent = true;
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {                
                viewModel.indicatorVisible(false);
                ServerError(xmlHttpRequest.responseText);
            }
        });

    }

    return viewModel;
};