const registry = {};

export default {

  add(type, component) {
    registry[type] = component;
  },
  get(type) {
    return registry[type];
  }
};





