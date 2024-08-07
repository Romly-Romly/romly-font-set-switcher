// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import * as ryutils from './ryutils';
import * as ligaturesEditor from './ligaturesEditor';

// 自前の言語設定の読み込み
import { i18n } from "./i18n";
import { MESSAGES, ProjectMessageKey } from "./i18nTexts";










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










type PlatformFontDirs = {
	[key: string]: string[];
};

/**
 * OSに応じたフォントのディレクトリを取得する。
 * @returns フォントのディレクトリへのパスのリスト。
 */
function getFontDirs(): string[]
{
	const homedir = os.homedir();
	const platformFontDirs: PlatformFontDirs =
	{
		darwin: [
			path.join(homedir, 'Library', 'Fonts'),
			'/Library/Fonts',
			'/System/Library/Fonts'
		],
		win32: [
			path.join(homedir, 'AppData', 'Local', 'Microsoft', 'Windows', 'Fonts'),
			'C:\\Windows\\Fonts'
		],
		linux: [
			path.join(homedir, '.fonts'),
			'/usr/local/share/fonts',
			'/usr/share/fonts'
		]
	};

	switch (os.platform())
	{
		case 'darwin':
			return platformFontDirs.darwin;
		case 'win32':
			return platformFontDirs.win32;
		default:
			return platformFontDirs.linux;
	}
}










/**
 * 指定されたファイル名のフォントがOS毎のフォントディレクトリに存在していれば true を返す。
 * @param fontFilename
 * @returns
 */
function isFontFileExists(fontFilename: string): boolean
{
	const fontDirs = getFontDirs();
	for (const dir of fontDirs)
	{
		const fontFilePath = path.join(dir, fontFilename);
		if (fs.existsSync(fontFilePath))
		{
			return true;
		}

		// サブディレクトリも1階層だけチェック
		const subDirs = fs.readdirSync(dir, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => path.join(dir, dirent.name));

		for (const subDir of subDirs)
		{
			const fontFilePath = path.join(subDir, fontFilename);
			if (fs.existsSync(fontFilePath))
			{
				return true;
			}
		}
	}

	return false;
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
				let fontSetItems = readFirstFontSet(location, priority);

				// フォント候補が見つからない場合、警告を表示し、設定サンプルを書き込むか問い合わせる。
				if (fontSetItems.length === 0)
				{
					vscode.window.showInformationMessage(i18n(MESSAGES.fontSettingNotFound), i18n(MESSAGES.fontSettingNotFoundYesButton)).then(value =>
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
					const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
					const hideFontsWithMissingFiles = config.get<boolean>('hideFontsWithMissingFiles') ?? true;
					if (hideFontsWithMissingFiles)
					{
						// フォントファイルが見付からないアイテムを削除
						fontSetItems = fontSetItems.filter(item =>
						{
							if (item instanceof FontSetItemBase)
							{
								if (item.fontFilename !== undefined && item.fontFilename.length > 0)
								{
									const result = isFontFileExists(item.fontFilename);
									return result;
								}
							}

							return true;
						});
					}

					// フォントを空にするコマンドを追加
					fontSetItems.push(new FontSetClerCommandItem(location, priority));

					switchFontSet(i18n(MESSAGES.firstTitle), location, priority, fontSetItems);
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
export function deactivate()
{
}










abstract class FontSetItemBase implements vscode.QuickPickItem
{
	label: string;
	description: string;
	buttons: ryutils.IRyQuickPickButton[];

	readonly targetLocation: FontSettingLocation;
	readonly targetPriority: FontPriority;

	public fontFilename: string = '';

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

	abstract onButtonClick(button: ryutils.IRyQuickPickButton): void;

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

	override onButtonClick(button: ryutils.IRyQuickPickButton): void
	{
	}
}

/**
 * グループ項目を表す QuickPickItem
 */
class FontSetGroup extends FontSetItemBase
{
	private readonly _buttonIdGodown: string = 'copy';

	fontSets: FontSetItemBase[] = [];

	constructor(label: string, description: string, targetLocation: FontSettingLocation, targetPriority: FontPriority, fontSets: FontSetItemBase[])
	{
		super(label, description, targetLocation, targetPriority);
		this.fontSets = fontSets;
		this.buttons.push({ iconPath: new vscode.ThemeIcon('chevron-right'), tooltip: i18n(MESSAGES.showGroupFonts), id: this._buttonIdGodown });
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

	override onButtonClick(button: ryutils.IRyQuickPickButton): void
	{
		if (button.id === this._buttonIdGodown)
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
		super(i18n(MESSAGES.clearFontSet), '', targetLocation, targetPriority);
	}

	override containsFont(fontName: string): boolean
	{
		return false;
	}

	override allFonts(): string[]
	{
		return [];
	}

	override onButtonClick(button: ryutils.IRyQuickPickButton): void
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










type FontSet = { fonts: string[]; name: string; filename: string; };

/**
 * フォントセットの設定から取得したオブジェクトを、QuickPick用のFontSetItemに変換する。
 * @param fontSet
 * @returns
 */
function fontSetConfigToFontSetItem(where: FontSettingLocation, priority: FontPriority, fontSet: { fonts: string[]; name: string }): FontSetItem2
{
	// 説明文には全てのフォント名をカンマ区切りで羅列
	let allFontNames = fontSet.fonts.join(', ');

	// ラベルはnameの値または説明文と同じ
	let label = fontSet.name;
	if (label === undefined)
	{
		label = allFontNames;
	}

	// ラベルと説明文が同じ場合は説明文を省略
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
				const name = item.name || i18n(MESSAGES.namelessGroup);

				// description にはグループ内のフォントセットの数を表示
				const description = String(item.fontSets.length);
				const fontSetGroup = new FontSetGroup(name, description, where, priority, item.fontSets.map((fontSet: FontSet) =>
				{
					return fontSetConfigToFontSetItem(where, priority, fontSet);
				}));
				fontSetGroup.fontFilename = item['file'];
				fontSetItems.push(fontSetGroup);
			}
			// フォントが書かれていない場合はスキップ
			else if (Array.isArray(item.fonts) && item.fonts.length > 0 &&
				item.fonts.every((font: string) => typeof font === 'string'))
			{
				const fontSetItem = fontSetConfigToFontSetItem(where, priority, item);
				fontSetItem.fontFilename = item['file'];
				fontSetItems.push(fontSetItem);
			}
		});
	}

	return fontSetItems;
}










function adjustEditorNumberSetting(key: string, delta: number, min: number, max: number): void
{
	const EDITOR_CONFIG = vscode.workspace.getConfiguration('editor');
	let fontSize = EDITOR_CONFIG.get<number>(key);
	if (fontSize !== undefined)
	{
		fontSize = Math.min(Math.max(Math.round(fontSize + delta), min), max);
		EDITOR_CONFIG.update(key, fontSize, vscode.ConfigurationTarget.Global);
	}
}










/**
 * VSCode のエディタのフォントサイズを増減する。
 * @param delta
 */
function adjustFontSize(delta: number): void
{
	// VS Code の設定によると、最大値は 100、最小値は 6 だったので
	adjustEditorNumberSetting('fontSize', delta, 6, 100);
}










function adjustLetterSpacing(delta: number): void
{
	// これは最小値と最大値わからなかったので適当に100とした
	adjustEditorNumberSetting('letterSpacing', delta, -100, 100);
}










// エディタのどの設定を調整するかの指定。
enum RyEditorSettingAttribute { FontSize, LetterSpacing }

/**
 * フォントサイズを変更する QuickPick 用ボタン。
 * 2024/07/09
 */
class RyFontSizeButton implements vscode.QuickInputButton
{
	readonly iconPath: vscode.Uri | {
		light: vscode.Uri;
		dark: vscode.Uri;
	} | vscode.ThemeIcon;

	readonly tooltip: string;

	private readonly _attribute: RyEditorSettingAttribute;

	private readonly _increase: boolean;

	constructor(attr: RyEditorSettingAttribute, increase: boolean)
	{
		switch (attr)
		{
			case RyEditorSettingAttribute.FontSize:
				this.iconPath = new vscode.ThemeIcon(increase ? 'add' : 'remove');
				this.tooltip = i18n(increase ? MESSAGES.tooltipIncreaseFontSize : MESSAGES.tooltipDecreaseFontSize);
				break;
			case RyEditorSettingAttribute.LetterSpacing:
				this.iconPath = new vscode.ThemeIcon(increase ? 'chevron-right' : 'chevron-left');
				this.tooltip = i18n(increase ? MESSAGES.tooltipIncreaseLetterSpacing : MESSAGES.tooltipDecreaseLetterSpacing);
				break;
		}
		this._attribute = attr;
		this._increase = increase;
	}

	public onClick(): void
	{
		switch (this._attribute)
		{
			case RyEditorSettingAttribute.FontSize:
				adjustFontSize(this._increase ? 1 : -1);
				break;
			case RyEditorSettingAttribute.LetterSpacing:
				adjustLetterSpacing(this._increase ? 1 : -1);
				break;
		}
	}
}










/**
 * キャンセル用に現在のフォント、行間と字間を保持しておくためのクラス。
 * 2024/07/09
 */
class CurrentSetting
{
	private _configSection: string;
	private _font: string | undefined;
	private _fontSize: number | undefined;
	private _letterSpacing: number | undefined;

	constructor(configurationSection: string)
	{
		this._configSection = configurationSection;
		const config = vscode.workspace.getConfiguration(configurationSection);
		this._font = config.get<string>('fontFamily');
		this._fontSize = config.get<number>('fontSize');
		this._letterSpacing = config.get<number>('letterSpacing');
	}

	public restore(): void
	{
		const config = vscode.workspace.getConfiguration(this._configSection);
		if (this._font !== undefined)
		{
			config.update('fontFamily', this._font, vscode.ConfigurationTarget.Global);
		}
		if (this._fontSize !== undefined)
		{
			config.update('fontSize', this._fontSize, vscode.ConfigurationTarget.Global);
		}
		if (this._letterSpacing !== undefined)
		{
			config.update('letterSpacing', this._letterSpacing, vscode.ConfigurationTarget.Global);
		}
	}
}










function switchFontSet(title: string, where: FontSettingLocation, priority: FontPriority, fontSetItems: FontSetItemBase[]): void
{
	// キャンセル用に現在の設定を取得
	const currentSetting = new CurrentSetting(getFontSettingPrefix(where));

	// QuickPickリストを表示する
	const quickPick: vscode.QuickPick<vscode.QuickPickItem> = vscode.window.createQuickPick();
	if (title.length > 0)
	{
		quickPick.title = title;
	}
	quickPick.items = fontSetItems;
	quickPick.placeholder = i18n(MESSAGES[`${where}Placeholder${capitalize(priority)}` as ProjectMessageKey]);
	quickPick.buttons = [
		new RyFontSizeButton(RyEditorSettingAttribute.LetterSpacing, false),
		new RyFontSizeButton(RyEditorSettingAttribute.LetterSpacing, true),
		new RyFontSizeButton(RyEditorSettingAttribute.FontSize, false),
		new RyFontSizeButton(RyEditorSettingAttribute.FontSize, true),
	];

	// 現在設定されているフォントを選択状態にする処理
	activateCurrentFont(quickPick, where, priority, fontSetItems);

	// 遅延実行用のタイマー
	let debounceTimer: NodeJS.Timeout | undefined;

	enum QuickPickState { beforeShow, shown, accepted };
	let quickPickAccepted = QuickPickState.beforeShow;
	quickPick.onDidChangeActive(items =>
	{
		// カーソルキーを押しっぱなしにした場合など、連続でアクティブ項目を変更した時に毎回フォント変更すると重くなってしまうので、遅延実行する。
		if (debounceTimer)
		{
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() =>
		{
			const selectedItem = items[0];
			if (selectedItem)
			{
				if (quickPickAccepted === QuickPickState.shown &&
					selectedItem instanceof FontSetItemBase)
				{
					selectedItem.onActive();
				}
			}
		}, 150);
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
			if (debounceTimer)
			{
				clearTimeout(debounceTimer);
			}

			// 選択しなかったらフォントを元に戻す
			currentSetting.restore();
			quickPick.dispose();
			quickPickAccepted = QuickPickState.beforeShow;
		}
	});

	// クイックピック自体のボタンの押下時の処理
	quickPick.onDidTriggerButton(button =>
	{
		if (button instanceof RyFontSizeButton)
		{
			button.onClick();
		}
	});

	// 個々のアイテムのボタン押下時の処理
	quickPick.onDidTriggerItemButton(e =>
	{
		quickPick.hide();
		const button = e.button as ryutils.IRyQuickPickButton;
		if (e.item instanceof FontSetItemBase)
		{
			e.item.onButtonClick(button);
		}
	});

	quickPickAccepted = QuickPickState.shown;
	quickPick.show();
}