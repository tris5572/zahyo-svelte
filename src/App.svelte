<script lang="ts">
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import {onMount} from 'svelte';
	import {centerCrossMarker} from './center-cross';
	import {analyzeLatlngInput, deg2dmm} from './latlng';
	import {currentLatLng, currentZoom} from './stores';

	let mapElement: HTMLElement;
	let map: L.Map;
	let centerCross: L.Marker;

	let laglngFieldValue = '';
	let latlngFieldWarning = false;

	let radiusCircle: L.Circle;
	let radiusValue = 300;
	let radiusFlag = false;

	// 半径表示の表示/非表示を、チェックボックスの値に応じて切り替える。
	$: {
		if (radiusCircle != null) {
			if (radiusFlag === true) {
				radiusCircle.addTo(map);
			} else {
				radiusCircle.removeFrom(map);
			}
		}
	}

	// 半径表示の半径を、テキストフィールドの値に応じて変化させる。
	$: {
		if (radiusCircle != null) {
			radiusCircle.setRadius(radiusValue);
		}
	}

	onMount(() => {
		initMap();
	});

	// 地図タイルを初期化する。onMount() 以降で呼び出すこと。
	function initMap() {
		let pale = L.tileLayer('https://maps.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
			maxZoom: 18
		});
		let std = L.tileLayer('https://maps.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
			maxZoom: 18
		});
		let photo = L.tileLayer(
			'https://maps.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
			{
				attribution:
					'&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
				maxZoom: 18
			}
		);

		// 地図を初期化する。
		map = L.map(mapElement, {
			layers: [pale]
		});

		// 中心の十字線をセットする。
		centerCross = centerCrossMarker([0, 0]);
		centerCross.addTo(map);

		// 半径表示をセットする。
		radiusCircle = L.circle([0, 0], radiusValue, {
			color: 'green',
			weight: 1,
			opacity: 0.8
		});
		radiusCircle.addTo(map);

		// タイル一覧を設定する。オプションを渡して常に表示させる。
		L.control
			.layers(
				{
					'地理院地図(淡色)': pale,
					'地理院地図(標準)': std,
					'地理院地図(写真)': photo
				},
				null,
				{collapsed: false}
			)
			.addTo(map);

		// 地図が動かされたとき、表示する座標等の情報を更新する。
		map.on('load', (e: L.LeafletEvent) => {
			mapMoved(e);
		});
		map.on('move', (e: L.LeafletEvent) => {
			mapMoved(e);
		});

		// 初期表示位置をセットする。load イベントを発火させるために、on で load をセット後に呼び出す。
		map.setView([36.2, 138.5], 8);
	}

	// 地図が動かされたときと初期化されたときに呼び出され、現在の位置情報関係の表示等を更新する。
	function mapMoved(e: L.LeafletEvent) {
		let c = e.target.getCenter();
		let latlng: L.LatLngExpression = [c.lat, c.lng];
		currentLatLng.set(latlng);
		currentZoom.set(map.getZoom());
		centerCross.setLatLng(latlng);
		radiusCircle.setLatLng(latlng);
	}

	// 渡された文字列をクリップボードへ書き込む。
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	// DEG形式の現在座標をクリップボードへコピーする。
	function copyDEG() {
		copyToClipboard(
			`${$currentLatLng[0].toFixed(7)},${$currentLatLng[1].toFixed(7)}`
		);
	}

	// DMM形式の現在座標をクリップボードへコピーする。
	function copyDMM() {
		copyToClipboard(
			`${deg2dmm($currentLatLng[0]).toFixed(5)},${deg2dmm(
				$currentLatLng[1]
			).toFixed(5)}`
		);
	}

	// 緯度経度指定フィールドの値が変更されたときに呼び出される。
	function latlngFieldChanged(e: Event) {
		const latlng = analyzeLatlngInput(laglngFieldValue);
		if (latlng == null) {
			// 不正な値のときは警告表示にする。
			latlngFieldWarning = true;
		} else {
			map.setView(latlng);
		}
	}

	// 座標へ移動ボタンが押されたとき、緯度経度指定フィールドの座標へ移動する。
	function moveToLatlng() {
		const latlng = analyzeLatlngInput(laglngFieldValue);
		if (latlng != null) {
			map.setView(latlng);
		}
	}

	// 緯度経度指定フィールドの値をクリアする。
	function clearLatlng() {
		laglngFieldValue = '';
	}
</script>

<div id="container">
	<div id="map" bind:this={mapElement} />
	<div id="information">
		<div class="box">
			<h2>DEG形式</h2>
			{$currentLatLng[0].toFixed(7)}, {$currentLatLng[1].toFixed(7)}
			<button on:click={copyDEG}>クリップボードへコピー</button>
		</div>

		<div class="box">
			<h2>DMM形式</h2>
			{deg2dmm($currentLatLng[0]).toFixed(4)}, {deg2dmm(
				$currentLatLng[1]
			).toFixed(4)}
			<button on:click={copyDMM}>クリップボードへコピー</button>
		</div>

		<div class="box">
			<h2>座標指定</h2>
			<input
				class={latlngFieldWarning ? 'latlngFieldWarning' : 'latlngField'}
				bind:value={laglngFieldValue}
				on:input={latlngFieldChanged}
				type="text"
			/>
			<div class="latlngFieldButtonBox">
				<button class="clear" on:click={clearLatlng}>クリア</button>
				<button class="submit" on:click={moveToLatlng}>座標へ移動</button>
			</div>
		</div>

		<div class="box">
			<h2>半径表示</h2>
			<input
				class="raddiusCheckbox"
				bind:checked={radiusFlag}
				type="checkbox"
			/>
			<input class="radiusField" bind:value={radiusValue} type="number" />m
		</div>

		<div class="box">
			<h2>ズームレベル</h2>
			{$currentZoom}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#container {
		width: 100vw;
		display: flex;
		flex-wrap: nowrap;
	}

	#map {
		width: 100%;
		height: 100vh;
	}

	#information {
		width: 15em;
		background: hsl(180, 16%, 7%);
		color: white;
		padding: 0.5em;
	}

	#information .box {
		border: 1px solid hsla(0, 0%, 100%, 0.5);
		padding: 4px;
		margin: 0 0 8px;
	}
	.box h2 {
		margin: 0;
		font-size: small;
		opacity: 0.6;
		/* font-weight: normal; */
	}
	.box button {
		padding: 2px 8px;
		margin: 4px 0;
		font-size: x-small;
		opacity: 0.9;
		cursor: pointer;
	}

	.latlngField {
		padding: 0 4px;
		margin: 4px 0;
	}
	.latlngFieldWarning {
		padding: 0 4px;
		margin: 4px 0;
		color: red;
	}
	.box .latlngFieldButtonBox {
		display: flex;
		justify-content: space-between;
	}
	.box button.submit {
		padding: 2px 8px;
		margin: 4px 0;
		font-size: small;
		cursor: pointer;
	}
	.box button.clear {
		padding: 2px 8px;
		margin: 4px 0;
		font-size: x-small;
		opacity: 0.9;
		cursor: pointer;
	}

	.raddiusCheckbox {
		margin: 0;
	}
	.radiusField {
		padding: 0 4px;
		margin: 4px 0;
		width: 4em;
	}
</style>
