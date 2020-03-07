import exercisesDe from "./exercisesDe";
const appName = `WorkoutCompanion-${new Date().getFullYear()}`;

export const sheets = [
  {
    title: "Exercises",
    values: [["name", "alias", "categories", "source"], ...exercisesDe]
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
