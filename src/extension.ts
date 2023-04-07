// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { stringify } from 'querystring';
import * as vscode from 'vscode';

// 自前の言語設定の読み込み
import i18nText from "./i18n";





// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableSwitchFontSet = vscode.commands.registerCommand('romly-font-set-switcher.switchEditorPrimaryFontSet', () => {
		// The code you place here will be executed every time your command is executed
		switchFontSet('editor', true);
	});
	context.subscriptions.push(disposableSwitchFontSet);

	context.subscriptions.push(vscode.commands.registerCommand('romly-font-set-switcher.switchEditorSecondaryFontSet', () => switchFontSet('editor', false)));

	// マークダウンプレビューのフォント変更機能
	context.subscriptions.push(vscode.commands.registerCommand('romly-font-set-switcher.switchMarkdownPreviewPrimaryFontSet', () => switchFontSet('markdown.preview', true)));
	context.subscriptions.push(vscode.commands.registerCommand('romly-font-set-switcher.switchMarkdownPreviewSecondaryFontSet', () => switchFontSet('markdown.preview', false)));

	// ターミナルのフォント変更機能
	context.subscriptions.push(vscode.commands.registerCommand('romly-font-set-switcher.switchTerminalPrimaryFontSet', () => switchFontSet('terminal.integrated', true)));
	context.subscriptions.push(vscode.commands.registerCommand('romly-font-set-switcher.switchTerminalSecondaryFontSet', () => switchFontSet('terminal.integrated', false)));
}

// this method is called when your extension is deactivated
export function deactivate() {}



interface FontSetItem extends vscode.QuickPickItem
{
	fonts: Array<string>;
}



/**
 * フォントセットの設定から取得したオブジェクトを、QuickPick用のFontSetItemに変換する。
 * @param fontSet
 * @returns
 */
function fontSetConfigToFontSetItem(fontSet: { fonts: string[]; name: string; })
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

	return { label: label, description: allFontNames, fonts: fontSet.fonts };
}

/**
 * フォント設定を保持するためのキーの前置詞をwhereの値から取得するための連想配列。
 */
const FONT_KEY_SUFFIX: { [key: string]: string; } =
{
	'editor': 'editor',
	'markdown.preview': 'markdownPreview',
	'terminal.integrated': 'terminal'
};

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

function switchFontSet(where: string, primary: boolean)
{
	// フォント設定リストを設定から読み込む
	const THE_CONFIGURATION = vscode.workspace.getConfiguration('Romly-FontSetSwitcher');
	const fontSetsConfiguration = THE_CONFIGURATION.get(primary ? 'primaryFontSets' : 'secondaryFontSets');

	// QuickPick用のリストを作る
	const fontSetItems:Array<FontSetItem> = [];
	if (fontSetsConfiguration instanceof Array && fontSetsConfiguration.length > 0)
	{
		fontSetsConfiguration.forEach(item =>
		{
			// フォントが書かれていない場合はスキップ
			if (item.fonts instanceof Array && item.fonts.length > 0)
			{
				fontSetItems.push(fontSetConfigToFontSetItem(item));
			}
		});
	}

	// フォント候補が見つからない場合、警告を表示するだけ
	if (fontSetItems.length === 0)
	{
		vscode.window.showInformationMessage(i18nText('fontSettingNotFound'), i18nText('fontSettingNotFoundYesButton')).then(value =>
		{
			if (value !== undefined)
			{
				// 設定にサンプルを書き込む
				if (primary)
				{
					THE_CONFIGURATION.update('primaryFontSets', SAMPLE_SETTING_FONTS_ENGLISH, true);
				}
				else
				{
					THE_CONFIGURATION.update('secondaryFontSets', SAMPLE_SETTING_FONTS_JAPANESE, true);
				}
			}
		});
		return;
	}



	// キャンセル用に現在のフォントを取得
	const currentFont = vscode.workspace.getConfiguration(where).get("fontFamily");

	// 現在のプライマリ、セカンダリフォントを取得
	const primaryFont = THE_CONFIGURATION.get(FONT_KEY_SUFFIX[where] + 'PrimaryFont');
	const secondaryFont = THE_CONFIGURATION.get(FONT_KEY_SUFFIX[where] + 'SecondaryFont');

	// QuickPickリストを表示する
	const selection = vscode.window.showQuickPick(fontSetItems,
	{
		placeHolder: i18nText(FONT_KEY_SUFFIX[where] + 'Placeholder' + (primary ? 'Primary' : 'Secondary')),
		onDidSelectItem: (selection: FontSetItem) =>
		{
			// 全てのフォント名を引用符で囲ってカンマで繋げる
			const selectedFontFamily = selection.fonts.map((fontName: string) => '\"' + fontName + '\"').join(', ');

			let fontFamily = '';
			if (primary)
			{
				fontFamily = (typeof(secondaryFont) === "string" && secondaryFont.length > 0) ? (selectedFontFamily + ', ' + secondaryFont) : selectedFontFamily;

				// プライマリフォント設定を書き込む
				THE_CONFIGURATION.update(FONT_KEY_SUFFIX[where] + 'PrimaryFont', selectedFontFamily, true);
			}
			else
			{
				fontFamily = (typeof(primaryFont) === "string" && primaryFont.length > 0) ? primaryFont + ', ' + selectedFontFamily : selectedFontFamily;

				// セカンダリフォント設定を書き込む
				THE_CONFIGURATION.update(FONT_KEY_SUFFIX[where] + 'SecondaryFont', selectedFontFamily, true);
			}

			// フォントを設定
			vscode.workspace.getConfiguration(where).update("fontFamily", fontFamily, true);
		}
	}).then(selection =>
	{
		// 選択しなかったらフォントを元に戻す
		if (selection === undefined)
		{
			vscode.workspace.getConfiguration(where).update("fontFamily", currentFont, true);
		}
	});
}