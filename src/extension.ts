// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as ryutils from './ryutils';
import * as ligaturesEditor from './ligaturesEditor';

// 自前の言語設定の読み込み
import i18n from "./i18n";
import i18nTexts from "./i18nTexts";










// 拡張機能の設定のセクション名
const CONFIG_SECTION = 'Romly-FontSetSwitcher';










/**
 * フォントの設定箇所を示す enum 型。
 */
enum FontSettingLocation
{
	editor = 'editor',
	markdownPreview = 'markdownPreview',
	terminal = 'terminal',
	debugConsole = 'debugConsole',
}

/**
 * フォントの優先順位を示す enum 型。
 * primary と secondary しかないけど、 boolean 型よりはいいかなって。
 */
enum FontPriority
{
	primary = 'primary',
	secondary = 'secondary',
}










// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// 各設定可能箇所についてそれぞれのコマンドを登録
	const COMMAND_PREFIX = 'romly-font-set-switcher.';
	for (const location of Object.values(FontSettingLocation))
	{
		for (const priority of Object.values(FontPriority))
		{
			const command = COMMAND_PREFIX + 'switch' + capitalize(location) + capitalize(priority) + 'FontSet';
			context.subscriptions.push(vscode.commands.registerCommand(command, () =>
			{
				const fontSetItems = readFirstFontSet(location, priority);

				// フォント候補が見つからない場合、警告を表示し、設定サンプルを書き込むか問い合わせる。
				if (fontSetItems.length === 0)
				{
					vscode.window.showInformationMessage(i18n(i18nTexts, 'fontSettingNotFound'), i18n(i18nTexts, 'fontSettingNotFoundYesButton')).then(value =>
					{
						if (value === undefined)
						{
							return;
						}

						// 設定にサンプルを書き込む
						const sampleFonts = priority ? SAMPLE_SETTING_FONTS_ENGLISH : SAMPLE_SETTING_FONTS_JAPANESE;
						vscode.workspace.getConfiguration(CONFIG_SECTION).update(priority + 'FontSets', sampleFonts, true);
					});
				}
				else
				{
					// フォントを空にするコマンドを追加
					fontSetItems.push(new FontSetClerCommandItem(location, priority));

					switchFontSet('', location, priority, fontSetItems);
				}
			}));
		}
	}

	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_PREFIX + 'setFontLigatures', () =>
	{
		ligaturesEditor.showLigaturesEditor();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}










abstract class FontSetItemBase implements vscode.QuickPickItem
{
	label: string;
	description: string;
	buttons: ryutils.RyQuickPickButton[];

	readonly targetLocation: FontSettingLocation;
	readonly targetPriority: FontPriority;

	constructor(label: string, description: string, targetLocation: FontSettingLocation, targetPriority: FontPriority)
	{
		this.label = label;
		this.description = description;
		this.buttons = [];

		this.targetLocation = targetLocation;
		this.targetPriority = targetPriority;
	}

	abstract containsFont(fontName: string): boolean;

	abstract allFonts(): string[];

	abstract onButtonClick(button: ryutils.RyQuickPickButton): void;

	onActive(): void
	{
		// 子アイテムの全てのフォント名を引用符で囲ってカンマで繋げる
		const selectedFontFamily = this.allFonts().map((fontName: string) => `"${fontName}"`).join(', ');

		const THE_CONFIGURATION = vscode.workspace.getConfiguration(CONFIG_SECTION);
		let fontFamily = '';
		if (this.targetPriority === FontPriority.primary)
		{
			const secondaryFont = THE_CONFIGURATION.get(this.targetLocation + 'SecondaryFont');
			fontFamily = (typeof(secondaryFont) === "string" && secondaryFont.length > 0) ? (selectedFontFamily + ', ' + secondaryFont) : selectedFontFamily;

		}
		else
		{
			const primaryFont = THE_CONFIGURATION.get(this.targetLocation + 'PrimaryFont');
			fontFamily = (typeof(primaryFont) === "string" && primaryFont.length > 0) ? primaryFont + ', ' + selectedFontFamily : selectedFontFamily;
		}

		// 保持用のフォント設定を書き込む
		THE_CONFIGURATION.update(this.targetLocation + capitalize(this.targetPriority) + 'Font', selectedFontFamily, true);

		// フォントを設定
		vscode.workspace.getConfiguration(getFontSettingPrefix(this.targetLocation)).update("fontFamily", fontFamily, true);
	}
}

class FontSetItem2 extends FontSetItemBase
{
	fonts: string[];

	constructor(label: string, description: string, targetLocation: FontSettingLocation, targetPriority: FontPriority, fonts: string[])
	{
		super(label, description, targetLocation, targetPriority);
		this.fonts = fonts;
	}

	override containsFont(fontName: string): boolean
	{
		return this.fonts.includes(fontName);
	}

	override allFonts(): string[]
	{
		return this.fonts;
	}

	override onButtonClick(button: ryutils.RyQuickPickButton): void
	{
	}
}

/**
 * グループ項目を表す QuickPickItem
 */
class FontSetGroup extends FontSetItemBase
{
	private readonly buttonIdGodown: string = 'copy';

	fontSets: FontSetItemBase[] = [];

	constructor(label: string, description: string, targetLocation: FontSettingLocation, targetPriority: FontPriority, fontSets: FontSetItemBase[])
	{
		super(label, description, targetLocation, targetPriority);
		this.fontSets = fontSets;
		this.buttons.push({ iconPath: new vscode.ThemeIcon('chevron-right'), tooltip: i18n(i18nTexts, 'showGroupFonts'), id: this.buttonIdGodown });
	}

	override containsFont(fontName: string): boolean
	{
		for (const fontSet of this.fontSets)
		{
			if (fontSet.containsFont(fontName))
			{
				return true;
			}
		}
		return false;
	}

	override allFonts(): string[]
	{
		const allFonts: string[] = [];
		for (const fontSet of this.fontSets)
		{
			allFonts.push(...fontSet.allFonts());
		}
		return allFonts;
	}

	override onButtonClick(button: ryutils.RyQuickPickButton): void
	{
		if (button.id === this.buttonIdGodown)
		{
			switchFontSet(this.label, this.targetLocation, this.targetPriority, this.fontSets);
		}
	}
}

/**
 * フォントセットをクリアするコマンドのための QuickPickItem
 */
class FontSetClerCommandItem extends FontSetItemBase
{
	constructor(targetLocation: FontSettingLocation, targetPriority: FontPriority)
	{
		super(i18n(i18nTexts, 'clearFontSet'), '', targetLocation, targetPriority);
	}

	override containsFont(fontName: string): boolean
	{
		return false;
	}

	override allFonts(): string[]
	{
		return [];
	}

	override onButtonClick(button: ryutils.RyQuickPickButton): void
	{
	}
}









/**
 * フォントの設定箇所を VSCode の設定名に変換する。
 * @param where
 * @returns
 */
function getFontSettingPrefix(where: FontSettingLocation): string
{
	switch (where)
	{
		case FontSettingLocation.editor:
			return 'editor';
		case FontSettingLocation.markdownPreview:
			return 'markdown.preview';
		case FontSettingLocation.terminal:
			return 'terminal.integrated';
		case FontSettingLocation.debugConsole:
			return 'debug.console';
		default:
			return '';
	}
}










/**
 * フォントセットの設定から取得したオブジェクトを、QuickPick用のFontSetItemに変換する。
 * @param fontSet
 * @returns
 */
function fontSetConfigToFontSetItem(where: FontSettingLocation, priority: FontPriority, fontSet: { fonts: string[]; name: string; }): FontSetItem2
{
	// 説明文には全てのフォント名をカンマ区切りで羅列
	let allFontNames = fontSet.fonts.join(', ');

	// ラベルはnameの値または説明文と同じ
	let label = fontSet.name;
	if (label === undefined)
	{
		label = allFontNames;
	}

	// ラベルと説明文が同じの場合は説明文を省略
	if (label === allFontNames)
	{
		allFontNames = '';
	}

	return new FontSetItem2(label, allFontNames, where, priority, fontSet.fonts);
}










const SAMPLE_SETTING_FONTS_ENGLISH: Array<{ 'name': string | undefined, 'fonts': Array<string> }> =
[
	{ 'name': undefined, 'fonts': ['Courier New'] },
	{ 'name': undefined, 'fonts': ['Arial'] },
	{ 'name': undefined, 'fonts': ['Arial Black'] },
	{ 'name': undefined, 'fonts': ['Georgia'] },
	{ 'name': undefined, 'fonts': ['Impact'] },
	{ 'name': undefined, 'fonts': ['Times New Roman'] },
	{ 'name': undefined, 'fonts': ['Comic Sans MS'] },
	{ 'name': '[Win] Consolas', 'fonts': ['Consolas'] },
	{ 'name': '[Mac] Monaco', 'fonts': ['Monaco'] },
	{ 'name': '[Mac] AmericanTypewriter', 'fonts': ['AmericanTypewriter'] },
];

/**
 * 日本語フォント候補のサンプル設定。
 */
const SAMPLE_SETTING_FONTS_JAPANESE: Array<{ 'name': string | undefined, 'fonts': Array<string> }> =
[
	{ 'name': '游ゴシック', 'fonts': ['游ゴシック', 'YuGo-Medium'] },
	{ 'name': '游明朝', 'fonts': ['游明朝', 'YuGo-Medium'] },
	{ 'name': '教科書体', 'fonts': ['UD デジタル 教科書体 N-R', 'YuKyo-Medium'] },
	{ 'name': undefined, 'fonts': ['BIZ UDゴシック', 'Osaka'] },
	{ 'name': '[Win] BIZ UD明朝', 'fonts': ['BIZ UD明朝'] },
	{ 'name': '[Mac] クレー', 'fonts': ['Klee-Medium'] },
	{ 'name': '[Mac] ヒラギノ丸ゴ', 'fonts': ['HiraMaruProN-W4'] },
	{ 'name': '[Mac] 筑紫A丸ゴシック レギュラー', 'fonts': ['TsukuARdGothic-Regular'] },
	{ 'name': '[Mac] 筑紫B丸ゴシック レギュラー', 'fonts': ['TsukuBRdGothic-Regular'] },
	{ 'name': '[Mac] 凸版文久見出し明朝 エクストラボールド', 'fonts': ['ToppanBunkyuMidashiMinchoStdN-ExtraBold'] },
];










/**
 * カンマ区切りのフォント名リストから最初のフォント名を取得する。
 *
 * @param fontFamily カンマ区切りのフォント名リスト。
 * @returns リストの最初のフォント名（トリムおよび引用符除去後）。
 */
function extractFirstFontName(fontFamily: string): string
{
	const currentFonts = fontFamily.split(',').map(font => font.trim().replace(/["']/g, ''));
	return currentFonts[0];
}










/**
 * 指定された場所のフォントファミリー設定を取得し、最初のフォント名を取得する。
 * @param where フォント設定の場所。
 * @returns
 */
function getCurrentFirstFontName(where: FontSettingLocation): string
{
	const fontFamily = vscode.workspace.getConfiguration(getFontSettingPrefix(where)).get('fontFamily') as string;

	if (fontFamily?.trim())
	{
		return extractFirstFontName(fontFamily);
	}
	else
	{
		return '';
	}
}










/**
 * 現在設定されているフォントを QuickPick 上で選択状態にする処理
 * @param quickPick
 * @param where
 * @param priority
 * @param fontSetItems
 */
function activateCurrentFont(quickPick: vscode.QuickPick<vscode.QuickPickItem>, where: FontSettingLocation, priority: FontPriority, fontSetItems: FontSetItemBase[]): void
{
	let currentFontName: string;
	if (priority === FontPriority.primary)
	{
		currentFontName = getCurrentFirstFontName(where);
	}
	else
	{
		const THE_CONFIGURATION = vscode.workspace.getConfiguration(CONFIG_SECTION);
		const secondaryFont = THE_CONFIGURATION.get(where + 'SecondaryFont') as string;
		currentFontName = extractFirstFontName(secondaryFont);
	}

	for (const item of fontSetItems)
	{
		if (item.containsFont(currentFontName))
		{
			quickPick.activeItems = [item];
			break;
		}
	}

	const index = fontSetItems.findIndex(item => item.containsFont(currentFontName));
	if (index >= 0)
	{
		// selectedItems を変更すると onDidAccept イベントが発火してしまうので、 activeItems が正しい。
		quickPick.activeItems = [fontSetItems[index]];
	}
}










/**
 * 位置文字目を大文字にする。
 * @param s
 * @returns
 */
function capitalize(s: string): string
{
	return s.charAt(0).toUpperCase() + s.slice(1);
}










/**
 * 設定からフォントセットを読み込んで QuickPick 用のリストを作成する。
 * @param where
 * @param priority
 * @returns
 */
function readFirstFontSet(where: FontSettingLocation, priority: FontPriority): FontSetItemBase[]
{
	// フォント設定リストを設定から読み込む
	const THE_CONFIGURATION = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const fontSetsConfiguration = THE_CONFIGURATION.get(priority + 'FontSets');

	// QuickPick用のリストを作る
	const fontSetItems: FontSetItemBase[] = [];
	if (Array.isArray(fontSetsConfiguration) && fontSetsConfiguration.length > 0)
	{
		fontSetsConfiguration.forEach(item =>
		{
			if (Array.isArray(item.fontSets) && item.fontSets.length > 0)
			{
				// 名前が指定されていない場合
				const name = item.name || i18n(i18nTexts, 'namelessGroup');

				// description にはグループ内のフォントセットの数を表示
				const description = String(item.fontSets.length);
				fontSetItems.push(new FontSetGroup(name, description, where, priority, item.fontSets.map((fontSet: { fonts: string[]; name: string; })  =>
				{
					return fontSetConfigToFontSetItem(where, priority, fontSet);
				})));
			}
			// フォントが書かれていない場合はスキップ
			else if (Array.isArray(item.fonts) && item.fonts.length > 0 &&
				item.fonts.every((font: string) => typeof font === 'string'))
			{
				fontSetItems.push(fontSetConfigToFontSetItem(where, priority, item));
			}
		});
	}

	return fontSetItems;
}









function switchFontSet(title: string, where: FontSettingLocation, priority: FontPriority, fontSetItems: FontSetItemBase[]): void
{
	// キャンセル用に現在のフォントを取得
	const currentFont = vscode.workspace.getConfiguration(getFontSettingPrefix(where)).get('fontFamily') as string;

	// QuickPickリストを表示する
	const quickPick: vscode.QuickPick<FontSetItemBase> = vscode.window.createQuickPick();
	if (title.length > 0)
	{
		quickPick.title = title;
	}
	quickPick.items = fontSetItems;
	quickPick.placeholder = i18n(i18nTexts, where + 'Placeholder' + capitalize(priority));

	// 現在設定されているフォントを選択状態にする処理
	activateCurrentFont(quickPick, where, priority, fontSetItems);

	enum QuickPickState { beforeShow, shown, accepted };
	let quickPickAccepted = QuickPickState.beforeShow;
	quickPick.onDidChangeActive(items =>
	{
		if (quickPickAccepted === QuickPickState.shown)
		{
			items[0].onActive();
		}
	});
	quickPick.onDidAccept(() =>
	{
		if (quickPickAccepted === QuickPickState.shown)
		{
			quickPickAccepted = QuickPickState.accepted;
			quickPick.dispose();
		}
	});
	quickPick.onDidHide(() =>
	{
		if (quickPickAccepted === QuickPickState.shown)
		{
			// 選択しなかったらフォントを元に戻す
			vscode.workspace.getConfiguration(getFontSettingPrefix(where)).update('fontFamily', currentFont, true);
			quickPick.dispose();
			quickPickAccepted = QuickPickState.beforeShow;
		}
	});

	// 個々のアイテムのボタン押下時の処理
	quickPick.onDidTriggerItemButton(e =>
	{
		quickPick.hide();
		const button = e.button as ryutils.RyQuickPickButton;
		e.item.onButtonClick(button);
	});

	quickPick.show();
	quickPickAccepted = QuickPickState.shown;
}