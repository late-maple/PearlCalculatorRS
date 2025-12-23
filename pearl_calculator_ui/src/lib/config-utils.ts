import type {
	BitDirection,
	BitInputState,
	GeneralConfig,
} from "@/types/domain";

export type TNTDirection =
	| "SouthEast"
	| "NorthWest"
	| "SouthWest"
	| "NorthEast";

export interface DraftConfig {
	pearl_x_position: string;
	pearl_y_position: string;
	pearl_z_position: string;
	pearl_y_motion: string;
	max_tnt: string;
	north_west_tnt: { x: string; y: string; z: string };
	north_east_tnt: { x: string; y: string; z: string };
	south_west_tnt: { x: string; y: string; z: string };
	south_east_tnt: { x: string; y: string; z: string };
}

export interface CannonCenter {
	x: string;
	z: string;
}

export interface PearlMomentum {
	x: string;
	y: string;
	z: string;
}

export function getOppositeDirection(dir: string | undefined): TNTDirection {
	switch (dir) {
		case "NorthWest":
			return "SouthEast";
		case "SouthEast":
			return "NorthWest";
		case "NorthEast":
			return "SouthWest";
		case "SouthWest":
			return "NorthEast";
		default:
			return "SouthEast";
	}
}

export function getRelativeTNT(
	tnt: { x: string; y: string; z: string },
	cx: number,
	cz: number,
) {
	return {
		x: (parseFloat(tnt.x) || 0) - cx,
		y: parseFloat(tnt.y) || 0,
		z: (parseFloat(tnt.z) || 0) - cz,
	};
}

export function getRelativeTNTUppercase(
	tnt: { x: string; y: string; z: string },
	cx: number,
	cz: number,
) {
	return {
		X: (parseFloat(tnt.x) || 0) - cx,
		Y: parseFloat(tnt.y) || 0,
		Z: (parseFloat(tnt.z) || 0) - cz,
	};
}

export function convertDraftToConfig(
	draftConfig: DraftConfig,
	cannonCenter: CannonCenter,
	redTNTLocation: string | undefined,
): GeneralConfig {
	const cx = parseFloat(cannonCenter.x) || 0;
	const cz = parseFloat(cannonCenter.z) || 0;

	const redDir: TNTDirection =
		redTNTLocation === "NorthWest" ? "NorthWest" : "SouthEast";

	return {
		north_east_tnt: getRelativeTNT(draftConfig.north_east_tnt, cx, cz),
		north_west_tnt: getRelativeTNT(draftConfig.north_west_tnt, cx, cz),
		south_east_tnt: getRelativeTNT(draftConfig.south_east_tnt, cx, cz),
		south_west_tnt: getRelativeTNT(draftConfig.south_west_tnt, cx, cz),
		pearl_x_position: 0,
		pearl_y_motion: parseFloat(draftConfig.pearl_y_motion) || 0,
		pearl_y_position: parseFloat(draftConfig.pearl_y_position) || 0,
		pearl_z_position: 0,
		max_tnt: parseFloat(draftConfig.max_tnt) || 0,
		default_red_tnt_position: redDir,
		default_blue_tnt_position: getOppositeDirection(redDir),
	};
}

export function buildExportConfig(
	draftConfig: DraftConfig,
	cannonCenter: CannonCenter,
	pearlMomentum: PearlMomentum,
	redTNTLocation: string | undefined,
	bitTemplateState: BitInputState | undefined,
): Record<string, unknown> {
	const cx = parseFloat(cannonCenter.x) || 0;
	const cz = parseFloat(cannonCenter.z) || 0;
	const pearlX = parseFloat(draftConfig.pearl_x_position) || 0;
	const pearlZ = parseFloat(draftConfig.pearl_z_position) || 0;

	const config: Record<string, unknown> = {
		NorthEastTNT: getRelativeTNTUppercase(draftConfig.north_east_tnt, cx, cz),
		NorthWestTNT: getRelativeTNTUppercase(draftConfig.north_west_tnt, cx, cz),
		SouthEastTNT: getRelativeTNTUppercase(draftConfig.south_east_tnt, cx, cz),
		SouthWestTNT: getRelativeTNTUppercase(draftConfig.south_west_tnt, cx, cz),
		Offset: { X: pearlX - cx, Z: pearlZ - cz },
		Pearl: {
			Position: {
				X: 0,
				Y: parseFloat(draftConfig.pearl_y_position) || 0,
				Z: 0,
			},
			Motion: {
				X: parseFloat(pearlMomentum.x) || 0,
				Y: parseFloat(draftConfig.pearl_y_motion) || 0,
				Z: parseFloat(pearlMomentum.z) || 0,
			},
		},
		MaxTNT: parseFloat(draftConfig.max_tnt) || 0,
		DefaultRedTNTDirection: redTNTLocation,
		DefaultBlueTNTDirection: getOppositeDirection(redTNTLocation),
	};

	if (bitTemplateState) {
		config.SideMode = bitTemplateState.sideCount;
		const directionMasks: Record<string, BitDirection> = {};
		for (const mask of bitTemplateState.masks) {
			const key = mask.bits.join("");
			if (mask.direction) {
				directionMasks[key] = mask.direction as BitDirection;
			}
		}
		config.DirectionMasks = directionMasks;
		config.RedValues = bitTemplateState.sideValues
			.map((v) => parseInt(v, 10) || 0)
			.reverse();
		config.IsRedArrowCenter = bitTemplateState.isSwapped;
	}

	return config;
}

export function convertConfigToDraft(config: GeneralConfig): {
	draft: DraftConfig;
	center: CannonCenter;
	momentum: PearlMomentum;
	redLocation: string | undefined;
} {
	const center = { x: "0", z: "0" };

	const momentum = {
		x: "0",
		y: config.pearl_y_motion.toString(),
		z: "0",
	};

	const redLocation = config.default_red_tnt_position;

	const draft: DraftConfig = {
		max_tnt: config.max_tnt.toString(),
		north_west_tnt: {
			x: config.north_west_tnt.x.toString(),
			y: config.north_west_tnt.y.toString(),
			z: config.north_west_tnt.z.toString(),
		},
		north_east_tnt: {
			x: config.north_east_tnt.x.toString(),
			y: config.north_east_tnt.y.toString(),
			z: config.north_east_tnt.z.toString(),
		},
		south_west_tnt: {
			x: config.south_west_tnt.x.toString(),
			y: config.south_west_tnt.y.toString(),
			z: config.south_west_tnt.z.toString(),
		},
		south_east_tnt: {
			x: config.south_east_tnt.x.toString(),
			y: config.south_east_tnt.y.toString(),
			z: config.south_east_tnt.z.toString(),
		},
		pearl_x_position: config.pearl_x_position.toString(),
		pearl_y_position: config.pearl_y_position.toString(),
		pearl_z_position: config.pearl_z_position.toString(),
		pearl_y_motion: config.pearl_y_motion.toString(),
	};

	return { draft, center, momentum, redLocation };
}
