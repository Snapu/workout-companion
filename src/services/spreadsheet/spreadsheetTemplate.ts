const appName = `FitnessApp-${new Date().getFullYear()}`;

export const sheets = [
  {
    title: "Exercises",
    values: [
      ["name", "category"],
      ["Beinheben", "Bauch"],
      ["Kurzhantel Rudern einarmig", "Rücken"],
      ["Kurzhantel Schrägbankdrücken", "Brust"],
      ["Kurzhantel Schulterheben stehend", "Schultern"],
      ["Kurzhantel Seitheben", "Schultern"],
      ["Langhantel Kniebeuge im Ausfallschritt", "Beine"],
      ["Latzug zur Brust", "Lat"],
      ["Seilzug Rudern zum Hals", "Rücken"],
      ["Seilzug Rudern eng", "Rücken"],
      ["Langhantel Kreuzheben", "Beine"],
      ["Klimmzüge", "Lat"],
      ["Langhantel Kniebeugen", "Beine"],
      ["Langhantel Bankdrücken", "Brust"],
      ["Langhantel rudern vorgebeugt", "Rücken"],
      ["Maschine Schulterdrücken", "Schultern"],
      ["Maschine Überzüge", "Lat"],
      ["Bauchtrainer", "Bauch"],
      ["TRX Seitstütz mit Einrollen", "Bauch"],
      ["Klimmzüge eng im Untergriff", "Bizeps"],
      ["Kurzhantel Seitheben", "Schultern"],
      ["Kurzhantel Frontheben", "Schultern"],
      ["Kurzhantel Bizeps-Curls einarmig eingedreht", "Bizeps"],
      ["Maschine Rotator", "Bauch"],
      ["Kettlebell Swings", "Beine"],
      ["Seilzug Butterfly sitzend", "Brust"],
      ["Kurzhantel Schulterdrücken sitzend", "Schultern"],
      ["Seilzug Trizepsdrücken", "Trizeps"],
      ["Theraband Schulter Außenrotation", "Schultern"],
      ["TRX Unteramstütz Crunches", "Bauch"]
    ]
  },
  {
    title: "Sets",
    values: [["date", "exercise", "set", "reps", "weight"]]
  }
];

export default {
  properties: { title: appName, locale: "en" },
  sheets: sheets.map((sheet, i) => ({
    properties: {
      sheetId: i,
      index: i,
      title: sheet.title,
      sheetType: "GRID",
      gridProperties: {
        rowCount: 1000,
        columnCount: 26
      }
    }
  }))
};
