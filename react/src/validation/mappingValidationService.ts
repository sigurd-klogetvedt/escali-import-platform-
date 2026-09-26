import type { InterfaceRule, RuleValidationResult } from "@/types/rules";
import { dispatch } from "@/validation/ruleEvaluatorDispatcher";

export function validateMapping(
    rules: InterfaceRule[],
    presentColumns: number[]
): RuleValidationResult[] {
    return rules.map(rule => dispatch(rule, presentColumns));
}

export function isValid(results: RuleValidationResult[]): boolean {
    return results.every(r => r.passed);
}