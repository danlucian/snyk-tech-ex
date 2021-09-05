import Package from "./Package";

export default class TreeNode {
  childs: Array<TreeNode>;
  value?: Package;

  constructor(value?: Package, childs: Array<TreeNode> = []) {
    this.value = value;
    this.childs = childs;
  }
}
