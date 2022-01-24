import type {LatLngExpression} from 'leaflet';

// DMM形式(度分分)をDEG形式(度)へ変換する。
export function dmm2deg(dmm: number): number {
	let d = Math.floor(dmm / 100);
	let dd = (dmm - d * 100) / 60.0;
	return d + dd;
}

// DEG形式(度)をDMM形式(度分分)へ変換する。
export function deg2dmm(deg: number): number {
	let d = Math.floor(deg);
	let m = (deg - d) * 60.0;
	return d * 100 + m;
}

// 渡された文字列（緯度経度指定テキストフィールドへの入力）を解析し、緯度経度（DEG形式）へ変換する。
// 変換できなかったときや、指定座標が日本付近でなかった場合は null を返す。
export function analyzeLatlngInput(text: string): LatLngExpression | null {
	const input = text.split(RegExp(/[,\t]/));
	let nums = [];

	// 項目の数をチェックする。最低でも2つ以上は必要。
	if (input.length <= 1) {
		return null;
	}

	// 頭から順に見ていって、有効そうな数字が2つ見つかればそれを緯度と経度として採用する。
	for (const v of input) {
		const f = parseFloat(v);
		if (isNaN(f)) {
			continue;
		}
		nums.push(f);

		// 数字が2つになったらそれぞれを緯度経度として値を返す。
		if (nums.length === 2) {
			break;
		}
	}

	// 数字が2つ見付からなかったときは不正な情報として null を返す。
	if (nums.length !== 2) {
		return null;
	}

	let lat = nums[0];
	let lng = nums[1];

	// DEG形式の日本付近チェック。
	if (18 < lat && lat < 50 && 120 < lng && lng < 155) {
		return [lat, lng];
	}

	// DMM形式の日本付近チェック。DEG形式へ変換して返す。
	if (1800 < lat && lat < 5000 && 12000 < lng && lng < 15500) {
		return [dmm2deg(lat), dmm2deg(lng)];
	}

	// return [nums[0], nums[1]];
	return null;
}
