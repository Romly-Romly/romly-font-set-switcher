// 文字列リソースはja, enロケール必須とする
interface RequiredLocales
{
	ja: string;
	en: string;
	[key: string]: string;
}

// プロジェクトごとの文字列リソースはこの型を使って定義のこと
export type LocalizedMessages = Record<string, RequiredLocales>;

// 文字列リソースの特定のキーが見つからない場合のエラーメッセージ
const KEY_NOT_FOUND: RequiredLocales =
{
	ja: '文字列リソースのキー "{key}" が見付かりませんでした。',
	en: 'Text resource key "{key}" not found.',
	fr: 'Clé de ressource textuelle "{key}" non trouvée.',
	'zh-cn': '未找到文本资源键 "{key}"。',
};

// 特定の文字列に対応するロケールが見つからない場合のエラーメッセージ
const EN_LOCALE_NOT_FOUND: RequiredLocales =
{
	ja: '文字列リソースのキー "{key}" にロケール en のテキストが見付かりませんでした。',
	en: 'Text resource key "{key}" with locale en not found.',
	fr: 'Clé de ressource textuelle "{key}" avec la locale en non trouvée.',
	'zh-cn': '未找到带有英语区域设置的文本资源键 "{key}"。',
};










/**
 * 指定された文字列内のプレースホルダーを、与えられた辞書で置き換える。
 * プレースホルダーは {キー名} として記述する。詳しくは例を参照。
 *
 * @param s プレースホルダーを含む元の文字列。
 * @param values キーと値のペアを含む辞書。キーはプレースホルダーの名前、値は置換する文字列。
 * @returns プレースホルダーを全て置換した新しい文字列。
 *
 * @example
 * const template = "こんにちは、{name}さん！今日は{day}です。";
 * const values = { name: "田中", day: "火曜日" };
 * const result = replacePlaceholders(template, values);
 * console.log(result); // "こんにちは、田中さん！今日は火曜日です。"
 */
function replacePlaceholders(s: string, values: Record<string, string>): string
{
	return Object.entries(values).reduce((result, [valueName, value]) =>
	{
		return result.replaceAll(`{${valueName}}`, value);
	}, s);
}










/**
 * 指定されたロケールに対応するメッセージを取得する。ロケールに対応するメッセージがない場合は英語(en)に対応するメッセージを返す。英語も存在しないなら最初のメッセージを返す。
 * @param message ロケールキーとメッセージのペア。
 * @param localeKey 取得したいメッセージのロケールキー。
 * @returns ローカライズされたメッセージ。
 */
function getLocalizedMessage(message: Record<string, string>, localeKey: string, defaultValue: string): string
{
	return message[localeKey] || message['en'] || defaultValue;
}










/**
 * 言語設定に対応する文字列を取得する。
 *
 * @param messages 国際化文字列を格納した、プロジェクトごとに異なるであろうオブジェクト。
 * @param key i18nオブジェクト内の特定のキー。
 * @param values プレースホルダーを置き換えるためのオブジェクト。キーがプレースホルダー名、値が置き換え文字列。
 * @returns プレースホルダーが置き換えられたテキスト。
 */
function i18n(messages: LocalizedMessages, key: string, values: Record<string, string> = {}): string
{
	const localeKey = JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale as string;
	const text = messages[key as keyof typeof messages];
	if (!text)
	{
		// 文字列リソースに対応するキーが見つからない
		throw new Error(replacePlaceholders(getLocalizedMessage(KEY_NOT_FOUND, localeKey, KEY_NOT_FOUND['en']), { key: key }));
	}
	else
	{
		const localizedText = getLocalizedMessage(text, localeKey, '');

		// enキーすら見つからない場合は必ずエラー
		if (localizedText === '')
		{
			throw new Error(replacePlaceholders(getLocalizedMessage(EN_LOCALE_NOT_FOUND, localeKey, EN_LOCALE_NOT_FOUND['en']), { key: key }));
		}
		else
		{
			return replacePlaceholders(localizedText, values);
		}
	}
}

export default i18n;