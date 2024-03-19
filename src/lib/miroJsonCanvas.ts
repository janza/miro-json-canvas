interface GenericNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: CanvasColor;
}

declare enum CanvasColor {
  RED = 1,
  ORANGE = 2,
  YELLOW = 3,
  GREEN = 4,
  CYAN = 5,
  PURPLE = 6,
}

interface TextNode extends GenericNode {
  type: "text";
  text: string;
}
interface LinkNode extends GenericNode {
  type: "link";
  url: string;
}

interface LinkNode extends GenericNode {
  type: "link";
  url: string;
}

interface GroupNode extends GenericNode {
  type: "group";
  label: string;
}

interface FileNode extends GenericNode {
  type: "file";
  file: string;
}

type EdgeSide = "top" | "right" | "bottom" | "left";
type EdgeEnd = "none" | "arrow";
interface Edge {
  id: string;
  fromNode: string;
  fromSide?: EdgeSide;
  fromEnd?: EdgeEnd;
  toNode: string;
  toSide?: EdgeSide;
  toEnd?: EdgeEnd;
  color?: CanvasColor;
  label?: string;
}

type Node = GenericNode & (TextNode | LinkNode | GroupNode | FileNode);

export interface JSONCanvas {
  nodes: Node[];
  edges: Edge[];
}

export async function canvasToMiro(canvas: JSONCanvas) {
  const idMap: Record<string, string> = {};
  await Promise.all(
    canvas.nodes.map(async (node) => {
      let promise: Promise<{ id: string }>;
      if (node.type === "text" || node.type === "file") {
        promise = miro.board.createShape({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          content: node.type === "text" ? node.text : node.file,
        });
      } else if (node.type === "link") {
        promise = miro.board.createEmbed({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          url: node.url,
        });
      } else if (node.type === "group") {
        promise = miro.board.createFrame({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          title: node.label,
        });
      } else {
        console.error("unknown node", node);
        return;
      }

      const { id } = await promise;

      idMap[node.id] = id;
    })
  );

  canvas.edges.forEach((edge) => {
    miro.board.createConnector({
      start: {
        item: idMap[edge.fromNode],
        snapTo: edge.fromSide,
      },
      captions: edge.label
        ? [
            {
              content: edge.label,
              position: 0.5
            },
          ]
        : [],
      end: {
        item: idMap[edge.toNode],
        snapTo: edge.toSide,
      },
    });
  });
}
