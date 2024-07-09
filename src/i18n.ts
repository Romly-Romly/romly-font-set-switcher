// 文字列リソースはja, enロケール必須とする
export interface I18NText
{
	ja: string;
	en: string;
	[key: string]: string;
}










type Cardinal = 'zero' /* zero form */ | 'two' /*双数形(dual)*/ | 'few' /*少数複数形(paucal)*/;

/**
 * 必要に応じて複数形を保持できる文字列。
 * 基本的な複数形のみは必須。
 */
interface IPluralRule
{
	// 基本的な複数形、またはルールに当てはまらないすべての数の場合の文字列
	other: string;
	// 単数形（オプション）
	singular?: string;
	// その他の複数形（オプション）
	cardinals?: Partial<Record<Cardinal, string>>;
}

/**
 * 各言語について複数形を保持できる文字列リソースひとつ分を表すインターフェース。
 */
export interface I18NPluralText
{
	ja: IPluralRule;
	en: IPluralRule;
	[key: string]: IPluralRule;
}





/**
 * 共通の文字列リソース。
 * 文字列のキーがIDEでエラーになるよう、クラスにしてそれぞれの文字列をプロパティとした。
 */
class COMMON_TEXTS_CLASS
{
	yes: I18NText =
	{
		en: 'Yes',
		ja: 'はい',
		fr: 'Oui',
		'zh-cn': '是'
	};

	search: I18NText =
	{
		en: 'Search',
		ja: '検索',
		fr: 'Rechercher',
		'zh-cn': '搜索'
	};

	windowsExplorer: I18NText =
	{
		ja: 'エクスプローラー',
		en: 'File Explorer',
		fr: "l'Explorateur",
		'zh-cn': '文件资源管理器'
	};

	// MacのFinderはどの言語でも `Finder` だった。
	macFinder: I18NText =
	{
		ja: 'Finder',
		en: 'Finder',
		fr: 'Finder',
		'zh-cn': 'Finder'
	};

	// Linuxはよくわからないや。File Managerでいいかな。
	linuxFileManager: I18NText =
	{
		ja: 'ファイルマネージャー',
		en: 'File Manager',
		fr: 'Gestionnaire de fichiers',
		'zh-cn': '文件管理器'
	};

	files: I18NPluralText =
	{
		ja: {
			other: 'ファイル'
		},
		en: {
			other: 'files',
			singular: 'file'
		},
		fr: {
			other: 'fichiers',
			singular: 'fichier'
		},
		es: {
			other: 'archivos',
			singular: 'archivo'
		},
		'zh-cn': {
			other: '文件'
		},
		'zh-tw': {
			other: '檔案',
		},
		'pt-br': {
			other: 'arquivos',
			singular: 'arquivo',
		},
		ru: {
			other: 'файлов',
			singular: 'файл',
			cardinals: {
				few: 'файла'
			}
		},
		ar: {
			other: 'ملفًا',
			singular: 'ملف',
			cardinals: {
				zero: 'ملفات',
				two: 'ملفان',
				few: 'ملفات'
			}
		},
		pl: {
			other: 'plików',
			singular: 'plik',
			cardinals: {
				few: 'pliki'
			}
		},
		ga: {
			other: 'chomhad',
			singular: 'comhad',
			cardinals: {
				zero: 'comhad',
			}
		},
		de: {
			other: 'Dateien',
			singular: 'Datei',
		},
		it: {
			other: 'file',	// イタリア語は字面は同じだが発音が異なるらしいので一応…
			singular: 'file'
		},
		cs: {
			other: 'souborů',
			singular: 'soubor',
			cardinals: {
				few: 'soubory'
			}
		},
		bg: {
			other: 'файла',
			singular: 'файл',
			cardinals: {
				few: 'файла'
			}
		},
		tr: { other: 'dosya' },
		hu: { other: 'fájl' },
		cy: { other: 'ffeil' },
		ko: { other: '파일' },
	};

	directories: I18NPluralText =
	{
		ja: {
			other: 'ディレクトリ'
		},
		en: {
			other: 'directories',
			singular: 'directory'
		},
		fr: {
			other: 'répertoires',
			singular: 'répertoire'
		},
		es: {
			other: 'directorios',
			singular: 'directorio'
		},
		'zh-cn': {
			other: '目录'
		},
		'zh-tw': {
			other: '目錄'
		},
		'pt-br': {
			other: 'diretórios',
			singular: 'diretório'
		},
		ru: {
			other: 'директорий',
			singular: 'директория',
			cardinals: {
				few: 'директории'
			}
		},
		ar: {
			other: 'مجلدًا',
			singular: 'مجلد',
			cardinals: {
				zero: 'مجلدات',
				two: 'مجلدان',
				few: 'مجلدات'
			}
		},
		pl: {
			other: 'katalogów',
			singular: 'katalog',
			cardinals: {
				few: 'katalogi'
			}
		},
		ga: {
			other: 'comhadlann',
			singular: 'comhadlann',
			cardinals: {
				zero: 'comhadlann',
				few: 'chomhadlann'
			}
		},
		de: { other: 'Verzeichnisse', singular: 'Verzeichnis' },
		it: { other: 'directory', singular: 'directory' },
		cs: {
			other: 'adresáře',
			singular: 'adresář',
			cardinals: { few: 'adresáře' }
		},
		bg: {
			other: 'директории',
			singular: 'директория',
			cardinals: { few: 'директории' }
		},
		tr: { other: 'dizin' },
		hu: { other: 'könyvtár' },
		cy: {
			other: 'cyfeiriadur'
		},
		ko: { other: '디렉토리' }
	};

	items: I18NPluralText = {
		ja: { other: 'アイテム' },
		en: { other: 'items', singular: 'item' },
		fr: { other: 'éléments', singular: 'élément' },
		es: { other: 'elementos', singular: 'elemento' },
		'zh-cn': { other: '项目' },
		'zh-tw': { other: '項目' },
		'pt-br': { other: 'itens', singular: 'item' },
		ru: {
			other: 'элементов',
			singular: 'элемент',
			cardinals: { few: 'элемента' }
		},
		ar: {
			other: 'عنصرًا',
			singular: 'عنصر',
			cardinals: {
				zero: 'عناصر',
				two: 'عنصران',
				few: 'عناصر'
			}
		},
		pl: {
			other: 'elementów',
			singular: 'element',
			cardinals: { few: 'elementy' }
		},
		ga: {
			other: 'mhír',
			singular: 'mír',
			cardinals: { zero: 'mír' }
		},
		de: { other: 'Elemente', singular: 'Element' },
		it: { other: 'elementi', singular: 'elemento' },
		cs: {
			other: 'položky',
			singular: 'položka',
			cardinals: { few: 'položky' }
		},
		bg: {
			other: 'елемента',
			singular: 'елемент',
			cardinals: { few: 'елемента' }
		},
		tr: { other: 'öğe' },
		hu: { other: 'elem' },
		cy: { other: 'eitem' },
		ko: { other: '항목' }
	};

	couldNotOpenFile: I18NText =
	{
		ja: 'ファイルを開けませんでした',
		en: 'Could not open file',
		fr: "Impossible d'ouvrir le fichier",
		"zh-cn": "无法打开文件"
	};

	showErrorDetailButtonCaption: I18NText =
	{
		ja: '詳細を表示',
		en: 'Show Detail',
		fr: 'Afficher les détails',
		'zh-cn': '显示详细信息'
	};

	// 特定の文字列に対応するロケールが見つからない場合のエラーメッセージ
	stringResourceLocaleNotFound: I18NText =
	{
		ja: '文字列リソースのキー "{key}" にロケール en のテキストが見付かりませんでした。',
		en: 'Text resource key "{key}" with locale en not found.',
		fr: 'Clé de ressource textuelle "{key}" avec la locale en non trouvée.',
		'zh-cn': '未找到带有英语区域设置的文本资源键 "{key}"。',
	};
};

// 共通の文字列リソース
export const COMMON_TEXTS = new COMMON_TEXTS_CLASS();










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
function getLocalizedMessage(message: I18NText, localeKey: string, defaultValue: string): string
{
	return message[localeKey] || message['en'] || defaultValue;
}










/**
 * 言語設定に対応する文字列を取得する。
 *
 * @param message 国際化文字列を格納した文字列リソース。
 * @param key i18nオブジェクト内の特定のキー。
 * @param values プレースホルダーを置き換えるためのオブジェクト。キーがプレースホルダー名、値が置き換え文字列。
 * @returns プレースホルダーが置き換えられたテキスト。
 */
export function i18n(message: I18NText, values: Record<string, string> = {}): string
{
	// ロケールを取得
	const localeKey = JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale as string;

	// ロケールに対応するメッセージを取得
	const localizedText = getLocalizedMessage(message, localeKey, '');

	// enキーすら見つからない場合は必ずエラー
	if (localizedText === '')
	{
		const varName = Object.keys({message})[0];
		const s = COMMON_TEXTS.stringResourceLocaleNotFound;
		throw new Error(replacePlaceholders(getLocalizedMessage(s, localeKey, s['en']), { key: varName }));
	}
	else
	{
		return replacePlaceholders(localizedText, values);
	}
}










/**
 * 言語ごとの複数形を考慮した「数字＋テキスト」の文字列を取得する。通常はロケールをシステムから自動で取得する `i18nPlural` を使用すること。
 * @param message 複数の言語とそれぞれの複数形を持つ文字列リソース。
 * @param n 数値。
 * @param localeKey 言語のロケールを指定。
 * @returns
 */
export function i18nPluralWithLocale(message: I18NPluralText, n: number, localeKey: string): string
{
	type PluralForm = 'singular' | 'other' | Cardinal;
	type PluralFormFunction = (count: number) => PluralForm;

	const PLURAL_FUNCTIONS: Record<string, PluralFormFunction> =
	{
		ar: getArabicForm,
		bg: getBulgarianForm,
		ru: getRussianForm,
		pl: getPolishForm,
		ga: getIrishForm,
		cy: getWelshForm,
		cs: getCzechForm,
		fr: getFrenchForm,
	};

	/**
	 * アラビア語(ar)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getArabicForm(count: number): PluralForm
	{
		if (count === 0)
		{
			return 'zero';
		}
		else if (count === 1)
		{
			return 'singular';
		}
		else if (count === 2)
		{
			return 'two';
		}
		else if (3 <= count && count <= 10)
		{
			return 'few';
		}
		else if (11 <= count && count <= 99)
		{
			return 'other';
		}
		else
		{
			// 100以上の場合
			const remainder = count % 100;

			if (remainder === 0)
			{
				return 'singular';  // 100, 200, 300, etc.
			}
			else if (1 <= remainder && remainder <= 2)
			{
				return 'singular';  // 101-102, 201-202, etc.
			}
			else if (3 <= remainder && remainder <= 10)
			{
				return 'few';  // 103-110, 203-210, etc.
			}
			else
			{
				return 'other';  // 111-199, 211-299, etc.
			}
		}
	}

	/**
	 * ブルガリア語(bg)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getBulgarianForm(count: number): PluralForm
	{
		if (count === 1)
		{
			return 'singular';
		}
		else if (count % 10 === 1 && count % 100 !== 11)
		{
			return 'singular'; // 21, 31, 41, ..., 91, 101, 121, ...
		}
		else if ((count % 10 === 2 || count % 10 === 3 || count % 10 === 4) &&
			(count % 100 !== 12 && count % 100 !== 13 && count % 100 !== 14))
		{
			return 'few'; // 2-4, 22-24, 32-34, ..., 92-94, 102-104, ...
		}
		else
		{
			return 'other'; // 0, 5-20, 25-30, 35-40, ..., 95-100, 105-120, ...
		}
	}

	/**
	 * ロシア語(ru)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getRussianForm(count: number): PluralForm
	{
		// ロシア語ルール
		// 1で終わる数（11以外）はsingular, 末尾2~4で終わる場合はfew（ただし12~14を除く）, それ以外はother
		if (count % 10 === 1 && count % 100 !== 11)
		{
			return 'singular';
		}
		else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
		{
			return 'few';
		}
		else
		{
			return 'other';
		}
	}

	/**
	 * ポーランド語(pl)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getPolishForm(count: number): PluralForm
	{
		// ポーランド語ルール
		// 1はsingular, 2~4で終わる数（ただし12~14を除く）はfew, それ以外はother
		if (count === 1)
		{
			return 'singular';
		}
		else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
		{
			return 'few';
		}
		else
		{
			return 'other';
		}
	}

	/**
	 * アイルランド・ゲール語(ga)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getIrishForm(count: number): PluralForm
	{
		// 0はzero, 1はsingular, 2−6はfew, それ以外はother
		if (count === 1)
		{
			return 'singular';
		}
		else if (count === 0)
		{
			return 'zero';
		}
		else if (2 <= count && count <= 6)
		{
			return 'few';
		}
		else
		{
			return 'other';
		}
	}

	/**
	 * ウェールズ語(cy)の複数形を取得する。
	 * @param count 数値。
	 * @returns 複数形の種類を返す。
	 */
	function getWelshForm(count: number): PluralForm
	{
		// ウェールズ語のルール
		// 1はsingular, 2はtwo, 3はfew, それ以外はother
		if (count === 1)
		{
			return "singular";
		}
		else if (count === 2)
		{
			return "two";
		}
		else if (count === 3)
		{
			return "few";
		}
		else
		{
			return "other";
		}
	}

	/**
	 * チェコ語(cz)の複数形を取得する。
	 * @param count
	 */
	function getCzechForm(count: number): PluralForm
	{
		if (count === 1)
		{
			return 'singular';
		}
		else if (count >= 2 && count <= 4)
		{
			return 'few';
		}

		// 0と5以上の場合
		return 'other';
	}

	function getFrenchForm(count: number): PluralForm
	{
		if (count === 1 || count === 0)
		{
			return 'singular';
		}
		else
		{
			return 'other';
		}
	}

	/**
	 * 言語ごとの複数形を取得する。
	 * @param count 数値。
	 * @param language 言語のロケールを指定。現状対応しているのは ja, en, fr, zh-cn, ru, pl（ポーランド語）, ga（アイルランド語）, cy（ウェールズ語）のみ。
	 * @returns 複数形の種類を返す。
	 */
	function getForm(count: number, language: string): 'singular' | 'other' | Cardinal
	{
		// 日本語と中国語以外では1には単数形を使う。
		if (count === 1 && language !== 'ja' && language !== 'zh-cn')
		{
			return 'singular';
		}
		else
		{
			return 'other';
		}
	}

	// ロケールに対応するメッセージを取得
	const localizedText = message[localeKey] || message['en'] || undefined;

	// enキーすら見つからない場合は必ずエラー
	if (localizedText === undefined)
	{
		const varName = Object.keys({message})[0];
		const s = COMMON_TEXTS.stringResourceLocaleNotFound;
		throw new Error(replacePlaceholders(getLocalizedMessage(s, localeKey, s['en']), { key: varName }));
	}
	else
	{
		let form;
		if (PLURAL_FUNCTIONS.hasOwnProperty(localeKey))
		{
			form = PLURAL_FUNCTIONS[localeKey](n);
		}
		else
		{
			form = getForm(n, localeKey);
		}

		if (form === 'singular' && localizedText.singular)
		{
			return n.toString() + ' ' + localizedText.singular;
		}

		if (form !== 'singular' && form !== 'other' && localizedText.cardinals && localizedText.cardinals[form])
		{
			return n.toString() + ' ' + localizedText.cardinals[form]!;
		}

		return n.toString() + ' ' + localizedText.other;
	}
}










/**
 * 言語ごとの複数形を考慮した「数字＋テキスト」の文字列を取得する。
 * @param message 複数の言語とそれぞれの複数形を持つ文字列リソース。
 * @param n 数値。
 * @returns
 */
export function i18nPlural(message: I18NPluralText, n: number): string
{
	// ロケールを取得
	const localeKey = JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale as string;
	return i18nPluralWithLocale(message, n, localeKey);
}