param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.canvas-touch' : 'Scripts/scalejs.canvas-touch-$($package.Version)'
	}" |
	Add-ScalejsExtension 'scalejs.canvas-touch' |
	Out-Null