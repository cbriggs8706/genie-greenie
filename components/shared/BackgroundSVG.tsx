export default function BackgroundSVG() {
	return (
		<div className="fixed bottom-0 left-0 right-0 -z-10 pointer-events-none">
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 1440 590"
				xmlns="http://www.w3.org/2000/svg"
				className="transition duration-300 ease-in-out delay-150"
			>
				<defs>
					<linearGradient id="gradient1" x1="50%" y1="100%" x2="50%" y2="0%">
						<stop offset="5%" stopColor="#fef08a"></stop>
						<stop offset="95%" stopColor="#16a34a"></stop>
					</linearGradient>
					<linearGradient id="gradient2" x1="50%" y1="100%" x2="50%" y2="0%">
						<stop offset="5%" stopColor="#fef08a"></stop>
						<stop offset="95%" stopColor="#16a34a"></stop>
					</linearGradient>
				</defs>
				<path
					d="M 0,600 L 0,150 C 90.65,172.83 181.31,195.65 265,204 C 348.69,212.35 425.42,206.22 489,177 C 552.58,147.78 603,95.47 690,105 C 777,114.53 900.58,185.91 981,210 C 1061.42,234.09 1098.69,210.88 1168,193 C 1237.31,175.12 1338.65,162.56 1440,150 L 1440,600 L 0,600 Z"
					fill="url(#gradient1)"
					fillOpacity="0.53"
					className="transition-all duration-300 ease-in-out delay-150"
				/>
				<path
					d="M 0,600 L 0,350 C 100.43,314.76 200.86,279.53 279,277 C 357.14,274.47 412.98,304.65 474,327 C 535.02,349.35 601.2,363.87 683,381 C 764.8,398.13 862.22,417.88 956,412 C 1049.78,406.12 1139.94,374.61 1220,360 C 1300.06,345.39 1370.03,347.7 1440,350 L 1440,600 L 0,600 Z"
					fill="url(#gradient2)"
					fillOpacity="1"
					className="transition-all duration-300 ease-in-out delay-150"
				/>
			</svg>
		</div>
	)
}
