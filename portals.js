const portals = [
	{
		from: { plane: 'Cordillera', x: 11, y: 32, side: 'Outside' },
		to: { plane: 'Cordillera', x: 27, y: 31, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 55, y: 31, side: 'Outside' },
		to: { plane: 'Cordillera', x: 62, y: 10, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 27, y: 31, side: 'Outside' },
		to: { plane: 'Centrum', x: 36, y: 31, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 41, y: 17, side: 'Outside' },
		to: { plane: 'Centrum', x: 41, y: 26, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 41, y: 45, side: 'Outside' },
		to: { plane: 'Centrum', x: 41, y: 36, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 55, y: 31, side: 'Outside' },
		to: { plane: 'Centrum', x: 46, y: 31, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 31, y: 23, side: 'Inside' },
		to: { plane: 'Centrum', x: 31, y: 22, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 34, y: 22, side: 'Inside' },
		to: { plane: 'Centrum', x: 34, y: 23, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 52, y: 18, side: 'Inside' },
		to: { plane: 'Centrum', x: 51, y: 19, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 53, y: 22, side: 'Inside' },
		to: { plane: 'Centrum', x: 53, y: 21, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 54, y: 40, side: 'Inside' },
		to: { plane: 'Centrum', x: 53, y: 41, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 50, y: 43, side: 'Inside' },
		to: { plane: 'Centrum', x: 51, y: 43, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 6, y: 27, side: 'Inside' },
		to: { plane: 'Purgatorio', x: 15, y: 7, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 64, y: 5, side: 'Inside' },
		to: { plane: 'Purgatorio', x: 2, y: 7, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 20, y: 19, side: 'Outside' },
		to: { plane: 'Purgatorio', x: 8, y: 11, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 20, y: 21, side: 'Inside' },
		to: { plane: 'PurgatorioUG', x: 20, y: 21, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 17, y: 18, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 17, y: 18, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 26, y: 25, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 26, y: 25, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 8, y: 5, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 2, y: 2, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 11, y: 4, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 7, y: 2, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 5, y: 11, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 2, y: 6, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 14, y: 13, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 8, y: 8, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Purgatorio', x: 8, y: 16, side: 'Outside' },
		to: { plane: 'PurgatorioUG', x: 5, y: 11, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'PurgatorioUG', x: 17, y: 18, side: 'Inside' },
		to: { plane: 'PurgatorioUG', x: 26, y: 25, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 32, y: 29, side: 'Inside' },
		to: { plane: 'Stygia', x: 12, y: 17, side: 'Inside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 35, y: 14, side: 'Outside' },
		to: { plane: 'Stygia', x: 16, y: 16, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Stygia', x: 17, y: 19, side: 'Outside' },
		to: { plane: 'Stygia', x: 4, y: 19, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Stygia', x: 17, y: 19, side: 'Outside' },
		to: { plane: 'Stygia', x: 6, y: 7, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Stygia', x: 17, y: 19, side: 'Outside' },
		to: { plane: 'Stygia', x: 16, y: 6, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 51, y: 39, side: 'Inside' },
		to: { plane: 'Elysium', x: 5, y: 3, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Cordillera', x: 38, y: 37, side: 'Inside' },
		to: { plane: 'Elysium', x: 15, y: 9, side: 'Outside' },
		bidirectional: true
	},
	{
		from: { plane: 'Elysium', x: 8, y: 2, side: 'Outside' },
		to: { plane: 'Elysium', x: 12, y: 17, side: 'Outside' },
		bidirectional: true
	},
];
