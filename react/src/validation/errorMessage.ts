import type { InterfaceRule } from "@/types/rules";

const errorMessage: Partial<Record<string, string>> = {
    SecurityIdentifier: "validation.rules.SecurityIdentifier",
    AmountDerivation: "validation.rules.AmountDerivation",
    RequiredFields: "validation.rules.RequiredFields",
};

export function getErrorMessage(rule: InterfaceRule): string {
    return errorMessage[rule.ruleName] ?? `validation.rules.fallback`;
}