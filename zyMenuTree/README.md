# zy-sidebar

![](https://img.shields.io/badge/webpack-3.9.1-blue.svg)
![](https://img.shields.io/badge/vue-2.5.9-brightgreen.svg)
![](https://img.shields.io/badge/Author-zwt-yellow.svg)

## npm address
npm address in here : https://www.npmjs.com/package/zy-sidebar

## Explain

1 . sideBar Menu

2 . Support customization，for example: placeHolder 、 event 、 menuList ...

3 . `normal search input` and `menuTree open`

4 . .....(There will be more follow ups)

---

## Usage

### 1.1 Installation

```javascript
  npm i zy-sidebar
```

### 1.2 ES6 Import

```javascript
import zySidebar from 'zy-sidebar';

export default {
  components: {
    zySidebar
  }
}
```

## Basic Example

html

```html
<template>
  <aside>
    <el-menu
      :default-active="xxx"
      :collapse="xxx"
      :collapseTransition="false"
      :unique-opened="true"
      class="site-sidebar__menu">
      <el-menu-item>
        <zy-sidebar placeHolder="请输入菜单名" :menuList="menuList" @route="gotoRouteHandle" :_renderHandle="renderHandle"></zy-sidebar>
      </el-menu-item>
    </el-menu>
  </aside>
</template>
```

js

```javascript
import zySidebar from 'zy-sidebar';

export default {
  components: {
	  zySidebar
  },
  data() {
    return {
      menuList: [],
    }
  }
  },
  methods: {
    renderHandle(obj){
      return (<div><icon-svg name={obj.icon}></icon-svg><span style="padding-left:10px;">{obj.title}</span></div>)
    }
  }
}
```

### Props

|    props    |  type  |      default       |          description             |
| :---------: | :----: | :----------------: | :------------------------------: |
|  placeHolder|   String | ""  | `placeHolder` Input prompt|
|  menuList   |   Array  | []  | `menuList` source prompt |
| _renderHandle|  Function | () => {} | `_renderHandle` event render |

---

