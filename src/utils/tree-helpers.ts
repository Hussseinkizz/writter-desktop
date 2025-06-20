import Fuse from 'fuse.js';
import { FileNode } from './build-tree';

export function flattenTree(
  nodes: FileNode[],
  parentPath: string | null = null
): (FileNode & { parentPath: string | null })[] {
  let result: (FileNode & { parentPath: string | null })[] = [];
  for (const node of nodes) {
    result.push({ ...node, parentPath });
    if (node.isDir && node.children?.length) {
      result = result.concat(flattenTree(node.children, node.path));
    }
  }
  return result;
}

/**
 * Filters a nested tree by name deeply using Fuse.js fuzzy search.
 * Returns filtered nested tree (only matching nodes + their ancestors).
 */
export function filterTreeDeep(
  nodes: FileNode[],
  searchTerm: string
): FileNode[] {
  if (!searchTerm.trim()) return nodes;

  // Flatten tree with parent info
  const flat = flattenTree(nodes);

  // Fuse search on names
  const fuse = new Fuse(flat, { keys: ['name'], threshold: 0.3 });

  const matchedItems = fuse.search(searchTerm).map((r) => r.item);

  // To keep track of matched node paths + ancestors
  const pathsToKeep = new Set<string>();

  // Add matched node and all ancestors to set
  const addWithAncestors = (node: FileNode & { parentPath: string | null }) => {
    pathsToKeep.add(node.path);
    if (node.parentPath) {
      const parentNode = flat.find((n) => n.path === node.parentPath);
      if (parentNode && !pathsToKeep.has(parentNode.path)) {
        addWithAncestors(parentNode);
      }
    }
  };

  matchedItems.forEach(addWithAncestors);

  // Rebuild tree only with nodes in pathsToKeep
  function rebuild(nodes: FileNode[]): FileNode[] {
    return nodes
      .filter((n) => pathsToKeep.has(n.path))
      .map((n) => ({
        ...n,
        children: n.isDir && n.children ? rebuild(n.children) : undefined,
      }));
  }

  return rebuild(nodes);
}

/**
 * Moves node with fromPath to be sibling or child of toPath.
 * Returns new reordered tree (immutable).
 *
 * @param tree - root tree array
 * @param fromPath - node path to move
 * @param toPath - target node path
 * @param asChild - if true, move as child of toPath, else as sibling after toPath
 */
export function reorderTree(
  tree: FileNode[],
  fromPath: string,
  toPath: string,
  asChild: boolean = false
): FileNode[] {
  // Find node to move and remove it from tree
  let movingNode: FileNode | null = null;

  function removeNode(nodes: FileNode[]): FileNode[] {
    return nodes
      .map((node) => {
        if (node.path === fromPath) {
          movingNode = node;
          return null;
        }
        if (node.isDir && node.children) {
          return {
            ...node,
            children: removeNode(node.children).filter(Boolean),
          };
        }
        return node;
      })
      .filter(Boolean) as FileNode[];
  }

  const treeWithoutNode = removeNode(tree);

  if (!movingNode) {
    // fromPath not found, return original tree
    return tree;
  }

  // Insert movingNode to new position
  function insertNode(nodes: FileNode[]): FileNode[] {
    return nodes.flatMap((node) => {
      if (node.path === toPath) {
        if (asChild) {
          if (!node.isDir) return [node]; // can't insert child into file
          const newChildren = node.children
            ? [...node.children, movingNode!]
            : [movingNode!];
          return [{ ...node, children: newChildren }];
        } else {
          // Insert as sibling after toPath node
          return [node, movingNode!];
        }
      }

      if (node.isDir && node.children) {
        return [{ ...node, children: insertNode(node.children) }];
      }

      return [node];
    });
  }

  const newTree = insertNode(treeWithoutNode);

  return newTree;
}
