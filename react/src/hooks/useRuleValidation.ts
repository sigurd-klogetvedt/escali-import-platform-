import type { InterfaceRule, RuleValidationResult } from "@/types/rules";
import { validateMapping } from "@/validation/mappingValidationService";
import { useCallback } from "react";

export function useRuleValidation(rules: InterfaceRule[]) {
    const validate = useCallback(
        (presentColumns: number[]): RuleValidationResult[] => {
            return validateMapping(rules, presentColumns);
        },
        [rules]
    );

    return { validate };
}