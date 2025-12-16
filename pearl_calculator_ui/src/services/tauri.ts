import { invoke } from "@tauri-apps/api/core";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import type { PearlTraceResult, TNTResult } from "@/types/domain";
import type {
	CalculationInput,
	ICalculatorService,
	PearlTraceInput,
	RawTraceInput,
} from "./interface";

export class TauriCalculatorService implements ICalculatorService {
	async calculateTNTAmount(input: CalculationInput): Promise<TNTResult[]> {
		return invoke<TNTResult[]>("calculate_tnt_amount_command", { input });
	}

	async calculatePearlTrace(input: PearlTraceInput): Promise<PearlTraceResult> {
		return invoke<PearlTraceResult>("calculate_pearl_trace_command", { input });
	}

	async calculateRawTrace(input: RawTraceInput): Promise<PearlTraceResult> {
		return invoke<PearlTraceResult>("calculate_raw_trace_command", { input });
	}

	async copyToClipboard(text: string): Promise<void> {
		await writeText(text);
	}

	async readFromClipboard(): Promise<string> {
		return await readText();
	}
}
