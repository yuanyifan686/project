/**
 * Vite 构建入口：将 npm 依赖挂载到 window，兼容现有 IIFE 组件脚本
 */
import * as Vue from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';
import 'element-plus/dist/index.css';

window.Vue = Vue;
window.ElementPlus = ElementPlus;
window.ElementPlusLocaleZhCn = zhCn;
window.ElementPlusIconsVue = ElementPlusIconsVue;
window.axios = axios;