function createListControl(field,readonly,block) {
    var col = {
        dataField: field.FIELDNAME,
        caption: field.DES,
        allowEditing: !readonly,
        allowSorting:false
    };

    switch (field.CTRLTYPE)
    {
        
        case "2": {
            if (field.DS_DATA.length > 0)
            {
                col.lookup = {
                    dataSource: field.DS_DATA,
                    displayExpr: "DES",
                    valueExpr: "IDLINE",
                };
            }
            break;
        }
        case "3": {
            col.dataType = "boolean";
            break;
        }
        case "4": {
            col.dataType = "date";
            break;
        }
        case "7": {
            col.dataType = "number";
            break;
        }
        case "8": {
            col.dataWindow = true;
            break;
        }
    }

    return col;
}

function createMainControl(id, $parent,field,option)
{
    var feID = id;

    switch (field.CTRLTYPE)
    {
        case "1": {

            $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            break;
        }
        case "2": {
            if (field.DS_DATA.length > 0) {
                option.dataSource = field.DS_DATA;
                option.displayExpr = "DES";
                option.valueExpr = "IDLINE";

                $('<div>').attr('id', feID).appendTo($parent).dxSelectBox(option);
            }
            else {
                $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            }
            break;
        }
        case "3": {
            $('<div>').attr('id', feID).appendTo($parent).dxCheckBox(option);
            break;
        }
        case "4": {
            option.formatString = "yyyy-MM-dd";
            option.pickerType = "calendar";
            option.dateSerializationFormat="yyyy-MM-dd";
            $('<div>').attr('id', feID).appendTo($parent).dxDateBox(option);
            break;
        }
        case "5": {
            option.height = "100px";
            $('<div>').attr('id', feID).appendTo($parent).dxTextArea(option);
            break;
        }
        case "7": {
            $('<div>').attr('id', feID).appendTo($parent).dxNumberBox(option);
            break;
        }
        case "8": {
            option.dataWindow = true;
            //option.readOnly = true;
            $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            break;
        }
    }
}

function ServerError(errorMessage)
{
    DevExpress.ui.notify(errorMessage, "error", 2000);
    if (errorMessage == "NO SESSION") {
        DevExpress.ui.notify("用户登录已失效，请重新登录", "error", 2000);
        var sessionStorage = window.sessionStorage;
        var u = sessionStorage.getItem("username");
        if (u != null) {
            sessionStorage.removeItem("username");
        }
        Mobile.app.viewCache.clear();
        var view = "Login/0";
        var option = { root: true };
        Mobile.app.navigate(view, option);
    }
    else {
        DevExpress.ui.notify(errorMessage, "error", 2000);
    }
}
