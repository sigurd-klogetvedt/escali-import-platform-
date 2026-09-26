export type RuleTypeCode = "Required" | "AtLeastOne" | "ValidCombination";

export interface RuleMember {
    memberSeq: number;
    columnSeq: number;
    columnFieldName: string;
}

export interface RuleCombiation {
    combinationSeq: number;
    members: RuleMember[];
}

export interface InterfaceRule {
    ruleSeq: number;
    interfaceSeq: number;
    ruleTypeCode: RuleTypeCode;
    ruleName: string;
    ruleCombinations: RuleCombiation[];
}

export interface RuleValidationResult {
    ruleSeq: number;
    ruleName: string;
    passed: boolean;
    errorMessage?: string;
}