import {analyzeLatlngInput, deg2dmm, dmm2deg} from './latlng';

test('緯度経度の形式変換', () => {
	expect(deg2dmm(35.68096912819847)).toBeCloseTo(3540.85815, 5);
	expect(deg2dmm(139.76600646972656)).toBeCloseTo(13945.96038333, 5);
	expect(deg2dmm(35.731877)).toBeCloseTo(3543.912666, 4);
	expect(dmm2deg(3540.85815)).toBeCloseTo(35.68096912819847, 4);
	expect(dmm2deg(13945.96038333)).toBeCloseTo(139.76600646972656, 4);
	expect(dmm2deg(3543.912666)).toBeCloseTo(35.731877, 4);
});

test('緯度経度テキストフィールド解析', () => {
	expect(analyzeLatlngInput('')).toBeNull();
	expect(analyzeLatlngInput('36.0')).toBeNull();
	expect(analyzeLatlngInput('36.0,')).toBeNull();
	expect(analyzeLatlngInput('36.2,138.7')).toEqual([36.2, 138.7]);
	expect(analyzeLatlngInput('36.2,N, 138.6,E')).toEqual([36.2, 138.6]);
	expect(analyzeLatlngInput('3507.2,13522.2')).toEqual([35.12, 135.37]);
	expect(analyzeLatlngInput('3448,N, 13360,E')).toEqual([34.8, 134.0]);
	// 日本の範囲外(DEG形式)
	expect(analyzeLatlngInput('11,135')).toBeNull();
	expect(analyzeLatlngInput('55,135')).toBeNull();
	expect(analyzeLatlngInput('35,110')).toBeNull();
	expect(analyzeLatlngInput('35,170')).toBeNull();
	expect(analyzeLatlngInput('55,110')).toBeNull();
	expect(analyzeLatlngInput('55,170')).toBeNull();
	expect(analyzeLatlngInput('11,110')).toBeNull();
	expect(analyzeLatlngInput('11,170')).toBeNull();
	// 日本の範囲外(DMM形式)
	expect(analyzeLatlngInput('1100,13500')).toBeNull();
	expect(analyzeLatlngInput('5500,13500')).toBeNull();
	expect(analyzeLatlngInput('3500,11000')).toBeNull();
	expect(analyzeLatlngInput('3500,17000')).toBeNull();
	expect(analyzeLatlngInput('5500,11000')).toBeNull();
	expect(analyzeLatlngInput('5500,17000')).toBeNull();
	expect(analyzeLatlngInput('1100,11000')).toBeNull();
	expect(analyzeLatlngInput('1100,17000')).toBeNull();
});
