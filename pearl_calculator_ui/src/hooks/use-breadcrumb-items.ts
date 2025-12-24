
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCalculatorState } from "@/context/CalculatorStateContext";
import { useConfig } from "@/context/ConfigContext";
import { useConfigurationState } from "@/context/ConfigurationStateContext";

export interface BreadcrumbItemType {
    label: string | undefined;
    href?: string;
    active?: boolean;
    onClick?: () => void;
}

const isBreadcrumb = (item: BreadcrumbItemType | boolean | undefined | null): item is BreadcrumbItemType => {
    return !!item;
};

export function useBreadcrumbItems() {
    const location = useLocation();
    const { t } = useTranslation();
    const { hasConfig, setHasConfig } = useConfig();
    const { defaultCalculator, updateDefaultTrace, updateBitCalculation } = useCalculatorState();
    const { isWizardActive, isFinished, setIsFinished, setIsWizardActive } = useConfigurationState();

    const showPearlTrace = defaultCalculator.trace.show;
    const showBitCalculation = defaultCalculator.trace.bitCalculation?.show;

    const resetConfig = () => {
        updateBitCalculation({ show: false });
        updateDefaultTrace({ show: false });
        setHasConfig(false);
    };

    const resetTrace = () => {
        updateBitCalculation({ show: false });
        updateDefaultTrace({ show: false });
    };

    const resetBit = () => updateBitCalculation({ show: false });

    const resetWizard = () => {
        setIsWizardActive(false);
        setIsFinished(false);
    };

    const resetFinished = () => setIsFinished(false);

    const getHomeBreadcrumbs = (): BreadcrumbItemType[] => {
        if (!hasConfig) {
            return [{ label: t("breadcrumb.select_config"), href: "/", active: true }];
        }

        return ([
            {
                label: t("breadcrumb.select_config"),
                onClick: resetConfig,
            },
            {
                label: t("breadcrumb.calculator"),
                href: "/",
                active: !showPearlTrace,
                onClick: showPearlTrace ? resetTrace : undefined,
            },
            showPearlTrace && {
                label: t("breadcrumb.pearl_trace"),
                active: !showBitCalculation,
                onClick: showBitCalculation ? resetBit : undefined,
            },
            (showPearlTrace && showBitCalculation) && {
                label: t("breadcrumb.bit_calculation"),
                active: true,
            },
        ] as (BreadcrumbItemType | boolean | undefined | null)[]).filter(isBreadcrumb);
    };

    const getConfigBreadcrumbs = (): BreadcrumbItemType[] => {
        return ([
            {
                label: t("breadcrumb.configuration"),
                href: "/configuration",
                active: !isWizardActive,
                onClick: isWizardActive ? resetWizard : undefined,
            },
            isWizardActive && {
                label: t("breadcrumb.new_config"),
                active: !isFinished,
                onClick: isFinished ? resetFinished : undefined,
            },
            (isWizardActive && isFinished) && {
                label: t("breadcrumb.completed"),
                active: true,
            },
        ] as (BreadcrumbItemType | boolean | undefined | null)[]).filter(isBreadcrumb);
    };

    const breadcrumbRoutes: Record<string, () => BreadcrumbItemType[]> = {
        "/": getHomeBreadcrumbs,
        "/simulator": () => [{ label: t("breadcrumb.simulator"), href: "/simulator", active: true }],
        "/configuration": getConfigBreadcrumbs,
        "/settings": () => [{ label: t("breadcrumb.settings"), href: "/settings", active: true }],
    };

    return breadcrumbRoutes[location.pathname]?.() || [];
}
