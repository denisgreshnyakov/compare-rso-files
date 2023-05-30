const XLSX = require("xlsx");
const fs = require("fs");

const data = [];
const result = [];
const NNN = [];
const propList = [
  "NNN",
  "K_RAION",
  "POSTAV",
  "UPID",
  "LSHET",
  "E_LSHET",
  "ORG_RACH",
  "UOID",
  "LSHET_R",
  "POST_IND",
  "CITY",
  "SOCR_CITY",
  "STREET",
  "SOCR_STR",
  "DOM",
  "KORP",
  "KV",
  "KOMNATA",
  "KLADR_STR",
  "FIAS_CITY",
  "FIAS_STR",
  "FIAS_DOM",
  "GF",
  "OPS",
  "MOP",
  "ETAGN",
  "DOLYA",
  "PL_OBSH",
  "PL_OTAP",
  "KOL_MANS",
  "KOL_MANV",
  "YEAR_S",
  "MONTH_S",
  "VID_USL",
  "NAME_USL",
  "MEASURE",
  "NORM_USL",
  "KNORM_USL",
  "TARIF",
  "KOL_POTR",
  "NACHISL",
  "NACH_PVK",
  "KOPLATE",
  "OPLATA",
  "PERERASCH",
  "DOLG_SUM",
  "DOLG_MONTH",
  "SOGL_DOLG",
  "MKV",
  "GODPOSTR",
  "PRIBUCH",
  "Comment",
];

const compare = (filename) => {
  try {
    data.splice(0, data.length);
    result.splice(0, result.length);
    NNN.splice(0, NNN.length);

    filename.forEach((elem, i) => {
      console.log("Чтение " + i + " файла: " + elem);
      const workbook = XLSX.readFile(__dirname + "/uploads/" + elem);

      const workssheet = workbook.Sheets[workbook.SheetNames[0]];

      const workssheetJSON = XLSX.utils.sheet_to_json(workssheet);
      const workssheetHeaders = XLSX.utils.sheet_to_json(workssheet, {
        header: 1,
        blankrows: true,
      });

      console.log("Выполняется проверка наличия всех столбцов");
      for (prop of propList) {
        if (!workssheetHeaders[0].includes(prop)) {
          if (workssheetHeaders[0].includes("COMMENT") && prop === "Comment") {
            continue;
          }
          console.log(workssheetHeaders[0]);
          console.log(workssheetHeaders[0].length);
          console.log(`Отсутствует столбец ${prop} в файле ${elem}`);
          const err = new Error(`Отсутствует столбец ${prop} в файле ${elem}`);
          throw err;
        }
      }
      console.log("Все столбцы найдены");

      data.push(workssheetJSON);

      fs.unlink(__dirname + "/uploads/" + elem, (err) => {
        if (err) throw err;
        console.log("Файл " + elem + " был удален из временной директории");
      });
    });

    console.log("Запуск сравнения");

    for (let j = 0; j < data[1].length; j++) {
      // console.log(typeof data[1][j].NNN);
      // console.log(data[1][j].NNN);
      NNN.push(Number(data[1][j].NNN));
    }

    for (let i = 0; i < data[0].length; i++) {
      if (!NNN.includes(Number(data[0][i].NNN))) {
        result.push(data[0][i]);
      }
    }

    const workSheet = XLSX.utils.json_to_sheet(result);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Отсутствуют ответы");
    XLSX.writeFile(workBook, __dirname + "/uploads/result.xlsx");

    console.log("Сравнение завершено");

    return result;
  } catch (e) {
    filename.forEach((elem, i) => {
      if (fs.existsSync(`${__dirname}/uploads/${elem}`)) {
        fs.unlink(__dirname + "/uploads/" + elem, (err) => {
          if (err) throw err;
          console.log("Файл " + elem + " был удален из временной директории");
        });
      }
    });
    return {
      error: e,
    };
  }
};

module.exports = compare;
