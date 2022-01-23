import type {LatLngExpression} from 'leaflet';
import {writable} from 'svelte/store';

// 現在の中心位置の緯度経度。DEG形式。
export const currentLatLng = writable<LatLngExpression>([0, 0]);

// 現在のズームレベル。
export const currentZoom = writable<number>(10);
