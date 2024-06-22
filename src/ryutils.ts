import * as vscode from 'vscode';
import * as path from 'path';
import { rmSync } from 'fs';
import { exec } from 'child_process';










/**
 * 文字列をクリップボードにコピーする。
 * @param text コピーする文字列。
 */
export function copyTextToClipboard(text: string): void
{
	vscode.env.clipboard.writeText(text);
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
 * アクティブなエディターで編集しているファイルのパスを取得する。
 * アクティブなエディターが存在しない場合は空文字列を返す。
 * @returns ディレクトリパス。アクティブなエディターがない場合は空文字列。
 */
export function getActiveEditorDirectory(): string
{
	const editor = vscode.window.activeTextEditor;
	if (editor)
	{
		const filePath = editor.document.uri.fsPath;
		return path.dirname(filePath);
	}
	else
	{
		// アクティブエディターが見つからなかった
		return '';
	}
}










/**
 * 拡張したQuickPickItemのボタン。
 * @property id ボタンの識別子として使う文字列。
 */
export interface RyQuickPickButton extends vscode.QuickInputButton
{
	id: string;
}
