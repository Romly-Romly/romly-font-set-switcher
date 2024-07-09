import { I18NText } from "./i18n";

export type ProjectMessageKey = keyof ProjectMessages;

class ProjectMessages
{
	'editorPlaceholderPrimary': I18NText =
	{
		ja: 'エディターのメインフォントセットを選択して下さい。',
		en: 'Select Primary Font Set for the editor.'
	};
	'editorPlaceholderSecondary': I18NText =
	{
		ja: 'エディターのサブフォントセットを選択して下さい。',
		en: 'Select Secondary Font Set for the editor.'
	};
	'markdownPreviewPlaceholderPrimary': I18NText =
	{
		ja: 'マークダウンプレビューのメインフォントセットを選択して下さい。',
		en: 'Select Primary Font Set for the markdown preview.'
	};
	'markdownPreviewPlaceholderSecondary': I18NText =
	{
		ja: 'マークダウンプレビューのサブフォントセットを選択して下さい。',
		en: 'Select Secondary Font Set for the markdown preview.'
	};
	'terminalPlaceholderPrimary': I18NText =
	{
		ja: 'ターミナルのメインフォントセットを選択して下さい。',
		en: 'Select Primary Font Set for the terminal.'
	};
	'terminalPlaceholderSecondary': I18NText =
	{
		ja: 'ターミナルのサブフォントセットを選択して下さい。',
		en: 'Select Secondary Font Set for the terminal.'
	};
	'debugConsolePlaceholderPrimary': I18NText =
	{
		ja: 'デバッグコンソールのメインフォントセットを選択して下さい。',
		en: 'Select Primary Font Set for the debug console.'
	};
	'debugConsolePlaceholderSecondary': I18NText =
	{
		ja: 'デバッグコンソールのサブフォントセットを選択して下さい。',
		en: 'Select Secondary Font Set for the debug console.'
	};
	'fontSettingNotFound': I18NText =
	{
		ja: 'フォントセット候補が見つかりませんでした。サンプルとなる設定を書き込みますか？',
		en: 'Font Set candidates are not found. Shall I put the sample setting in the settings JSON?'
	};
	'fontSettingNotFoundYesButton': I18NText =
	{
		ja: 'はい',
		en: 'Yes'
	};
	'showGroupFonts': I18NText =
	{
		ja: 'グループ内のフォントを表示',
		en: 'Show fonts in the group'
	};
	'namelessGroup': I18NText =
	{
		ja: '(名無しグループ)',
		en: '(Nameless Group)'
	};
	clearFontSet: I18NText =
	{
		ja: 'フォントセットをクリア',
		en: 'Clear Font Set',
	};
	updateLigatureFailed: I18NText =
	{
		en: 'Failed to write editor.fontLigatures into the user settings.',
		ja: 'ユーザー設定への editor.fontLigatures の書き込みに失敗しました。'
	};
	ligatures: I18NText =
	{
		ja: '合字',
		en: 'Ligatures',
	};
	letters: I18NText =
	{
		ja: '文字',
		en: 'Letters',
	};
	numbers: I18NText =
	{
		ja: '数値',
		en: 'Numbers',
	};
	stylisticSets: I18NText =
	{
		ja: 'デザインセット',
		en: 'Stylistic Sets',
	};
	widthVariants: I18NText =
	{
		ja: '幅の異なる字形',
		en: 'Width Variants',
	};
	culturalVariants: I18NText =
	{
		ja: '文化的に異なる字形',
		en: 'Cultrual Variants',
	};
	verticalFeatures: I18NText =
	{
		ja: '縦書き機能',
		en: 'Vertical Features',
	};
	others: I18NText =
	{
		ja: 'その他',
		en: 'Others',
	};
	liga: I18NText =
	{
		ja: '標準合字',
		en: 'Standard Ligatures',
	};
	calt: I18NText =
	{
		ja: '前後関係に依存する字形',
		en: 'Contextual alternates',
	};
	dlig: I18NText =
	{
		ja: '任意の合字',
		en: 'Discretionary Ligatures',
	};
	smcp: I18NText =
	{
		ja: 'スモールキャップス',
		en: 'Small Caps',
	};
	c2sc: I18NText =
	{
		ja: '大文字のスモールキャップス',
		en: 'Capitals to Small Caps',
	};
	swsh: I18NText =
	{
		ja: 'スワッシュ字形',
		en: 'Swashes',
	};
	salt: I18NText =
	{
		ja: 'デザインのバリエーション',
		en: 'Stylistic alternates',
	};
	lnum: I18NText =
	{
		ja: 'ライニング数字',
		en: 'Lining Figures',
	};
	onum: I18NText =
	{
		ja: 'オールドスタイル数字',
		en: 'Oldstyle Figures',
	};
	pnum: I18NText =
	{
		ja: 'プロポーショナル数字',
		en: 'Proportional Figures',
	};
	tnum: I18NText =
	{
		ja: '等幅数字',
		en: 'Tabular Figures',
	};
	frac: I18NText =
	{
		ja: '分数',
		en: 'Fractions',
	};
	ordn: I18NText =
	{
		ja: '上付き序数表記',
		en: 'Ordinals',
	};
	ss: I18NText =
	{
		ja: 'デザインのセット',
		en: 'Stylistic Sets',
	};
	pwid: I18NText =
	{
		ja: 'プロポーショナル字形',
		en: 'Proportional Widths',
	};
	palt: I18NText =
	{
		ja: 'プロポーショナルメトリクス',
		en: 'Proportional Alternate Widths',
	};
	pkna: I18NText =
	{
		ja: 'プロポーショナルかな',
		en: 'Proportional Kana',
	};
	fwid: I18NText =
	{
		ja: '等幅全角字形',
		en: 'Full Widths',
	};
	hwid: I18NText =
	{
		ja: '等幅半角字形',
		en: 'Half Widths',
	};
	halt: I18NText =
	{
		ja: '字幅半角メトリクス',
		en: 'Alternate Half Widths',
	};
	twid: I18NText =
	{
		ja: '等幅三分字形',
		en: 'Third Widths',
	};
	qwid: I18NText =
	{
		ja: '等幅四分字形',
		en: 'Quarter Widths',
	};
	jp78: I18NText =
	{
		ja: 'JIS78 字形',
		en: 'JIS78 Forms',
	};
	jp83: I18NText =
	{
		ja: 'JIS83 字形',
		en: 'JIS83 Forms',
	};
	jp90: I18NText =
	{
		ja: 'JIS90 字形',
		en: 'JIS90 Forms',
	};
	jp04: I18NText =
	{
		ja: 'JIS2004 字形',
		en: 'JIS2004 Forms',
	};
	trad: I18NText =
	{
		ja: '旧字体',
		en: 'Traditional Forms',
	};
	ruby: I18NText =
	{
		ja: 'ルビ用字形',
		en: 'Ruby Notation Forms',
	};
	hkna: I18NText =
	{
		ja: '横組み用かな',
		en: 'Horizontal Kana Alternates',
	};
	nlck: I18NText =
	{
		ja: '印刷標準字体',
		en: 'NLC Kanji Forms',
	};
	nalt: I18NText =
	{
		ja: '修飾字形',
		en: 'Alternate Annotation Forms',
	};
	ital: I18NText =
	{
		ja: 'イタリック',
		en: 'Italics',
	};
	vkrn: I18NText =
	{
		ja: '縦組みペアカーニング',
		en: 'Vertical Kerning',
	};
	vert: I18NText =
	{
		ja: '縦組み用字形',
		en: 'Vertical Alternates',
	};
	vpal: I18NText =
	{
		ja: '縦組みプロポーショナルメトリクス',
		en: 'Proportional Alternate Vertical Metrics',
	};
	vhal: I18NText =
	{
		ja: '縦組み字幅半角メトリクス',
		en: 'Alternate Vertical Half Metrics',
	};
	vkna: I18NText =
	{
		ja: '縦組み用かな',
		en: 'Vertical Kana Alternates',
	};
	kern: I18NText =
	{
		ja: 'カーニング',
		en: 'Kerning',
	};
	ccmp: I18NText =
	{
		ja: '字体組版／分解',
		en: 'Glyph Composition/Decomposition',
	};
	locl: I18NText =
	{
		ja: 'ローカライズの字形',
		en: 'Localized Forms',
	};
	sups: I18NText =
	{
		ja: '上付き文字',
		en: 'Superscript',
	};
	subs: I18NText =
	{
		ja: '下付き文字',
		en: 'Subscript',
	};

	tooltipIncreaseFontSize: I18NText =
	{
		ja: 'フォントサイズを大きくする',
		en: 'Increase Font Size',
	};

	tooltipDecreaseFontSize: I18NText =
	{
		ja: 'フォントサイズを小さくする',
		en: 'Decrease Font Size',
	};

	tooltipIncreaseLetterSpacing: I18NText =
	{
		ja: '字間を広げる',
		en: 'Increase Letter Spacing',
	};

	tooltipDecreaseLetterSpacing: I18NText =
	{
		ja: '字間を狭める',
		en: 'Decrease Letter Spacing',
	};

	firstTitle: I18NText =
	{
		ja: 'フォント変更',
		en: 'Change Font'
	};
};

export const MESSAGES = new ProjectMessages();
