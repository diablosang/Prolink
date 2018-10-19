// NOTE object below must be a valid JSON
window.Mobile = $.extend(true, window.Mobile, {
    "config": {
    "layoutSet": "navbar",
    "navigation": [
      {
        "title": "待办",
        "onExecute": "#Dash",
        "icon": "event"
      },
      {
        "title": "收藏",
        "onExecute": "#Fav",
        "icon": "favorites"
      },
      {
        "title": "功能",
        "onExecute": "#Func",
        "icon": "menu"
      },
      {
        "title": "设置",
        "onExecute": "#Config",
        "icon": "preferences"
      }
    ],
    "navigationEN": [
  {
      "title": "To Do",
      "onExecute": "#Dash",
      "icon": "event"
  },
  {
      "title": "Favorites",
      "onExecute": "#Fav",
      "icon": "favorites"
  },
  {
      "title": "Menu",
      "onExecute": "#Func",
      "icon": "menu"
  },
  {
      "title": "Setting",
      "onExecute": "#Config",
      "icon": "preferences"
  }
    ],
    "commandMapping": {
      "generic-header-toolbar": {
        "commands": [
          {
            "id": "btnBKFNew",
            "location": "after"
          },
          {
            "id": "btnLogoff",
            "location": "before"
          },
          {
            "id": "btnScan",
            "location": "after"
          }
        ]
      }
    }
  }
});