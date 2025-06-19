export const tree = [
  {
    name: "notes",
    type: "folder",
    path: "./notes",
    children: [
      {
        name: "default.md",
        type: "file",
      },
      {
        name: "sample.md",
        type: "file",
      },
    ],
  },
];

// tree.map((node) => {
//   console.log("node:", node);
//   if (node.type === "folder") {
//     console.log("node.children:", node.children);
//   }
// }
