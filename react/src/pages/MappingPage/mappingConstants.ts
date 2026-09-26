/** Select value for the synthetic "clear all column mappings" row (reset). */
export const MAPPING_TEMPLATE_EMPTY_VALUE = "__mapping_template_empty__" as const;

export const MAPPING_TEMPLATE_ITEMS = [
    { value: "transactions", label: "Transactions" },
    { value: "collateral", label: "Collateral" },
    { value: "market-rates", label: "Market rates" },
    { value: "interest-data", label: "Interest data" },
    { value: "security-data", label: "Security data" },
    { value: "valances", label: "Balances" },
] as const;