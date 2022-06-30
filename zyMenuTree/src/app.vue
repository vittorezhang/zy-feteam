<template>
  <div
    :style="'margin-right:20px;' + backDropShow ? '' : 'z-index:-1'"
    class="treeWrap"
  >
    <el-input
      :prefix-icon="icon"
      :placeholder="placeHolder"
      v-model.lazy="filterText"
      clearable
      style="margin-bottom: 10px; width: 94%"
    ></el-input>
    <el-tree
      class="filter-tree"
      :class="{
        defaultSkin: sidebarLayoutSkin == 'default',
        darkSkin: sidebarLayoutSkin == 'dark',
      }"
      :props="defaultProps"
      :icon-class="'el-icon-arrow-down'"
      :data="menuList"
      :filter-node-method="filterNode"
      ref="menuTree"
      @node-click="rowNodeClick"
      node-key="id"
      empty-text="暂无菜单"
      :default-expanded-keys="[-1]"
      :default-checked-keys="[-1]"
      :render-content="renderContent"
    >
    </el-tree>
    <div class="backDrop" v-show="backDropShow"></div>
  </div>
</template>

<script>
import { cloneDeep, throttle } from 'lodash'
export default {
  props: {
    sidebarLayoutSkin: {
      type: String,
      default: 'default',
    },
    placeHolder: {
      type: String,
      default: '请输入菜单名',
    },
    icon: {
      type: String,
      default: 'el-icon-search',
    },
    menuList: {
      type: Array,
      default: [],
    },
    _renderHandle: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: false,
      },
      innerHeight: false,
      backDropShow: false,
      filterNodeIds: [],
    }
  },
  watch: {
    filterText: throttle(
      function (val) {
        this.filterNodeIds = []
        this.getAllNode(val)
        this.$refs['menuTree'].filter(val)
      },
      200,
      { leading: true, trailing: true }
    ),
  },
  methods: {
    renderContent(h, { node, data, store }) {
      let icon = data.icon
      let title = data.title
      if (title == '首页') {
        this.innerHeight = true
      } else {
        this.innerHeight = false
      }
      return this._renderHandle({ icon, title, innerHeight: this.innerHeight })
    },
    filterNode(value, { title, pid } = data, node) {
      if (!Boolean(title)) return true
      return this.getChilds(pid) || title.indexOf(value) !== -1
    },
    getChilds(path) {
      let pathList = [path]
      let arr = pathList.filter((item) => {
        return this.filterNodeIds.indexOf(item) > -1
      })
      return arr && arr.length > 0 ? true : false
    },
    getAllNode(val) {
      let array = cloneDeep(this.menuList)
      let _this = this
      function loop(arr) {
        for (let item of arr) {
          if (item.title.indexOf(val) > -1) {
            _this.filterNodeIds.push(item.id)
          }
          if (item.children && item.children.length > 0) {
            loop(item.children)
          }
        }
      }
      loop(array)
    },
    rowNodeClick(data) {
      Object.assign(data, { innerHeight: false })
      this.$emit('route', data)
    },
    close() {
      this.backDropShow = !this.backDropShow
    },
  },
}
</script>

<style scoped lang='less'>
/deep/ .filter-tree {
  .el-tree-node__content {
    height: 60px;
    font-size: 14px;
    color: #8a979e;
    position: relative;
  }
  .el-tree-node:focus > .el-tree-node__content {
    color: #17b3a3;
    border-left: 5px solid #17b3a3;
  }
  .el-tree-node__expand-icon {
    position: absolute;
    right: 10px;
  }
  .el-tree-node__expand-icon {
    position: absolute;
    right: 10px;
  }
  .el-tree-node__expand-icon.expanded {
    transform: rotate(180deg);
  }
}
/deep/ .darkSkin {
  background: #001529;
  .el-tree-node:focus > .el-tree-node__content {
    background: #031f39;
  }
  .el-tree-node__content:hover {
    background: #031f39;
  }
}
/deep/ .defaultSkin {
  background: #fff;
  .el-tree-node:focus > .el-tree-node__content {
    background: #fff;
  }
  .el-tree-node__content:hover {
    background: #fff;
  }
}

.el-tree-node__children {
  overflow-x: scroll;
  width: 300px;
}
.treeWrap {
  position: absolute;
  .backDrop {
    width: 100%;
    height: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    font-size: 20px;
    text-align: center;
    padding-top: 100px;
    color: rgb(76, 76, 76);
    font-weight: bold;
    line-height: 2em;
  }
}
</style>
