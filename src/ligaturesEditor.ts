import * as vscode from 'vscode';

import * as ryutils from './ryutils';

// 自前の言語設定の読み込み
import i18n from "./i18n";
import i18nTexts from "./i18nTexts";









/**
 * font-feature-settings の各フラグに対応する QuickPickItem
 */
class LigaturesEditorItem implements vscode.QuickPickItem
{
	label: string;
	description: string;

	constructor(label: string, fontFeature: string)
	{
		this.label = label;
		this.description = fontFeature;
	}

	/**
	 * このアイテムが示す font-feature-settings の値。
	 */
	get feature(): string
	{
		return this.description;
	}
}










/**
 * リガチャ編集用の QuickPickItem のリストを作成する。
 * @returns
 */
function createLigaturesEditorItems(): vscode.QuickPickItem[]
{
	const CATEGORIES =
	[
		{ name: 'ligatures', items: ['liga', 'calt', 'dlig'] },
		{ name: 'letters', items: ['smcp', 'c2sc', 'swsh', 'salt'] },
		{ name: 'numbers', items: ['lnum', 'onum', 'pnum', 'tnum', 'frac', 'ordn'] },
		{ name: 'stylisticSets', items: [] }, // デザインセット用の特別な扱い
		{ name: 'widthVariants', items: ['pwid', 'palt', 'pkna', 'fwid', 'hwid', 'halt', 'twid', 'qwid'] },
		{ name: 'culturalVariants', items: ['jp78', 'jp83', 'jp90', 'jp04', 'trad', 'ruby', 'hkna', 'nlck', 'nalt', 'ital'] },
		{ name: 'verticalFeatures', items: ['vkrn', 'vert', 'vpal', 'vhal', 'vkna'] },
		{ name: 'others', items: ['kern', 'ccmp', 'locl', 'sups', 'subs'] }
	];

	function createCategoryItems(category: string, items: string[]): vscode.QuickPickItem[]
	{
		return [
			{ label: i18n(i18nTexts, category), kind: vscode.QuickPickItemKind.Separator },
			...items.map(item => new LigaturesEditorItem(i18n(i18nTexts, item), item))
		];
	}

	function createStylisticSets(): vscode.QuickPickItem[]
	{
		const items: vscode.QuickPickItem[] = [];
		const ssTranslated = i18n(i18nTexts, 'ss');
		for (let i = 1; i <= 20; i++)
		{
			const padded = i.toString().padStart(2, '0');
			items.push(new LigaturesEditorItem(ssTranslated + i, `ss${padded}`));
		}
		return items;
	}

	return CATEGORIES.flatMap(category =>
	{
		if (category.name === 'stylisticSets')
		{
			return createCategoryItems(category.name, []).concat(createStylisticSets());
		}

		return createCategoryItems(category.name, category.items);
	});
}










/**
 * VSCode の editor.fontLigatures の値からリガチャの設定をパースする。
 * @param input editor.fontLigatures の値。
 * @returns リガチャの設定を表す Map。キーはフィーチャー名、値は有効かどうかの真偽値。
 */
function parseLigatures(input: string): Map<string, boolean>
{
	const ligatures = new Map<string, boolean>();
	const regex = /["']?(?<feature>\w+)["']?\s*(?<value>\d)?/g;
	let match;
	for (const match of input.matchAll(regex))
	{
		const { feature, value } = match.groups as { feature: string; value?: string };
		ligatures.set(feature, value !== '0');
	}

	return ligatures;
}









/**
 * リガチャ編集用の QuickPick を表示する。
 */
export function showLigaturesEditor(): void
{
	// VSCodeの fontLigatures 設定が格納されているセクション名
	const SECTION = 'editor';

	// 人が読むための拡張機能の名前。エラー表示時に使用。
	const EXTENSION_NAME = 'Romly: Font Set Switcher';

	// 初期選択項目とキャンセル用に現在の設定を取得しておく
	const currentLigatures = vscode.workspace.getConfiguration(SECTION).get<string>('fontLigatures') || '';
	const enabledLigatures = parseLigatures(currentLigatures);

	const quickPick: vscode.QuickPick<vscode.QuickPickItem> = vscode.window.createQuickPick();
	//quickPick.title = title;
	let isAccepted = false;
	quickPick.canSelectMany = true;
	quickPick.items = createLigaturesEditorItems();
	// 初期選択項目を設定
	quickPick.selectedItems = quickPick.items
		.filter((item): item is LigaturesEditorItem => item instanceof LigaturesEditorItem && enabledLigatures.get(item.feature) === true);
	quickPick.onDidChangeSelection(items => {
		// 設定を反映
		const newLigatures = items
			.filter((item): item is LigaturesEditorItem => item instanceof LigaturesEditorItem)
			.map(item => `'${item.feature}'`)
			.join(', ');
		vscode.workspace.getConfiguration(SECTION).update('fontLigatures', newLigatures, vscode.ConfigurationTarget.Global)
			.then(
				() => {},
				error =>
				{
					// エラー処理
					ryutils.showErrorMessageWithDetailChannel(i18n(i18nTexts, 'updateLigatureFailed'), EXTENSION_NAME, 'Error occurred while updating editor.fontLigatures.', error);
				});
	});
	quickPick.onDidAccept(() => {
		isAccepted = true;
		quickPick.hide();
	});
	quickPick.onDidHide(() => {
		// 設定を元に戻す
		if (!isAccepted)
		{
			vscode.workspace.getConfiguration(SECTION).update('fontLigatures', currentLigatures, vscode.ConfigurationTarget.Global)
				.then(
					() => {},
					error =>
					{
						// エラー処理
						ryutils.showErrorMessageWithDetailChannel(i18n(i18nTexts, 'updateLigatureFailed'), EXTENSION_NAME, 'Error occurred while reverting editor.fontLigatures.', error);
					});
		}
		quickPick.dispose();
	});
	quickPick.show();
}