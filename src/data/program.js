export const defaultProgram = [
  {
    day: 0,
    name: 'Maanantai',
    focus: 'Push — Chest · Shoulder · Tricep',
    exercises: [
      { id: 'mon1', name: 'Kädet yhdessä punnerrukset', sets: 3, reps: '20', weight: null },
      { id: 'mon2', name: 'Sivulta toiselle punnerrukset', sets: 3, reps: '10', weight: null },
      { id: 'mon3', name: 'Dipit', sets: 3, reps: '10', weight: null },
      { id: 'mon4', name: 'Arnold press', sets: 3, reps: '10', weight: '9.5 kg' },
      { id: 'mon5', name: 'Lateral raise', sets: 3, reps: '12', weight: '7 kg' },
      { id: 'mon6', name: 'Yhden käden ojentaja taljat', sets: 3, reps: '10', weight: '15 kg' },
      { id: 'mon7', name: 'Yhden käden tricep nosto', sets: 3, reps: '10', weight: '9.5 kg' },
    ]
  },
  {
    day: 1,
    name: 'Tiistai',
    focus: 'Pull — Back · Biceps',
    exercises: [
      { id: 'tue1', name: 'Leuanveto leveä ote', sets: 4, reps: '6–8', weight: null },
      { id: 'tue2', name: 'Seated cable row', sets: 3, reps: '8–10', weight: null },
      { id: 'tue3', name: 'Lat pulldown kapea', sets: 3, reps: '10–12', weight: null },
      { id: 'tue4', name: 'Face pull', sets: 3, reps: '15', weight: '40 kg' },
      { id: 'tue5', name: 'Reverse flys istualtaan', sets: 3, reps: '10', weight: '7 kg' },
      { id: 'tue6', name: 'Dumbbell curl', sets: 3, reps: '10–12', weight: null },
    ]
  },
  {
    day: 2,
    name: 'Keskiviikko',
    focus: 'Cardio · Calves',
    exercises: [
      { id: 'wed1', name: 'Sprintti-intervallit', sets: 8, reps: '30s / 90s lepo', weight: null },
      { id: 'wed2', name: 'Pohkeet painoilla', sets: 3, reps: '20', weight: null },
      { id: 'wed3', name: 'Hyppynaru / kevyt juoksu', sets: 1, reps: '15 min', weight: null },
    ]
  },
  {
    day: 3,
    name: 'Torstai',
    focus: 'Legs',
    exercises: [
      { id: 'thu1', name: 'Hyppykyykyt', sets: 3, reps: '20', weight: null },
      { id: 'thu2', name: 'Kyykyt painoilla', sets: 3, reps: '6', weight: null },
      { id: 'thu3', name: 'Yläreisi', sets: 3, reps: '13', weight: null },
      { id: 'thu4', name: 'Alareisi', sets: 3, reps: '13', weight: null },
      { id: 'thu5', name: 'Pohkeet painoilla', sets: 3, reps: '20', weight: null },
      { id: 'thu6', name: 'Perse pumppi', sets: 3, reps: '20', weight: null },
    ]
  },
  {
    day: 4,
    name: 'Perjantai',
    focus: 'Push · Core · Shoulder',
    exercises: [
      { id: 'fri1', name: 'Kädet yhdessä punnerrukset', sets: 3, reps: '20', weight: null },
      { id: 'fri2', name: 'Dipit', sets: 3, reps: '10', weight: null },
      { id: 'fri3', name: 'Arnold press', sets: 3, reps: '10', weight: '9.5 kg' },
      { id: 'fri4', name: 'Lateral raise', sets: 3, reps: '12', weight: '7 kg' },
      { id: 'fri5', name: 'Ab wheel', sets: 3, reps: 'max', weight: null },
      { id: 'fri6', name: 'Plank', sets: 3, reps: '60s', weight: null },
    ]
  },
  {
    day: 5,
    name: 'Lauantai',
    focus: 'HIIT',
    exercises: [
      { id: 'sat1', name: 'Sprintti-intervallit', sets: 8, reps: '30s / 90s lepo', weight: null },
      { id: 'sat2', name: 'Burpee circuit', sets: 3, reps: '10', weight: null },
      { id: 'sat3', name: 'Hyppykyykky circuit', sets: 3, reps: '10', weight: null },
      { id: 'sat4', name: 'Kevyt juoksu', sets: 1, reps: '10–15 min', weight: null },
    ]
  },
  {
    day: 6,
    name: 'Sunnuntai',
    focus: 'Rest',
    exercises: [],
    rest: true
  },
]