class TreeNode<T> {
  constructor(
    private readonly _value: T,
    private readonly _children: TreeNode<T>[] = []
  ) {}

  get children () {
    return this._children;
  }

  get value () {
    return this._value;
  }

  append(value: T): TreeNode<T> {
    const node = new TreeNode(value);
    this._children.push(node);
    return node;
  }

  hasChild (): boolean {
    return this._children.length !== 0;
  }

  addChild(node: TreeNode<T>): void {
    this._children.push(node);
  }
}

// Define a Tree class to manage the overall structure
export class Tree<T> {
  root: TreeNode<T>;

  constructor(rootValue: T) {
    this.root = new TreeNode(rootValue);
  }

  append (nodeValue: T) {
    const node = new TreeNode(nodeValue);
    this.root.append(nodeValue);
    return node;
  }
}
