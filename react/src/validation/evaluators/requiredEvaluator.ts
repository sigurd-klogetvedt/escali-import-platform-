import type { InterfaceRule } from "@/types/rules";

export function evaluateRequired(
    rule: InterfaceRule,
    presentColumns: number[]
): boolean {
    return rule.ruleCombinations.flatMap(c => c.members).every(m => presentColumns.includes(m.columnSeq));
}