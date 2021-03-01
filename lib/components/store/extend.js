
function merge(child, parent, prop) {
    let result;

    if (Object.prototype.hasOwnProperty.call(child, prop)) {
        result = child[prop];

        if (typeof result === 'function' && prop === 'state') {
            result = (function (childState, parentState) {

                return function () {
                    let childStateVal = childState();
                    let parentStateVal = parentState;
                    if (typeof parentState === 'function') {
                        parentStateVal = parentState();
                    }
                    let merged = {};
                    Object.assign(merged, parentStateVal, childStateVal);
                    return merged;
                }

            })(child[prop], parent[prop]);

        } else {
            Object.assign(result, parent[prop], result);
        }

    } else {
        result = parent[prop];
    }
    return result;

}



export default function (child, parent) {
    let result = {};

    Object.assign(result, parent, child);
    result.state = merge(child, parent, 'state');
    result.getters = merge(child, parent, 'getters');
    result.mutations = merge(child, parent, 'mutations');
    result.actions = merge(child, parent, 'actions');
    return result;
}
