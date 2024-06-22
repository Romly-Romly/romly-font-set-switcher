const i18n =
{
	'editorPlaceholderPrimary':
	{
		'ja': 'エディターのメインフォントセットを選択して下さい。',
		'en': 'Select Primary Font Set for the editor.'
	},
	'editorPlaceholderSecondary':
	{
		'ja': 'エディターのサブフォントセットを選択して下さい。',
		'en': 'Select Secondary Font Set for the editor.'
	},
	'markdownPreviewPlaceholderPrimary':
	{
		'ja': 'マークダウンプレビューのメインフォントセットを選択して下さい。',
		'en': 'Select Primary Font Set for the markdown preview.'
	},
	'markdownPreviewPlaceholderSecondary':
	{
		'ja': 'マークダウンプレビューのサブフォントセットを選択して下さい。',
		'en': 'Select Secondary Font Set for the markdown preview.'
	},
	'terminalPlaceholderPrimary':
	{
		'ja': 'ターミナルのメインフォントセットを選択して下さい。',
		'en': 'Select Primary Font Set for the terminal.'
	},
	'terminalPlaceholderSecondary':
	{
		'ja': 'ターミナルのサブフォントセットを選択して下さい。',
		'en': 'Select Secondary Font Set for the terminal.'
	},
	'debugConsolePlaceholderPrimary':
	{
		'ja': 'デバッグコンソールのメインフォントセットを選択して下さい。',
		'en': 'Select Primary Font Set for the debug console.'
	},
	'debugConsolePlaceholderSecondary':
	{
		'ja': 'デバッグコンソールのサブフォントセットを選択して下さい。',
		'en': 'Select Secondary Font Set for the debug console.'
	},
	'fontSettingNotFound':
	{
		'ja': 'フォントセット候補が見つかりませんでした。サンプルとなる設定を書き込みますか？',
		'en': 'Font Set candidates are not found. Shall I put the sample setting in the settings JSON?'
	},
	'fontSettingNotFoundYesButton':
	{
		'ja': 'はい',
		'en': 'Yes'
	},
	'showGroupFonts':
	{
		'ja': 'グループ内のフォントを表示',
		'en': 'Show fonts in the group'
	},
	'namelessGroup':
	{
		'ja': '(名前無しグループ)',
		'en': '(Nameless Group)'
	}
};

/**
 * 現在の言語設定に従って指定されたキーに対応するテキストを取得する。
 * @param key 取得するテキストのキー。
 * @param val テキストの中に任意の値を表示する場合はそれらを指定。省略可。
 * @returns キーに対応するテキストの文字列。
 */
function i18nText(key: string, ...val: string[]): string
{
	const localeKey = <string>JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale;
	const text = i18n[key as keyof typeof i18n];
	if (!text)
	{
		throw new Error(`文字列リソースのキー "${key}" が見つかりませんでした。`);
	}
	else
	{
		let s = text[localeKey as keyof typeof text];
		if (!s)
		{
			throw new Error(`文字列リソースのキー "${key}" のロケール "${localeKey}" のテキストが見つかりませんでした。`);
		}
		else
		{
			for (let i = 0; i < val.length; i++)
			{
				s = s.replace(`{${i}}`, val[i]);
			}
			return s;
		}
	}
}

export default i18nText;