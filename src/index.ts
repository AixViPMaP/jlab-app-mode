import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  Widget
} from '@phosphor/widgets';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
   NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import {
  Notebook
} from '@jupyterlab/notebook';

const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'aixvipmap-appmode',
  autoStart: true
};

export
class AutorunExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    context.session.kernelChanged.connect((sender, args) => {
      if(context.model.metadata.get('aixvipmap_appmode') == true) {
        NotebookActions.hideAllCode(panel.content);
        NotebookActions.runAll(panel.content, context.session);
      }
    });
    return new DisposableDelegate(() => {});
  }
}

export
class AppmodeExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let checkbox = new Checkbox(panel.content);
    panel.toolbar.insertItem(9, 'AppMode', checkbox);
    context.model.metadata.changed.connect((sender, args) => {
      checkbox.toggle(context.model.metadata.get('aixvipmap_appmode') == true);
    });
    return new DisposableDelegate(() => {});
  }
}

class Checkbox extends Widget {
  private _notebook: Notebook = null;

  constructor(widget: Notebook) {
    super({ node: createCheckboxNode(widget) });
    this._notebook = widget;
    this.addClass("jp-Toolbar-item");
    this.node.addEventListener('input', this);
  };

  toggle(b: boolean) : void {
    if(b) {
      this.node.firstElementChild.setAttribute('checked', 'true');
    } else {
      this.node.firstElementChild.removeAttribute('checked');
    }
  }

  handleEvent(event: Event): void {
    switch(event.type) {
      case 'input':
        this._evtChange();
    }
  }

  private _evtChange(): void {
    let metadata = this._notebook.model.metadata;
    metadata.set('aixvipmap_appmode', metadata.get('aixvipmap_appmode') == false);
  }
}

function createCheckboxNode(widget: Notebook): HTMLElement {
  let div = document.createElement('div');
  div.setAttribute('title', 'Enable app mode to automatically run this notebook on startup and hide all code cells');
  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  let label = document.createElement('span');
  label.innerHTML+= "App mode";
  div.appendChild(input);
  div.appendChild(label);
  return div;
}

function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new AutorunExtension());
  app.docRegistry.addWidgetExtension('Notebook', new AppmodeExtension());
};

export default plugin;
