import * as fs from "fs";
import * as path from "path";
import { Doc, DocFile, DocFileSystem, DocFolder } from "../interface/interface";
import * as docUtil from "./doc-util";
import * as moment from "moment";

let timeFilePath = "/Users/vi40070509/Work/Docs/Time.txt";

export function getLastUpdatedTime(): number {
  return Number.parseInt(fs.readFileSync(timeFilePath).toString());
}

export function setLastUpdatedTime() {
  // write current time in ms
  fs.writeFileSync(timeFilePath, moment(new Date()).valueOf().toString());
}

export function readAllMDFile(dir: string, time: number): Array<Doc> {
  let docs: Array<Doc> = [];
  readMDFile(docs, dir, time);
  return docs;
}

function readMDFile(docs: Array<Doc>, dir: string, time: number) {
  let files = fs.readdirSync(path.resolve(dir));

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    if (file.indexOf(".") < 0) {
      readMDFile(docs, dir + "/" + file, time);
    } else if (
      file.endsWith(".md") &&
      (fs.statSync(dir + "/" + file).mtimeMs > time ||
        fs.statSync(dir + "/" + file).ctimeMs > time)
    ) {
      // run this only for newly modified files
      let content = fs.readFileSync(dir + "/" + file);
      let d = docUtil.getDoc(content.toString());
      d.filename = file;
      docs.push(d);
    }
  }
}

export function updateFolderPath(
  dir: string,
  folder: DocFileSystem
): DocFileSystem {
  let files = fs.readdirSync(path.resolve(dir));

  files.forEach(async (file) => {
    if (file.indexOf(".") < 0) {
      (folder as DocFolder).items.push(
        updateFolderPath(dir + "/" + file, new DocFolder(file, "folder"))
      );
      console.log("test");
    } else if (file.endsWith(".md")) {
      let d = new DocFile(file.replace(".md",""), "description");
      (folder as DocFolder).items.push(d);
    }
  });
  return folder;
}

export function isFileUpdate(
  dir: string,
  time: number,
  isUpdated: boolean
): boolean {
  // break if isUpdated true
  if (isUpdated) return isUpdated;

  let files = fs.readdirSync(path.resolve(dir));
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    if (file.indexOf(".") < 0) {
      if (
        fs.statSync(dir + "/" + file).mtimeMs > time ||
        fs.statSync(dir + "/" + file).ctimeMs > time
      ) {
        isUpdated = true;
      }
      isUpdated = isFileUpdate(dir + "/" + file, time, isUpdated);
    } else if (
      file.endsWith(".md") &&
      fs.statSync(dir + "/" + file).mtimeMs > time
    ) {
      isUpdated = true;
    }
  }
  return isUpdated;
}
