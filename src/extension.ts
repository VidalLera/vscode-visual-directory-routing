// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Tree } from './utils/tree';
import { getProjectMetadata } from './project-metadata';

const EXTENSION_NAME = 'visual-directory-routing';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(`${EXTENSION_NAME}.displayTree`, async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.createWebviewPanel('', '', { viewColumn: vscode.ViewColumn })
		const { pageAndLayoutMatcher, basePathMatcher } = getProjectMetadata();
		const pagesAndLayoutsPath = await getRoutingPath({ pageAndLayoutMatcher, basePathMatcher });
		const pagesAndLayoutsTree = generateTreeFromPaths(pagesAndLayoutsPath);
		console.log(pagesAndLayoutsTree);
	});

	const asdf = vscode.commands.registerCommand(`${EXTENSION_NAME}.searchByRoute`, () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const inputBox = vscode.window.createInputBox();
		// vscode.window.showWorkspaceFolderPick()
		inputBox.show();
		inputBox.onDidChangeValue((val) => console.log(val));
		// vscode.window.createWebviewPanel('', '', { viewColumn: vscode.ViewColumn })

		vscode.commands.executeCommand("");
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

interface PathInfo {
	fsPath: string,
	relativePath: string 	
}

interface FileMatcher {
	pageAndLayoutMatcher: string,
	basePathMatcher: RegExp
}

async function getRoutingPath ({ pageAndLayoutMatcher, basePathMatcher }: FileMatcher): Promise<PathInfo[]> {
	const EXCLUDE = '**/node_modules/**';
	const pagesAndLayoutsFiles = await vscode.workspace.findFiles(pageAndLayoutMatcher, EXCLUDE);
	console.log({ pagesAndLayoutsFiles });
	const pagesAndLayouts = pagesAndLayoutsFiles.map(({ path, fsPath }) => ({
		fsPath,
		relativePath: excludeBasePath(path, basePathMatcher)
	}));
	return pagesAndLayouts;
}


function excludeBasePath (path: string, matcher: RegExp) {
	const match = path.split(matcher);
	// if (match === null) { throw new Error("couldn't match base path"); };
	const [,relativePath] = match;
	console.log({ relativePath });
	return relativePath;
}

// Function to generate the tree from an array of file paths
function generateTreeFromPaths(paths: PathInfo[]): Tree<string> {
  const tree = new Tree<string>("/");

  for (const { fsPath, relativePath } of paths) {
    const segments = relativePath.split("/");
    let currentNode = tree.root;

		const fileName = segments.at(-1);

    for (const segment of segments) {
      const existingChild = currentNode.children.find((node) => node.value === segment);
      if (existingChild) {
        currentNode = existingChild;
      } else {
        const newNode = currentNode.append(segment);
        currentNode = newNode;
      }
    }
  }
  return tree;
}
