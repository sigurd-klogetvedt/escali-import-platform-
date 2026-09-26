import type { InterfaceRule } from "@/types/rules";

export function evaluateValidCombination(
    _rule: InterfaceRule,
    _presentColumns: number[],
): boolean {
    //return rule.ruleCombinations.some(combination => combination.members.every(m => presentColumns.includes(m.columnSeq)));
    return true;
}