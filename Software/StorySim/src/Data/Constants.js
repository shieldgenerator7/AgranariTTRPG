"use strict";

export const VERSION = "0.006";


export const ONCLICK_ADJUST_VALUE = 0;
export const ONCLICK_DIE_ROLL = 1;
export const ONCLICK_TOGGLE = 2;
export const ONCLICK_ACTION = 3;

export const LIMIT_POSITIVE_ONLY = 0;
export const LIMIT_POSITIVE_AND_NEGATIVE = 1;
export const LIMIT_NEGATIVE_ONLY = 2;

export const ACTION_ROLL_MODIFY = "Modify Roll";
export const ACTION_ROLL_REROLL = "Reroll Prev Roll";
export const ACTION_VARIABLE_MODIFY = "Modify Variable";

export const REGEX_SPACER_TEST = /^[- ]*$/;

export const JSON_TYPE_CHARACTER = "j_char";
export const JSON_TYPE_ATTRIBUTE = "j_attr";
export const JSON_TYPE_ABILITY = "j_abil";

export const DIE_ROLL_FLAIR_NORMAL = "drf_normal";
export const DIE_ROLL_FLAIR_CRIT = "drf_crit";
export const DIE_ROLL_FLAIR_FUMBLE = "drf_fumble";
