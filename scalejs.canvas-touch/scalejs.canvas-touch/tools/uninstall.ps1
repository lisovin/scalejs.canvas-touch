﻿param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'hammer, scalejs.canvas-touch' |
	Remove-ScalejsExtension 'scalejs.canvas-touch' |
	Out-Null
