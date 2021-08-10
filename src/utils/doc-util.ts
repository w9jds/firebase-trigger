import {
  ContentType,
  Doc,
  CollapseableList,
  Collapseable,
  DocContent,
  Quote,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Code,
  Youtube,
  Vimeo,
  PPT,
  Line,
  UnorderedListItem,
  UnorderedList,
  Image,
} from "../interface/interface";

let isCollapsable = false;
let isCollapsableList = false;
let collapseable = new Collapseable();
let collapseableList = new CollapseableList();
let currentContentType = ContentType.None;

let doc = new Doc();

export function getDoc(content: String): Doc {
  let contentType: ContentType = ContentType.None;
  doc = new Doc();

  initializeVars();
  processMdFiles(content);

  return doc;
}

function initializeVars() {
  isCollapsable = false;
  isCollapsableList = false;
}

function processMdFiles(content: String) {
  let lines = content.split("\n");
  let contentLines: Array<String> = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (VerifyAndProcessCollapsable(line)) continue;

    if (!verifyEndOfContent(line) && currentContentType != ContentType.None) {
      contentLines.push(line);
    } else {
      addContentToList(contentLines);
      contentLines = [];
      currentContentType = ContentType.None;
    }
  }
}

function addContentToList(content: Array<String>) {
  if (content! && content.length == 0) return;
  if (doc.contents == null) doc.contents = [];
  let innerContent: DocContent = null;

  if (currentContentType == ContentType.Quotes) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("> ", "") + "\n";
      });
    let quote = new Quote();
    quote.value = value;
    innerContent = quote;
  }
  if (currentContentType == ContentType.H1) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("# ", "") + "\n";
      });
    let h1 = new H1();
    h1.value = value;
    innerContent = h1;
  }
  if (currentContentType == ContentType.H2) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("## ", "") + "\n";
      });
    let h = new H2();
    h.value = value;
    innerContent = h;
  }
  if (currentContentType == ContentType.H3) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("### ", "") + "\n";
      });
    let h = new H3();
    h.value = value;
    innerContent = h;
  }

  if (currentContentType == ContentType.H4) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("#### ", "") + "\n";
      });
    let h = new H4();
    h.value = value;
    innerContent = h;
  }

  if (currentContentType == ContentType.H5) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("##### ", "") + "\n";
      });
    let h = new H5();
    h.value = value;
    innerContent = h;
  }

  if (currentContentType == ContentType.H6) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line.replace("###### ", "") + "\n";
      });
    let h = new H6();
    h.value = value;
    innerContent = h;
  }

  if (currentContentType == ContentType.Paragraph) {
    let value = "";
    content
      .toString()
      .split("\n")
      .forEach((line) => {
        value += line;
      });
    let h = new Paragraph();
    h.value = value;
    innerContent = h;
  }

  if (currentContentType == ContentType.Image) {
    let i = new Image();
    let data = content[0].replace("#image ", "").trim().split(" ");
    const imageName = data[0];
    const start = Number.parseInt(data[1]);
    const end = Number.parseInt(data[2]);
    for (let index = start; index <= end; index++) {
      i.images.push(imageName + index);
    }
    innerContent = i;
  }

  if (currentContentType == ContentType.Code) {
    let code = new Code();
    code.value = content[0].replace("#code ", "").trim();
    innerContent = code;
  }

  if (currentContentType == ContentType.Youtube) {
    let y = new Youtube();
    y.value = content[0].replace("#youtube ", "").trim();
    innerContent = y;
  }

  if (currentContentType == ContentType.Vimeo) {
    let v = new Vimeo();
    v.value = content[0].replace("#vimeo ", "").trim();
    innerContent = v;
  }

  if (currentContentType == ContentType.Slide) {
    let ppt = new PPT();
    ppt.link = content[0].replace("#ppt ", "").trim();
    innerContent = ppt;
  }

  if (currentContentType == ContentType.Line) {
    let line = new Line();
    line.count = 1;
    innerContent = line;
  }

  // if (currentContentType == ContentType.Table) {
  //     Table table = new Table(new Hashtable<>());
  //     table.getRows().put("Header", new ArrayList<String>(
  //             Arrays.asList(content.get(1).split("\\|"))));
  //     for (int i = 3; i < content.size(); i++) {
  //         table.getRows().put(i - 2 + "", new ArrayList<String>(
  //                 Arrays.asList(content.get(i).split("\\|"))));
  //     }
  //     innerContent = table;
  // }

  if (currentContentType == ContentType.Header) {
    for (let index = 0; index < content.length; index++) {
      const line = content[index];
      if (line.startsWith("Author: ")) {
        doc.author = line.replace("Author: ", "").trim();
      } else if (line.startsWith("Title: ")) {
        doc.title = line.replace("Title: ", "").trim();
      } else if (line.startsWith("Description: ")) {
        doc.description = line.replace("Description: ", "").trim();
      } else if (line.startsWith("Tags: [")) {
        let tags = line
          .replace("Tags: [", "")
          .replace("]", "")
          .trim()
          .split(",");
        tags.forEach((tag) => {
          doc.tags.push(tag);
        });
      }
    }
  }

  if (currentContentType == ContentType.UnorderedList) {
    let unorderedListItems: Array<UnorderedListItem> = [];
    for (let index = 0; index < content.length; index++) {
      const line = content[index];
      let uli = new UnorderedListItem();
      uli.indent = line.indexOf("-") / 4;
      uli.value = line.trim().replace("- ", "");
      unorderedListItems.push(uli);
    }
    let ul = new UnorderedList();
    ul.items = unorderedListItems;
    innerContent = ul;
  }

  if (innerContent != null) {
    if (!skipContents(content)) {
      if (isCollapsable) {
        if (collapseable.items == null) {
          collapseable.items = [];
        }
        innerContent.type = ContentType[currentContentType];
        collapseable.items.push(innerContent);
      } else {
        innerContent.type = ContentType[currentContentType];
        doc.contents.push(innerContent);
      }
    }
  }
}

function skipContents(content: Array<String>): boolean {
  if (
    content.length > 0 &&
    (content[0].startsWith("#CollapsableListStart") ||
      content[0].startsWith("#CollapsableListEnd"))
  )
    return true;
  return false;
}

function verifyEndOfContent(line: String): boolean {
  if (currentContentType == ContentType.None) {
    currentContentType = setContentType(line);
  }
  if (
    (currentContentType == ContentType.H1 ||
      currentContentType == ContentType.H2 ||
      currentContentType == ContentType.H3 ||
      currentContentType == ContentType.H4 ||
      currentContentType == ContentType.Quotes ||
      currentContentType == ContentType.Image ||
      currentContentType == ContentType.UnorderedList ||
      currentContentType == ContentType.Youtube ||
      currentContentType == ContentType.Slide ||
      currentContentType == ContentType.Vimeo ||
      currentContentType == ContentType.Table ||
      currentContentType == ContentType.Code ||
      currentContentType == ContentType.Line ||
      currentContentType == ContentType.Paragraph) &&
    line.trim().length == 0
  )
    return true;
  if (currentContentType == ContentType.Header && line.trim() == "---")
    return true;
  return false;
}

function setContentType(line: String): ContentType {
  if (line.startsWith("# ")) return ContentType.H1;
  if (line.startsWith("## ")) return ContentType.H2;
  if (line.startsWith("### ")) return ContentType.H3;
  if (line.startsWith("#### ")) return ContentType.H4;
  if (line.startsWith("> ")) return ContentType.Quotes;
  if (line.startsWith("#image ")) return ContentType.Image;
  if (line.startsWith("- ")) return ContentType.UnorderedList;
  if (line.startsWith("#youtube ")) return ContentType.Youtube;
  if (line.startsWith("#ppt ")) return ContentType.Slide;
  if (line.startsWith("#vimeo ")) return ContentType.Vimeo;
  if (line.startsWith("#table")) return ContentType.Table;
  if (line.startsWith("#code ")) return ContentType.Code;
  if (line.startsWith("--")) return ContentType.Header;
  if (line.startsWith("***")) return ContentType.Line;
  if (line.trim().length == 0) return ContentType.None;
  return ContentType.Paragraph;
}

function VerifyAndProcessCollapsable(line: String): boolean {
  if (line.startsWith("#CollapsableListStart")) {
    isCollapsableList = true;
    collapseableList = new CollapseableList();
    collapseableList.type = ContentType[ContentType.Collapseable];
  }
  if (line.startsWith("#CollapsableListEnd")) {
    isCollapsableList = false;
    doc.contents.push(collapseableList);
  }

  if (line.startsWith("#CollapsableStart")) {
    isCollapsable = true;
    collapseable.title = line.replace("#CollapsableStart ", "").trim();
    return true;
  }
  if (line.startsWith("#CollapsableEnd")) {
    isCollapsable = false;
    collapseableList.contents.push(collapseable);
    collapseable = new Collapseable();
    return true;
  }
  return false;
}
