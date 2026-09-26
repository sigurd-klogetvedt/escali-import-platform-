import type { InterfaceRule, RuleTypeCode, RuleValidationResult } from "@/types/rules";
import { evaluateRequired, evaluateAtLeastOne, /*evaluateValidCombination*/ } from "@/validation/evaluators";
import { getErrorMessage } from "@/validation/errorMessage";

type EvaluatorFn = (rule: InterfaceRule, presentColumns: number[]) => boolean;

const evaluators: Record<RuleTypeCode, EvaluatorFn> = {
    Required: evaluateRequired,
    AtLeastOne: evaluateAtLeastOne,
    //ValidCombination: evaluateValidCombination,
    ValidCombination: () => true,
};

export function dispatch(
    rule: InterfaceRule,
    presentColumns: number[]
): RuleValidationResult {
    const evaluator = evaluators[rule.ruleTypeCode];

    if (!evaluator) {
        throw new Error(`No evaluator registered for rule type '${rule.ruleTypeCode}'`);
    }

    const passed = evaluator(rule, presentColumns);

    return {
        ruleSeq: rule.ruleSeq,
        ruleName: rule.ruleName,
        passed,
        errorMessage: passed ? undefined : getErrorMessage(rule),
    }
}