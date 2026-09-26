import type { RuleValidationResult } from "@/types/rules";
import { useTranslation } from "react-i18next";

type RuleValidationAlertProps = {
    failedRuleResults: RuleValidationResult[];
};

export function RuleValidationAlert({ failedRuleResults }: RuleValidationAlertProps) {
    const { t } = useTranslation();
    if (failedRuleResults.length === 0) return null;
    return (
        <div
            className="w-full rounded border border-red-200 bg-red-50 px-3 py-2"
            role="alert"
        >
            <p className="text-sm font-medium text-red-700">
                {t("validation.rulesHeader")}
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-red-700">
                {failedRuleResults.map((r) => (
                    <li key={r.ruleSeq}>
                        {t(r.errorMessage ?? "validation.rules.fallback", {
                            ruleName: r.ruleName,
                            defaultValue: r.ruleName,
                        })}
                    </li>
                ))}
            </ul>
        </div>
    );
}
