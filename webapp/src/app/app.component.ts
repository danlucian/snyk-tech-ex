import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

interface Package {
  name: string;
  version: string;
};

class TreeViewNode {
  value: Package;
  children?: TreeViewNode[];

  constructor(value: Package, children: TreeViewNode[]) {
    this.value = value;
    this.children = children;
  }
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inputValue?: string;
  options: string[] = [];

  treeData: TreeViewNode[] = [];
  private transformer = (node: TreeViewNode, level: number) => ({
    expandable: !!node.children && node.children.length > 0,
    name: `${node.value?.name}-${node.value?.version}`,
    level
  });
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode) => node.expandable;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private httpClient: HttpClient) {}

  getNode(name: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.httpClient
    .get(`http://localhost:8085/search/suggestions?name=${value}`)
    .subscribe(
      success => {
        this.options = (<any>success).map((element: any) => element.package.name);
      }, 
      error => {
        console.error(error);
      }
    )
  }

  onSubmit(): void {
    this.blockUI.start('Loading dependencies...');
    this.httpClient
      .get(`http://localhost:8086/dependencies/${this.inputValue}`)
      .subscribe(
        success => {
          const nodes = new TreeViewNode((<any>success).value, (<any>success).children);
          this.dataSource.setData([nodes]);
          this.blockUI.stop();
          this.treeControl.expandAll();
        }, 
        error => {
          this.blockUI.stop();
          console.error(error);
        }
      )
  }
}

