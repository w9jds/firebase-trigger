export class DocContent {
  type: String;
}

export enum ContentType {
  None,
  Header,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Quotes,
  Image,
  UnorderedList,
  OrderedList,
  Table,
  Code,
  Youtube,
  Vimeo,
  Line,
  Slide,
  Collapseable,
}

export class Doc {
  filename: string;
  author: String;
  title: String;
  description: String;
  parent: String;
  breadCrumbPath: Array<String> = [];
  tags: Array<String> = [];
  contents: Array<DocContent> = [];
}

export class DocFileSystem {
  constructor(public label: String, public icon: String) {}
}

export class DocFile extends DocFileSystem {}
export class DocFolder extends DocFileSystem {
  items: Array<DocFileSystem> = [];
}

export class H1 extends DocContent {
  value: String;
}
export class H2 extends DocContent {
  value: String;
}
export class H3 extends DocContent {
  value: String;
}
export class H4 extends DocContent {
  value: String;
}
export class H5 extends DocContent {
  value: String;
}
export class H6 extends DocContent {
  value: String;
}

export class Image extends DocContent {
  images: Array<String> = [];
}

export class Line extends DocContent {
  count: number;
}

export class Paragraph extends DocContent {
  value: String;
}
export class PPT extends DocContent {
  link: String;
}
export class Quote extends DocContent {
  value: String;
}

export class TableRow {
  name: String;
  values: Array<String>[];
}

export class Table extends DocContent {
  rows: Array<TableRow>[];
}

export class Code extends DocContent {
  value: String;
}
export class Vimeo extends DocContent {
  value: String;
}
export class Youtube extends DocContent {
  value: String;
}
export class UnorderedListItem {
  indent: number;
  value: String;
}

export class UnorderedList extends DocContent {
  items: Array<UnorderedListItem> = [];
}

export class Collapseable {
  title: String;
  items: Array<DocContent> = [];
}

export class CollapseableList extends DocContent {
  contents: Array<Collapseable> = [];
}
