import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"


@Component({
  template:`<div data-jtk-target="true">
    {{obj['name']}}
    <div class="delete" title="Click to delete" (click)="this.removeNode()"></div>
    <div class="connect" data-jtk-source="true"></div>
  </div>`
})
export class NodeComponent extends BaseNodeComponent {

}
