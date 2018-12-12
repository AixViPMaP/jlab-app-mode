import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
   NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';


const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'jlab-hide-code:buttonPlugin',
  autoStart: true
};

export
class AutorunExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

    context.session.kernelChanged.connect((sender, args) => {
      NotebookActions.hideAllCode(panel.content);
      if(context.model.metadata.get('aixvipmap_appmode') == true){
          NotebookActions.runAll(panel.content, context.session);
      }
    });

    return new DisposableDelegate(() => {
    });
  }
}

function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new AutorunExtension());
};

export default plugin;
