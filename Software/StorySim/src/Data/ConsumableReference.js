"use strict";

class ConsumableReference {
    constructor(consumableName, count) {
        this.consumableName = consumableName;
        this.count = count;
        this.active = false;
    }
}
export default ConsumableReference;

export function inflateConsumableReference(consumableReference) {
    Object.setPrototypeOf(consumableReference, ConsumableReference.prototype);
}