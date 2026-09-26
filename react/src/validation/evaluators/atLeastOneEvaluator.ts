import type { InterfaceRule } from "@/types/rules";

export function evaluateAtLeastOne(
    rule: InterfaceRule,
    presentColumns: number[]
): boolean {
    return rule.ruleCombinations.flatMap(c => c.members).some(m => presentColumns.includes(m.columnSeq));
}