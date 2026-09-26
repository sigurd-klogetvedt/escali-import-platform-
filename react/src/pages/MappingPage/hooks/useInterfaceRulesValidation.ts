import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useInterfaceRulesQuery, useQueryErrorToast } from "@/hooks";
import { validateMapping } from "@/validation/mappingValidationService";
import type { RuleValidationResult } from "@/types/rules";

export function useInterfaceRulesValidation(params: {
    interfaceSeq: number;
    presentColumns: number[];
}) {
    const { interfaceSeq, presentColumns } = params;
    const { t } = useTranslation();

    const interfaceRulesQuery = useInterfaceRulesQuery(interfaceSeq);
    const interfaceRules = useMemo(
        () => interfaceRulesQuery.data ?? [],
        [interfaceRulesQuery.data],
    );
    useQueryErrorToast(interfaceRulesQuery, t("toast.mapping.interfaceRulesErrorTitle"), {
        id: `interface-rules-${interfaceSeq}`,
    });

    const ruleValidationResults = useMemo<RuleValidationResult[]>(
        () => validateMapping(interfaceRules, presentColumns),
        [interfaceRules, presentColumns],
    );

    const failedRuleResults = useMemo(
        () => ruleValidationResults.filter((r) => !r.passed),
        [ruleValidationResults],
    );

    // Suppress rule violations until the user has mapped at least one column,
    // otherwise every rule fails on initial render before the user has done anything.
    const hasRuleErrors = presentColumns.length > 0 && failedRuleResults.length > 0;

    return { ruleValidationResults, failedRuleResults, hasRuleErrors };
}
