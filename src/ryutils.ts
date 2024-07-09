import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

// 自前の言語設定の読み込み
import { i18n, COMMON_TEXTS } from "./i18n";










/**
 * パス文字列がパス区切り文字で終わっているか判定する。
 * @param testPath
 * @returns パス区切り文字で終わっていれば true
 */
export function endsWithPathSeparator(testPath: string): boolean
{
	const normalizedPath = path.normalize(testPath);
	return normalizedPath.endsWith(path.sep);
}










/**
 * パス文字列を各パスに分割する。
 * @param relativePath
 * @returns
 */
export function splitPath(relativePath: string): string[]
{
	// パスを正規化して、余計な '..' などを解決
	const normalizedPath = path.normalize(relativePath);

	// パス区切り文字で分割
	const parts = normalizedPath.split(path.sep);

	// 空要素を削除
	return parts.filter(part => part !== '');
}










/**
 * 文字列をクリップボードにコピーする。
 * @param text コピーする文字列。
 */
export function copyTextToClipboard(text: string): void
{
	vscode.env.clipboard.writeText(text);
}










/**
 * アクティブなエディターが表示されていれば true
 * @returns
 */
export function isActiveEditorVisible(): boolean
{
	const activeEditor = vscode.window.activeTextEditor;
	return Boolean(activeEditor && vscode.window.visibleTextEditors.includes(activeEditor));
}










/**
 * 文字列をアクティブなエディタに挿入する。
 * @param text
 */
export function insertTextToEdtior(text: string): void
{
	if (text && isActiveEditorVisible() && vscode.window.activeTextEditor)
	{
		vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(text));
	}
}










/**
 * 文字列をアクティブなターミナルに挿入する。
 * @param text 挿入する文字列。
 */
export function sendTextToTerminal(text: string)
{
	if (text && vscode.window.activeTerminal)
	{
		vscode.window.activeTerminal.sendText(`${text}`, false);
	}
}










/**
 * OSと言語に応じたエクスプローラーの名前を返す。
 * @returns OSに応じたエクスプローラーの名前。Windowsなら エクスプローラー(Explorer)、Macなら日英ともにFinder、LinuxならFileManager
 */
export function getOsDependentExplorerAppName(): string
{
	if (process.platform === 'win32')
	{
		// Windows
		return i18n(COMMON_TEXTS.windowsExplorer);
	}
	else if (process.platform === 'darwin')
	{
		// Mac
		return i18n(COMMON_TEXTS.macFinder);
	}
	else
	{
		// Linux
		return i18n(COMMON_TEXTS.linuxFileManager);
	}
}










/**
 * 指定されたファイルをエディタで開く。
 * @param fullPath 開くファイルのパス。
 */
export async function openFileInEdtor(fullPath: string)
{
	try
	{
		const document = await vscode.workspace.openTextDocument(fullPath);
		await vscode.window.showTextDocument(document);
	}
	catch (error)
	{
		vscode.window.showErrorMessage(i18n(COMMON_TEXTS.couldNotOpenFile) + `: ${error}`);
	}
}









/**
 * 指定されたパスのディレクトリをOSのファイルマネージャで開く。
 * @param path - 開きたいディレクトリのパス。
 */
export function openDirectory(path: string): void
{
	// OSに応じたコマンドを実行
	if (process.platform === 'darwin')
	{
		// Macの場合、Finderでディレクトリを開く
		exec(`open "${path}"`);
	}
	else if (process.platform === 'win32')
	{
		// Windowsの場合、Explorerでディレクトリを開く
		exec(`explorer "${path}"`);
	}
	else if (process.platform === 'linux')
	{
		// Linuxの場合、nautilusでディレクトリを開く（デフォルトのファイルマネージャを使用）
		exec(`nautilus "${path}"`);
	}
}










/**
 * ワークスペースのディレクトリを取得する
 * @returns {string} ワークスペースディレクトリのパス。ワークスペースが存在しない場合は空の文字列を返す。
 */
export function getWorkspaceDirectory(): string
{
	const folders = vscode.workspace.workspaceFolders;
	if (folders && folders.length > 0)
	{
		// 複数ある場合は最初のワークスペースフォルダを使用
		const workspacePath = folders[0].uri.fsPath;
		return workspacePath;
	}
	else
	{
		// ワークスペースのディレクトリが見つからなかった
		return '';
	}
}










/**
 * アクティブなエディターで編集しているファイルのパスを取得する。
 * アクティブなエディターが存在しない場合やファイルが見付からない場合は undefined を返す。
 * @returns ディレクトリパス。アクティブなエディターがない場合やファイルが見付からない場合は undefined 。
 */
export function getActiveEditorDirectory(): string | undefined
{
	const editor = vscode.window.activeTextEditor;
	if (editor)
	{
		const filePath = editor.document.uri.fsPath;

		// ファイルが実際に存在するか確認
		if (fs.existsSync(filePath))
		{
			return path.dirname(filePath);
		}
		else
		{
			// ファイルが見つからない場合
			return undefined;
		}
	}
	else
	{
		// アクティブエディターが見つからなかった
		return undefined;
	}
}










/**
 * 拡張したQuickPickItemのボタン。
 * @property id ボタンの識別子として使う文字列。
 */
export interface IRyQuickPickButton extends vscode.QuickInputButton
{
	id: string;
}










/**
 * さらにボタンクリック時の処理を書けるようにしたボタンクラス。
 * 便宜上IDを持ってるけど使ってない。
 * 2024/07/07
 */
export class RyQPItemButton implements IRyQuickPickButton
{
	private readonly _ownerItem: vscode.QuickPickItem;
	id: string;
	iconPath: vscode.Uri | vscode.ThemeIcon | {dark: vscode.Uri, light: vscode.Uri};
	tooltip?: string;

	constructor(aOwner: vscode.QuickPickItem, aIcon: vscode.ThemeIcon, aTooltip: string = '')
	{
		this._ownerItem = aOwner;
		this.id = '';
		this.iconPath = aIcon;
		this.tooltip = aTooltip;
	}

	public onClick(): void
	{
	}

	public get ownerItem(): vscode.QuickPickItem
	{
		return this._ownerItem;
	}
}




















/**
 * エラーを `vscode.window.showErrorMessage` で表示し、ユーザーの要求に応じて詳細を表示する。
 * @param errorMessage `vscode.window.showErrorMessage` で表示するエラーメッセージ。
 * @param extensionName 詳細を表示する時に出力チャンネルを識別するための拡張機能の名前。 `createOutputChannel` で使用する。
 * @param debugErrorMessage 出力チャンネルに最初に表示するエラーメッセージ。
 * @param error 出力チャンネルに表示する Error オブジェクト、またはcatchしたものをそのまま渡せるように unknow にも対応。
 */
export function showErrorMessageWithDetailChannel(errorMessage: string, extensionName: string, debugErrorMessage: string, error: Error | unknown)
{
	vscode.window.showErrorMessage(errorMessage, i18n(COMMON_TEXTS.showErrorDetailButtonCaption)).then(() =>
	{
		// エラー詳細を Output Channel に表示
		const channel = vscode.window.createOutputChannel(extensionName);
		if (error instanceof Error)
		{
			channel.appendLine(debugErrorMessage);
			channel.appendLine(`Error Message: ${error.message}`);
			channel.appendLine(`Stack Trace: ${error.stack}`);
		}
		else
		{
			channel.appendLine(debugErrorMessage);
			channel.appendLine(`Type: ${typeof error}`);
			channel.appendLine(`Value: ${error}`);
		}
		channel.show();
	});
}