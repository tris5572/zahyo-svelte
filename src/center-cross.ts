import * as L from 'leaflet';

// デフォルトの塗りつぶし色。
const DEFAULT_COLOR = '#99000099';

type IconOptions = {
	fill?: string;
	stroke?: string;
	cursor?:
		| 'auto'
		| 'crosshair'
		| 'default'
		| 'pointer'
		| 'move'
		| 'e-resize'
		| 'ne-resize'
		| 'nw-resize'
		| 'n-resize'
		| 'se-resize'
		| 'sw-resize'
		| 's-resize'
		| 'w-resize'
		| 'text'
		| 'wait'
		| 'help';
	fillOpacity?: number;
	fillRule?: 'nonzero' | 'evenodd';
	filter?: string;
	mask?: string;
	opacity?: number;
	pointerEvents?: string;
	shapeRendering?:
		| 'auto'
		| 'optimizeSpeed'
		| 'crispEdges'
		| 'geometricPrecision';
	strokeDasharray?: string;
	strokeDashoffset?: number | string;
	strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
	strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
	strokeMiterlimit?: number;
	strokeOpacity?: number | string;
	strokeWidth?: number | string;
	transform?: string;
	vectorEffect?:
		| 'none'
		| 'non-scaling-stroke'
		| 'non-scaling-size'
		| 'non-rotation'
		| 'fixed-position';
	visibility?: 'visible' | 'hidden' | 'collapse';
};
const svg = `
<svg width="19" height="19" viewBox="0 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 0 L11 0 L11 8 L19 8 L19 11 L11 11 L11 19 L8 19 L8 11 L0 11 L0 8 L8 8 Z"></path>
</svg>
`;

export function centerCrossIcon(): L.DivIcon {
	return L.divIcon({
		html: svg,
		className: '', // この指定がないと、背景が透明にならない
		iconSize: [19, 19],
		iconAnchor: [10, 10]
	});
}

export function centerCrossMarker(
	latlng: L.LatLngExpression,
	options?: IconOptions
): L.Marker {
	// SVGで指定するオプションの配列。
	const opt = [];

	// fill だけは必ずセットする。
	if (options == null || options.fill == null) {
		opt.push(` fill="${DEFAULT_COLOR}"`);
	} else {
		opt.push(` fill="${options.fill}"`);
	}

	// 他のオプションが渡されていればセットする。
	if (options != null) {
		if (options.stroke != null) {
			opt.push(` stroke="${options.stroke}"`);
		}
		if (options.cursor != null) {
			opt.push(` cursor="${options.cursor}"`);
		}
		if (options.fillOpacity != null) {
			opt.push(` fill-opacity="${options.fillOpacity}"`);
		}
		if (options.fillRule != null) {
			opt.push(` fill-rule="${options.fillRule}"`);
		}
		if (options.filter != null) {
			opt.push(` filter="${options.filter}"`);
		}
		if (options.mask != null) {
			opt.push(` mask="${options.mask}"`);
		}
		if (options.opacity != null) {
			opt.push(` opacity="${options.opacity}"`);
		}
		if (options.pointerEvents != null) {
			opt.push(` pointer-events="${options.pointerEvents}"`);
		}
		if (options.shapeRendering != null) {
			opt.push(` shape-rendering="${options.shapeRendering}"`);
		}
		if (options.strokeDasharray != null) {
			opt.push(` stroke-dasharray="${options.strokeDasharray}"`);
		}
		if (options.strokeDashoffset != null) {
			opt.push(` stroke-dashoffset="${options.strokeDashoffset}"`);
		}
		if (options.strokeLinecap != null) {
			opt.push(` stroke-linecap="${options.strokeLinecap}"`);
		}
		if (options.strokeLinejoin != null) {
			opt.push(` stroke-linejoin="${options.strokeLinejoin}"`);
		}
		if (options.strokeMiterlimit != null) {
			opt.push(` stroke-miterlimit="${options.strokeMiterlimit}"`);
		}
		if (options.strokeOpacity != null) {
			opt.push(` stroke-opacity="${options.strokeOpacity}"`);
		}
		if (options.strokeWidth != null) {
			opt.push(` stroke-width="${options.strokeWidth}"`);
		}
		if (options.transform != null) {
			opt.push(` transform="${options.transform}"`);
		}
		if (options.vectorEffect != null) {
			opt.push(` vector-effect="${options.vectorEffect}"`);
		}
		if (options.visibility != null) {
			opt.push(` visibility="${options.visibility}"`);
		}
	}

	const option = opt.join('');

	const icon = L.divIcon({
		html: `
		<svg width="19" height="19" viewBox="0 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 0 L11 0 L11 8 L19 8 L19 11 L11 11 L11 19 L8 19 L8 11 L0 11 L0 8 L8 8 Z" ${option}></path>
		</svg>
		`,
		className: '', // この指定がないと、背景が透明にならない
		iconSize: [19, 19],
		iconAnchor: [10, 10]
	});

	return L.marker(latlng, {icon});
}
