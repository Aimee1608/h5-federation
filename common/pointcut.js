// 暂无实际用处只是用来标记使用过哪些方法
const COMPONENTS = [
  'ControlWrap',
  'HEPageStateBox',
  'MoveWidgetOperation',
  'HEFilePickerShow',
  'VariablePicker',
  'SetEditor'
];
const METHODS = [
  'beforeUpdateHook',
  'afterUpdateHook',
  'getWidgetVariable',
  'getDataContainerData',
  'getOptionByApi',
  'getWidget',
  'getListenerConfig',
  'getWidgetConfigByType',
  'getTriggerConfigByType',
  'loadTriggerConfig',
  'getUsedTriggerVersion'
];
const CONFIGS = ['TriggerConfigs'];
const STORE = ['clazzTrigger', 'stageStore'];
class Pointcut {
  // 所有切点所需要的方法
  static methods = {};
  // 所有切点所需要的组件
  static components = {};
  // 切点所需的config
  static configs = {};
  // 切点所需的store
  static store = {};
}
// 从外部（x-core、x-cli）给components赋值
export function useComponents(Components) {
  for (let key in Components) {
    Pointcut.components[key] = Components[key];
  }
}
// 从外部（x-core、x-cli）给methods赋值
export function useMethods(methods) {
  for (let key in methods) {
    Pointcut.methods[key] = methods[key];
  }
}
// 从外部（x-core、x-cli）给config赋值
export function useConfigs(configs) {
  for (let key in configs) {
    Pointcut.configs[key] = configs[key];
  }
}
// 从外部（x-core、x-cli）给store赋值
export function useStore(store) {
  for (let key in store) {
    Pointcut.store[key] = store[key];
  }
}
export const methods = Pointcut.methods;
export const components = Pointcut.components;
export const configs = Pointcut.configs;
export const store = Pointcut.store;
export default Pointcut;
