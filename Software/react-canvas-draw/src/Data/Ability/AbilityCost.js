"use strict";

import Creature from "../Creature";
import Table from "../Table";
import Ability from "./Ability";
import AbilityAtom from "./AbilityAtom";

class AbilityCost{
    /**
     *
     * @param {(p: object, t: Table) => number} costFunc
     * @param {number[]} [table=[[1,1][1,1]]]
     */
    constructor(costFunc, table=[[1,1][1,1]]) {
        this.table = table;
        this.costFunc = costFunc;
    }
    init(atom) {
        this.atom = atom;
    }

    getCost(...params) {
        let args = this._getArgs(params);
        return this.costFunc(args, this.table);
    }
    getDiscount(cost, ...params) {
        let args = this._getArgs(params);
        return this.costFunc(args, this.table, cost);
    }

    _getArgs(...params) {
        //
        params = params.flat(Infinity);
        //
        let obj = {};
        Object.entries(this.atom.params).forEach(([key, value],i) => {
            obj[key] = params[i];
        });
        return obj;
    }
}
export default AbilityCost;
