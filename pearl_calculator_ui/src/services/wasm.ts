import type { PearlTraceResult, TNTResult } from "@/types/domain";
import type {
	CalculationInput,
	ICalculatorService,
	PearlTraceInput,
	RawTraceInput,
} from "./interface";

interface PearlCalculatorWasm {
	calculate_tnt_amount(input: CalculationInput): TNTResult[];
	calculate_pearl_trace(input: PearlTraceInput): PearlTraceResult;
	calculate_raw_trace(input: RawTraceInput): PearlTraceResult;
}

export class WebCalculatorService implements ICalculatorService {
	async calculateTNTAmount(input: CalculationInput): Promise<TNTResult[]> {
		const wasm = (await import(
			"pearl_calculator_wasm"
		)) as unknown as Promise<PearlCalculatorWasm>;
		return (await wasm).calculate_tnt_amount(input);
	}

	async calculatePearlTrace(input: PearlTraceInput): Promise<PearlTraceResult> {
		const wasm = (await import(
			"pearl_calculator_wasm"
		)) as unknown as Promise<PearlCalculatorWasm>;
		return (await wasm).calculate_pearl_trace(input);
	}

	async calculateRawTrace(input: RawTraceInput): Promise<PearlTraceResult> {
		const wasm = (await import(
			"pearl_calculator_wasm"
		)) as unknown as Promise<PearlCalculatorWasm>;
		return (await wasm).calculate_raw_trace(input);
	}
}
