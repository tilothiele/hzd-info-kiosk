// Erweiterte Mock-Daten für 110 Hunde
export const dogs = [
	{
		id: 1,
		name: 'Sofia aus dem Harz',
		gender: 'H',
		birthDate: '2023-10-21',
		color: 'Schwarzmarken',
		owner: 'Michael Becker',
		location: 'Mainz, Rheinland-Pfalz',
		plz: '55118',
		pedigreeNumber: 'HZD-2023-001',
		microchipId: 'DE088442848605772',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [49.9929, 8.2473] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 2,
		name: 'Balu vom Neckar',
		gender: 'R',
		birthDate: '2022-05-08',
		color: 'Schwarzmarken',
		owner: 'Petra Klein',
		location: 'Bremen, Bremen',
		plz: '28197',
		pedigreeNumber: 'HZD-2022-002',
		microchipId: 'DE786309261544450',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		coordinates: [53.0793, 8.8017] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 3,
		name: 'Finn aus dem Sauerland',
		gender: 'R',
		birthDate: '2018-03-26',
		color: 'Schwarzmarken',
		owner: 'Peter Weber',
		location: 'Kiel, Schleswig-Holstein',
		plz: '24105',
		pedigreeNumber: 'HZD-2018-003',
		microchipId: 'DE430256210786568',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [54.3233, 10.1228] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 4,
		name: 'Theo von der Donau',
		gender: 'H',
		birthDate: '2016-06-03',
		color: 'Schwarz',
		owner: 'Anna Schmidt',
		location: 'Berlin, Berlin',
		plz: '10115',
		pedigreeNumber: 'HZD-2016-004',
		microchipId: 'DE127561841213699',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [52.5200, 13.4050] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 5,
		name: 'Bruno aus dem Thüringer Wald',
		gender: 'R',
		birthDate: '2017-02-02',
		color: 'Schwarzmarken',
		owner: 'Jens Lehmann',
		location: 'Hamburg, Hamburg',
		plz: '20099',
		pedigreeNumber: 'HZD-2017-005',
		microchipId: 'DE593473592979259',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0'],
		coordinates: [53.5511, 9.9937] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 6,
		name: 'Mira vom Schwarzen Wald',
		gender: 'R',
		birthDate: '2019-10-19',
		color: 'Schwarz',
		owner: 'Petra Klein',
		location: 'Stuttgart, Baden-Württemberg',
		plz: '70173',
		pedigreeNumber: 'HZD-2019-006',
		microchipId: 'DE376741921291929',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [48.7758, 9.1829] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 7,
		name: 'Anton vom Rhein',
		gender: 'H',
		birthDate: '2018-07-25',
		color: 'Blond',
		owner: 'Birgit Neumann',
		location: 'Nürnberg, Bayern',
		plz: '90403',
		pedigreeNumber: 'HZD-2018-007',
		microchipId: 'DE291760565620811',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [49.4521, 11.0767] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 8,
		name: 'Hannah aus dem Taunus',
		gender: 'R',
		birthDate: '2015-03-20',
		color: 'Schwarz',
		owner: 'Jens Lehmann',
		location: 'Nürnberg, Bayern',
		plz: '90402',
		pedigreeNumber: 'HZD-2015-008',
		microchipId: 'DE454297053851310',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [49.4521, 11.0767] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 9,
		name: 'Rex aus dem Sauerland',
		gender: 'R',
		birthDate: '2022-05-11',
		color: 'Blond',
		owner: 'Maria Fischer',
		location: 'Berlin, Berlin',
		plz: '10115',
		pedigreeNumber: 'HZD-2022-009',
		microchipId: 'DE312031275818791',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0'],
		coordinates: [52.5200, 13.4050] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 10,
		name: 'Luna aus dem Sauerland',
		gender: 'R',
		birthDate: '2022-08-25',
		color: 'Blond',
		owner: 'Susanne Braun',
		location: 'Kiel, Schleswig-Holstein',
		plz: '24103',
		pedigreeNumber: 'HZD-2022-010',
		microchipId: 'DE975415778305741',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		coordinates: [54.3233, 10.1228] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face'
		],
	},
	// Weitere 100 Hunde...
	{
		id: 11,
		name: 'Max vom Bodensee',
		gender: 'R',
		birthDate: '2021-04-15',
		color: 'Schwarzmarken',
		owner: 'Thomas Müller',
		location: 'München, Bayern',
		plz: '80331',
		pedigreeNumber: 'HZD-2021-011',
		microchipId: 'DE123456789012345',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei'],
		coordinates: [48.1351, 11.5820] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 12,
		name: 'Emma aus dem Harz',
		gender: 'H',
		birthDate: '2020-09-12',
		color: 'Schwarz',
		owner: 'Sabine Wagner',
		location: 'Hamburg, Hamburg',
		plz: '20095',
		pedigreeNumber: 'HZD-2020-012',
		microchipId: 'DE234567890123456',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'VWD-frei'],
		coordinates: [53.5511, 9.9937] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 13,
		name: 'Bella vom Rhein',
		gender: 'H',
		birthDate: '2019-12-03',
		color: 'Blond',
		owner: 'Klaus Hoffmann',
		location: 'Köln, Nordrhein-Westfalen',
		plz: '50667',
		pedigreeNumber: 'HZD-2019-013',
		microchipId: 'DE345678901234567',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [50.9375, 6.9603] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 14,
		name: 'Rocky aus dem Schwarzwald',
		gender: 'R',
		birthDate: '2018-06-18',
		color: 'Schwarzmarken',
		owner: 'Monika Schulz',
		location: 'Stuttgart, Baden-Württemberg',
		plz: '70173',
		pedigreeNumber: 'HZD-2018-014',
		microchipId: 'DE456789012345678',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [48.7758, 9.1829] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face'
		],
	},
	{
		id: 15,
		name: 'Luna vom Spreewald',
		gender: 'H',
		birthDate: '2021-01-30',
		color: 'Schwarz',
		owner: 'Andreas Richter',
		location: 'Berlin, Berlin',
		plz: '10115',
		pedigreeNumber: 'HZD-2021-015',
		microchipId: 'DE567890123456789',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei'],
		coordinates: [52.5200, 13.4050] as [number, number],
		mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		gallery: [
			'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face'
		],
	},
	// ... weitere 95 Hunde würden hier folgen
	// Für die Demo erstelle ich nur die ersten 15, aber die Struktur ist klar
]

// Generiere die restlichen 95 Hunde programmatisch
const generateAdditionalDogs = () => {
	const locations = [
		{ name: 'München, Bayern', plz: '80331', coords: [48.1351, 11.5820] as [number, number] },
		{ name: 'Hamburg, Hamburg', plz: '20095', coords: [53.5511, 9.9937] as [number, number] },
		{ name: 'Köln, Nordrhein-Westfalen', plz: '50667', coords: [50.9375, 6.9603] as [number, number] },
		{ name: 'Stuttgart, Baden-Württemberg', plz: '70173', coords: [48.7758, 9.1829] as [number, number] },
		{ name: 'Berlin, Berlin', plz: '10115', coords: [52.5200, 13.4050] as [number, number] },
		{ name: 'Frankfurt, Hessen', plz: '60311', coords: [50.1109, 8.6821] as [number, number] },
		{ name: 'Düsseldorf, Nordrhein-Westfalen', plz: '40213', coords: [51.2277, 6.7735] as [number, number] },
		{ name: 'Leipzig, Sachsen', plz: '04109', coords: [51.3397, 12.3731] as [number, number] },
		{ name: 'Dresden, Sachsen', plz: '01067', coords: [51.0504, 13.7373] as [number, number] },
		{ name: 'Nürnberg, Bayern', plz: '90402', coords: [49.4521, 11.0767] as [number, number] },
		{ name: 'Bremen, Bremen', plz: '28195', coords: [53.0793, 8.8017] as [number, number] },
		{ name: 'Hannover, Niedersachsen', plz: '30159', coords: [52.3759, 9.7320] as [number, number] },
		{ name: 'Kiel, Schleswig-Holstein', plz: '24103', coords: [54.3233, 10.1228] as [number, number] },
		{ name: 'Magdeburg, Sachsen-Anhalt', plz: '39104', coords: [52.1205, 11.6276] as [number, number] },
		{ name: 'Schwerin, Mecklenburg-Vorpommern', plz: '19053', coords: [53.6355, 11.4012] as [number, number] },
		{ name: 'Potsdam, Brandenburg', plz: '14467', coords: [52.3989, 13.0667] as [number, number] },
		{ name: 'Saarbrücken, Saarland', plz: '66111', coords: [49.2401, 6.9969] as [number, number] },
		{ name: 'Mainz, Rheinland-Pfalz', plz: '55116', coords: [50.0755, 8.2375] as [number, number] },
		{ name: 'Wiesbaden, Hessen', plz: '65183', coords: [50.0826, 8.2493] as [number, number] },
		{ name: 'Erfurt, Thüringen', plz: '99084', coords: [50.9848, 11.0299] as [number, number] },
	]

	const breeders = [
		'Max Mustermann', 'Anna Schmidt', 'Peter Weber', 'Maria Fischer',
		'Jens Lehmann', 'Petra Klein', 'Susanne Braun', 'Birgit Neumann',
		'Thomas Müller', 'Sabine Wagner', 'Klaus Hoffmann', 'Monika Schulz',
		'Andreas Richter', 'Christine Lange', 'Stefan Bauer', 'Nicole Wolf',
		'Michael Becker', 'Silvia König', 'Rainer Zimmermann', 'Ute Fuchs'
	]

	const dogNames = [
		'Max', 'Bella', 'Luna', 'Rocky', 'Emma', 'Finn', 'Mira', 'Bruno',
		'Anton', 'Hannah', 'Rex', 'Sofia', 'Balu', 'Theo', 'Luna', 'Max',
		'Emma', 'Bella', 'Rocky', 'Finn', 'Mira', 'Bruno', 'Anton', 'Hannah',
		'Rex', 'Sofia', 'Balu', 'Theo', 'Luna', 'Max', 'Emma', 'Bella'
	]

	const colors = ['Schwarzmarken', 'Schwarz', 'Blond']
	const genders = ['Männlich', 'Weiblich']
	const healthTestOptions = [
		['HD-A1', 'ED-0'],
		['HD-A1', 'ED-0', 'PRA-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei']
	]

	const additionalDogs = []
	
	for (let i = 16; i <= 110; i++) {
		const location = locations[Math.floor(Math.random() * locations.length)]
		const breeder = breeders[Math.floor(Math.random() * breeders.length)]
		const dogName = dogNames[Math.floor(Math.random() * dogNames.length)]
		const color = colors[Math.floor(Math.random() * colors.length)]
		const gender = genders[Math.floor(Math.random() * genders.length)]
		const healthTests = healthTestOptions[Math.floor(Math.random() * healthTestOptions.length)]
		const isStudAvailable = Math.random() > 0.7 // 30% Chance für Deckrüden
		
		// Zufälliges Geburtsdatum zwischen 2015 und 2023
		const year = 2015 + Math.floor(Math.random() * 9)
		const month = 1 + Math.floor(Math.random() * 12)
		const day = 1 + Math.floor(Math.random() * 28)
		const birthDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
		
		// Zufällige Mikrochip-ID
		const microchipId = `DE${Math.floor(Math.random() * 900000000000000000) + 100000000000000000}`
		
		// Zufällige Bilder
		const imageIds = [1552053831, 1583337130, 1601758228, 1544005313, 1500648767, 1599566150]
		const mainImageId = imageIds[Math.floor(Math.random() * imageIds.length)]
		const galleryImages = imageIds
			.sort(() => 0.5 - Math.random())
			.slice(0, 2 + Math.floor(Math.random() * 2))
			.map(id => `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&crop=face`)

		additionalDogs.push({
			id: i,
			name: `${dogName} ${['vom', 'aus dem', 'von der', 'aus der'][Math.floor(Math.random() * 4)]} ${['Harz', 'Neckar', 'Sauerland', 'Donau', 'Thüringer Wald', 'Schwarzen Wald', 'Rhein', 'Taunus', 'Bodensee', 'Spreewald', 'Schwarzwald', 'Weser', 'Elbe', 'Oder', 'Main', 'Mosel', 'Saale', 'Havel', 'Spree', 'Ruhr'][Math.floor(Math.random() * 20)]}`,
			gender,
			birthDate,
			color,
			owner: breeder,
			location: location.name,
			plz: location.plz,
			pedigreeNumber: `HZD-${year}-${i.toString().padStart(3, '0')}`,
			microchipId,
			isStudAvailable,
			healthTests,
			coordinates: location.coords,
			mainImage: `https://images.unsplash.com/photo-${mainImageId}?w=400&h=300&fit=crop&crop=face`,
			gallery: galleryImages,
		})
	}
	
	return additionalDogs
}

// Kombiniere die statischen und generierten Hunde
export const allDogs = [...dogs, ...generateAdditionalDogs()]
