import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faQuestionCircle,
  faHandPointer,
  faFileAlt
} from '@fortawesome/free-regular-svg-icons';
import {
  faFlask,
  faPlug,
  faTachometerAlt,
  faInfoCircle,
  faCog,
  faShapes,
  faHistory,
  faPencilAlt,
  faEye,
  faPaperPlane,
  faDownload,
  faUpload,
  faThLarge,
  faKey,
  faTimesCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {
  faMarkdown
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faQuestionCircle,
  faFlask,
  faPlug,
  faTachometerAlt,
  faInfoCircle,
  faCog,
  faShapes,
  faHistory,
  faPencilAlt,
  faEye,
  faPaperPlane,
  faDownload,
  faUpload,
  faHandPointer,
  faThLarge,
  faKey,
  faTimesCircle,
  faExclamationTriangle,
  faMarkdown,
  faFileAlt
);
Vue.component('FontIcon', FontAwesomeIcon);
