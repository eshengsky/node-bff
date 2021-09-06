import vue from 'vue';
import '@toast-ui/editor/dist/i18n/zh-cn';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
vue.component(Editor.name, Editor);
