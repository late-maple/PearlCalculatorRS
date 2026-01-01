import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useConfig } from "@/context/ConfigContext";
import { useConfigurationState } from "@/context/ConfigurationStateContext";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import { toBackendMode } from "@/lib/config-utils";
import type { PearlTraceResult } from "@/types/domain";

export function usePearlTrace() {
	const { t } = useTranslation();
	const { showError } = useToastNotifications();
	const { configData, version } = useConfig();
	const { calculationMode } = useConfigurationState();
	const [loading, setLoading] = useState(false);

	const calculatePearlTrace = async (
		tntResult: {
			red: number;
			blue: number;
			vertical?: number;
			direction: string;
		},
		destination: { x: number; z: number },
		cannonY: number,
	): Promise<PearlTraceResult | null> => {
		setLoading(true);
		try {
			const traceResult = await invoke<PearlTraceResult>(
				"calculate_pearl_trace_command",
				{
					input: {
						pearlX: configData.pearl_x_position,
						pearlY: configData.pearl_y_position,
						pearlZ: configData.pearl_z_position,
						pearlMotionX: 0,
						pearlMotionY: configData.pearl_y_motion,
						pearlMotionZ: 0,
						offsetX: configData.offset_x ?? 0,
						offsetZ: configData.offset_z ?? 0,
						cannonY: cannonY,

						mode: toBackendMode(calculationMode),

						northWestTnt: configData.north_west_tnt,
						northEastTnt: configData.north_east_tnt,
						southWestTnt: configData.south_west_tnt,
						southEastTnt: configData.south_east_tnt,

						verticalTntAmount: tntResult.vertical,
						verticalTnt: configData.vertical_tnt,

						defaultRedDirection: configData.default_red_tnt_position,
						defaultBlueDirection: configData.default_blue_tnt_position,
						destinationX: destination.x,
						destinationZ: destination.z,
						redTnt: tntResult.red,
						blueTnt: tntResult.blue,
						direction: tntResult.direction,
						version: version,
					},
				},
			);
			return traceResult;
		} catch (error) {
			console.error("Pearl trace calculation failed:", error);
			showError(t("error.calculator.pearl_trace"), error);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { calculatePearlTrace, loading };
}
