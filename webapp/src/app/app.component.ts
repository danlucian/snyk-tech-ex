import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

interface Suggestion {
  name: string,
  version: string,
  description: string,
  searchScore: number,
  keywords: Array<string>,
  links: {
    [key:string]: string
  },
  author: {
    [key:string]: string
  },
  publisher: {
    [key:string]: string
  },
  maintainers: Array<{ username: string, email: string}>,
  date: Date
}
interface Package {
  name: string;
  version: string;
};

class TreeViewNode {
  value: Package;
  children: TreeViewNode[];

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
  @BlockUI() blockUI: NgBlockUI;

  inputValue?: string;
  depthLevel: number = 0;
  isFullDepth: boolean = false;
  
  selectedPackage: Suggestion;
  options: Array<Suggestion> = [];
  treeData: TreeViewNode[] = [];
  
  showPackageInfo = false;

  hasChild = (_: number, node: FlatNode) => node.expandable;
  transformer = (node: TreeViewNode, level: number) => ({
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

  constructor(private httpClient: HttpClient) {}

  getNode = (name: string) => {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }

  onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;

    this.httpClient
    .get(`http://localhost:8085/search/suggestions?name=${value}`)
    .subscribe(
      success => {
        this.options = (<any>success).map((element: any) => element.package);
        this.options.sort((a, b) => b.searchScore - a.searchScore);
      }, 
      error => {
        console.error(error);
      }
    )
  }

  onSubmit = () => {
    this.blockUI.start('Loading dependencies...');

    if (this.isFullDepth) {
      this.httpClient
      .get(`http://localhost:8086/dependencies?pckg=${this.inputValue}`)
      .subscribe(
        success => {
          this.handleDependenciesResponse(new TreeViewNode((<any>success).value, (<any>success).children));
        }, 
        error => {
          this.blockUI.stop();
          console.error(error);
        }
      )
    } else {
      this.httpClient
      .get(`http://localhost:8086/dependencies?pckg=${this.inputValue}&depth=${this.depthLevel}`)
      .subscribe(
        success => {
          this.handleDependenciesResponse(new TreeViewNode((<any>success).value, (<any>success).children));
        }, 
        error => {
          this.blockUI.stop();
          console.error(error);
        }
      )
    }
  }

  handleDependenciesResponse = (head: TreeViewNode) => {
    this.treeData = [head];
    this.dataSource.setData(this.treeData);

    this.selectedPackage = this.options.filter(element => element.name === this.inputValue)[0];
    this.blockUI.stop();

    this.showPackageInfo = true;
    this.treeControl.expandAll();
  }
}

