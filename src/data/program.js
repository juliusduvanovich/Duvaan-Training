export const defaultProgram = [
  {
    day: 0,
    name: 'Maanantai',
    focus: 'Chest · Shoulder · Tricep',
    exercises: [
      { id: 'mon1', name: 'Pushups', sets: 3, reps: '20', weight: null },
      { id: 'mon2', name: 'OH Pushups', sets: 3, reps: '10', weight: null },
      { id: 'mon3', name: 'Dips', sets: 3, reps: '10', weight: null },
      { id: 'mon4', name: 'Arnold Press', sets: 3, reps: '10', weight: '9.5 kg' },
      { id: 'mon5', name: 'Lateral Raise', sets: 3, reps: '10', weight: '7 kg' },
      { id: 'mon6', name: 'Tricep Talja', sets: 3, reps: '10', weight: '15 kg' },
      { id: 'mon7', name: 'Tricep Paino', sets: 3, reps: '10', weight: '9.5 kg' },
    ]
  },
  {
    day: 1,
    name: 'Tiistai',
    focus: 'Back · Biceps · Arms',
    exercises: [
      { id: 'tue1', name: 'Pullup', sets: 3, reps: '5', weight: null },
      { id: 'tue2', name: 'Barbell Row', sets: 3, reps: '8', weight: '50 kg' },
      { id: 'tue3', name: 'Dumbbell Row', sets: 3, reps: '12', weight: '20 kg' },
      { id: 'tue4', name: 'Sivutaivutus', sets: 3, reps: '10', weight: '20 kg' },
      { id: 'tue5', name: 'Hyperextension', sets: 3, reps: '12', weight: '15 kg' },
      { id: 'tue6', name: 'Superman', sets: 3, reps: '12', weight: null },
      { id: 'tue7', name: 'Bicep Curl', sets: 3, reps: '8', weight: '12 kg' },
      { id: 'tue8', name: 'Hammer Curl', sets: 3, reps: '8', weight: '12 kg' },
      { id: 'tue9', name: 'Wrist Curl', sets: 3, reps: '20', weight: '7 kg' },
    ]
  },
  {
    day: 2,
    name: 'Keskiviikko',
    focus: 'Legs',
    exercises: [
      { id: 'wed1', name: 'Kyykkyhypyt', sets: 3, reps: '20', weight: null },
      { id: 'wed2', name: 'Kyykyt', sets: 3, reps: '8', weight: '50 kg' },
      { id: 'wed3', name: 'Front Thigh', sets: 3, reps: '12', weight: '6a' },
      { id: 'wed4', name: 'Back Thigh', sets: 3, reps: '12', weight: '7y' },
      { id: 'wed5', name: 'One Calf Raise', sets: 3, reps: '12', weight: '40 kg' },
      { id: 'wed6', name: 'Glute Pump', sets: 3, reps: '15', weight: null },
      { id: 'wed7', name: 'Side Glutes', sets: 3, reps: '15', weight: null },
    ]
  },
  {
    day: 3,
    name: 'Torstai',
    focus: 'Core · Chest',
    exercises: [
      { id: 'thu1', name: 'Pushups', sets: 3, reps: '20', weight: null },
      { id: 'thu2', name: 'OH Pushups', sets: 3, reps: '10', weight: null },
      { id: 'thu3', name: 'Dips', sets: 3, reps: '10', weight: null },
      { id: 'thu4', name: 'Dragon Flag', sets: 3, reps: '12', weight: null },
      { id: 'thu5', name: 'Leg Raises', sets: 3, reps: '12', weight: null },
      { id: 'thu6', name: 'Dead Bug', sets: 3, reps: '12', weight: '15 kg' },
      { id: 'thu7', name: 'Oblique Crunch', sets: 3, reps: '20', weight: null },
      { id: 'thu8', name: 'Side Plank Dip', sets: 3, reps: '20', weight: null },
      { id: 'thu9', name: 'Plank', sets: 1, reps: '1.5 min', weight: null },
      { id: 'thu10', name: 'Plank (3. round)', sets: 1, reps: '2 min', weight: null },
    ]
  },
  {
    day: 4,
    name: 'Perjantai',
    focus: 'Cardio',
    exercises: [
      { id: 'fri1', name: '10km lenkki', sets: 1, reps: '10 km', weight: null },
    ]
  },
  {
    day: 5,
    name: 'Lauantai',
    focus: 'Core · HIIT',
    exercises: [
      { id: 'sat1', name: 'Dragon Flag', sets: 3, reps: '12', weight: null },
      { id: 'sat2', name: 'Leg Raises', sets: 3, reps: '12', weight: null },
      { id: 'sat3', name: 'Dead Bug', sets: 3, reps: '12', weight: '15 kg' },
      { id: 'sat4', name: 'Oblique Crunch', sets: 3, reps: '20', weight: null },
      { id: 'sat5', name: 'Side Plank Dip', sets: 3, reps: '20', weight: null },
      { id: 'sat6', name: 'Plank', sets: 1, reps: '1.5 min', weight: null },
      { id: 'sat7', name: 'Plank (3. round)', sets: 1, reps: '2 min', weight: null },
      { id: 'sat8', name: 'Lämmittely juoksu', sets: 1, reps: '10 min', weight: null },
      { id: 'sat9', name: 'Sprintti-intervallit', sets: 8, reps: '30s / 90s lepo', weight: null },
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