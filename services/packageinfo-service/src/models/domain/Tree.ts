import Package from "./Package";

export default class TreeNode {
  children: Array<TreeNode>;
  value: Package;

  constructor(value: Package, children: Array<TreeNode> = []) {
    this.value = value;
    this.children = children;
  }
}
