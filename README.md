# Romly Font Set Switcher

## 日本語(Japanese)

[English is here](#english英語)

Visual Studio Codeのフォントをコーディング用のメインフォント／日本語用のサブフォントのように二種類設定するものと考え、それぞれを予め設定しておいたリストからコマンドパレットを使って素早く選択できるようにする拡張機能です。コードを表示するためのフォントを維持しつつ、日本語を表示するためのフォントのみを変更するといった事が可能です。また、それぞれの候補となるフォントはWindows／Macでフォント名が異なる場合などを考慮して複数のフォントを一つのフォントとして設定できます。

![Screencapture1](screencapture2-1.gif)<br/>
メインのフォントはそのまま、日本語フォントのみ変更できます。

![Screencapture2](screencapture2-2.gif)<br/>
同様に、日本語フォントそのままメインのコーディングフォントを変更できます。

昨今はプログラミング用に設計されたフォントがよりどりみどりである一方、それらに日本語が含まれている事はまず無く、日本語を母国語とする方は英語フォントに加えて日本語のフォントを指定している方も多いかと存じます。

> `"\"CascadiaCode-ExtraLight\", \"IBMPlexMono-ExtraLight\", \"IBM Plex Mono ExtraLight\", \"Cascadia Code ExtraLight\", \"PragmataPro Liga\", \"VictorMono-ExtraLight\", \"PragmataPro Mono Liga\", \"HiraginoSans-W0\", \"小塚ゴシック Pr6N ExtraLight\", \"小塚明朝 Pr6N ExtraLight\", \"源ノ角ゴシック Code JP\", \"Cascadia Code Light\", \"Victor Mono Light\", \"Monoid Regular\", \"Monoid-Regular\", \"Fira Code Retina\", \"ProFontWindows\", \"Source Code Pro ExtraLight\", \"PragmataPro Mono Liga\", \"Ink Free\", \"ChicagoFLF\", \"メイリオ\", \"游ゴシック\", \"貂明朝\", \"游明朝\", \"Fira Code\", \"Press Start K\", \"IBM Plex Mono Light\""`

推しフォントがコロコロと変わってしまう自分のような人間は、 `editor.fontFamily` 設定の値が上記のようにぐっちゃぐちゃになってしまっている方も多いのではないでしょうか。コードを表示するフォントの中に日本語用のフォントが入り乱れ、「このフォントも良かったけどこっちも試したい」と次々と足していくうちに同じフォントを何度も追加してしまっています。

この拡張機能は、コーディング用のメインフォントの候補と日本語フォントの候補を別々に保持しておくことで、それぞれを独立して変更できるようにします。仕組みとしては `editor.fontFamily` に選択した複数のフォントを組み合わせて指定することで実現しています。

### 機能

- 予め設定しておいたフォントの候補から、コマンドパレットを使って素早くフォントを変更する。
- 一つのフォント候補には、複数のフォントを設定できる。
- フォントの候補はメインフォント用、サブフォント用と別々に設定できるので、アルファベット用／日本語用と別のフォントを簡単に設定できます。
- メインフォントを維持したまま、サブフォントだけを変更できる。逆もしかり。

### 拡張機能の設定

* `Romly-FontSetSwitcher.primaryFontSets`:
メインフォントのリストを定義します。これは下記のプロパティを持つフォントセット、またはグループのリストです。通常、ここにはコーディングで使用したいフォントの一覧を書いておくことになるかと思います。

	#### フォントセット

	* `fonts`: このフォントセットが保持するフォントのリストです。最低一つのフォントを指定して下さい。
	* `name`: _[省略可]_ コマンドパレットに表示される、このフォント候補の名前です。省略した場合は`fonts`に設定されたフォントが一通り表示されます。

	#### グループ

	複数のフォントセットをまとめたグループも定義できます。グループを選択した場合、グループの `fontSets` に記載したすべてのフォントセットのフォントを選択したことになります。また、コマンドパレットでグループの右端に表示される `>` ボタンをクリックすることで、そのグループ内のフォントセットを個別に選択することもできます。

	* `name`: グループ名です。コマンドパレットに表示されます。
	* `fontSets`: このグループに含まれるフォントセットのリストです。この中身は `Romly-FontSetSwitcher.primaryFontSets` と同じ構造です。

	#### 書き方の例
	```
	"Romly-FontSetSwitcher.primaryFontSets":
	[
		{
			"name": "IBMPlexMono Extra Light",
			"fonts": ["IBMPlexMono-ExtraLight", "IBM Plex Mono ExtraLight"],
		},
		{
			"name": "CascadiaCode",
			"fontSets": [
				{
					"name": "CascadiaCode Extra Light",
					"fonts": ["CascadiaCode-ExtraLight", "Cascadia Code ExtraLight"]
				},
				{
					"name": "CascadiaCode Light",
					"fonts": ["CascadiaCode-Light", "Cascadia Code Light"]
				},
				{
					"name": "CascadiaCode SemiLight",
					"fonts": ["CascadiaCode-SemiLight", "Cascadia Code SemiLight"]
				},
			]
		},
		{
			"fonts": ["PragmataPro Mono Liga"],
		},
		{
			"name": "Fira Code Retina",
			"fonts": ["Fira Code Retina", "FiraCode-Retina"]
		},
		{
			"fonts": ["源ノ角ゴシック Code JP"]
		},
	],
	```

* `Romly-FontSetSwitcher.secondaryFontSets`:
サブフォントのリストを定義します。書き方は `primaryFontSets` と同様です。こちらには日本語フォントの一覧を書いておくことになるかと思います。

* `Romly-FontSetSwitcher.editorPrimaryFont`, `Romly-FontSetSwitcher.editorSecondaryFont`:
**拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。** ユーザーが選択したエディターのメインフォント、サブフォントをそれぞれ保持しておくための値です。

* `Romly-FontSetSwitcher.markdownPreviewPrimaryFont`, `Romly-FontSetSwitcher.markdownPreviewSecondaryFont`:
**拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。** ユーザーが選択したマークダウンプレビューのメインフォント、サブフォントをそれぞれ保持しておくための値です。

* `Romly-FontSetSwitcher.terminalPrimaryFont`, `Romly-FontSetSwitcher.terminalSecondaryFont`:
**拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。** ユーザーが選択したターミナルのメインフォント、サブフォントをそれぞれ保持しておくための値です。

* `Romly-FontSetSwitcher.debugConsolePrimaryFont`, `Romly-FontSetSwitcher.debugConsoleSecondaryFont`:
**拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。** ユーザーが選択したターミナルのメインフォント、サブフォントをそれぞれ保持しておくための値です。

### フォントセットとグループについて

フォントセットに複数のフォントが書けるのに、なぜそれらを更にまとめたグループが定義できるかですが、もともとフォントセットの方は基本的には一つのフォントを想定していて、OSによってフォントの指定が微妙に異なる場合を想定していました。

んで、グループは同じフォントの太さ違いなどをまとめる事を想定していて、ウェイトが沢山あるフォントなんかはグループにまとめておきつつ、特定のウェイトを選択したい時は `>` ボタンでグループ内に入って指定すればいいかなと思ってます。

### リリースノート

変更ログ [CHANGELOG.md](CHANGELOG.md) をご覧下さい。









-----










## English(英語)

[日本語(Japanese)はこちら](#日本語japanese)

This extension enables users to choose a primary font and secondary font independently via the command palette, for the environment that users use two fonts at the same time for such as primary font that doesn't include Japanese characters for coding and secondary Japanese font for comments and etc.

![Screencapture1](screencapture2-1.gif)<br/>
You can change the Japanese font without affecting the main coding font.

![Screencapture2](screencapture2-2.gif)<br/>
In the same way, you can change the main coding font while keeping the Japanese font.

There is a lot of fonts made for coding these days, but they rarely have Japanese characters, still, I have to use them for comments or UI-related strings. So I write multiple fonts at the `editor.fontFamily` setting, but it makes a bit annoying when I want to change only the coding font or only the font for Japanese. Especially I often change the font along my mood, the `editor.fontFamily` value ends up messy like this:

> `"\"CascadiaCode-ExtraLight\", \"IBMPlexMono-ExtraLight\", \"IBM Plex Mono ExtraLight\", \"Cascadia Code ExtraLight\", \"PragmataPro Liga\", \"VictorMono-ExtraLight\", \"PragmataPro Mono Liga\", \"HiraginoSans-W0\", \"小塚ゴシック Pr6N ExtraLight\", \"小塚明朝 Pr6N ExtraLight\", \"源ノ角ゴシック Code JP\", \"Cascadia Code Light\", \"Victor Mono Light\", \"Monoid Regular\", \"Monoid-Regular\", \"Fira Code Retina\", \"ProFontWindows\", \"Source Code Pro ExtraLight\", \"PragmataPro Mono Liga\", \"Ink Free\", \"ChicagoFLF\", \"メイリオ\", \"游ゴシック\", \"貂明朝\", \"游明朝\", \"Fira Code\", \"Press Start K\", \"IBM Plex Mono Light\""`

Therefore, this extension enables selecting the primary font/secondary font independently from the pre-defined list, quickly through the command pallete.

### Features

- Quickly change fonts using the command palette from a pre-set list of font options.
- Multiple fonts can be contained for a single font option.
- Since font options can be set separately for the main font and the sub-font, it's easy to configure different fonts for alphabetic and Japanese text.
- Maintain the main font while only changing the sub-font, and vice versa.

### Extension Settings

* `Romly-FontSetSwitcher.primaryFontSets`:
Defines the list of main fonts. This is a list of font sets or groups with the following properties. Typically, you would put the fonts you wish to use for coding in the list.

	#### Font Set

	* `fonts`: A list of fonts held by this font option. Please specify at least one font.
	* `name`: _[Optional]_ The name of this font option as it appears in the command palette. If omitted, all fonts set in fonts will be displayed.

	#### Group

	You can also define groups containing multiple font sets. Selecting a group means you select all the font sets in the `fontSets`. Additionally, you can select individual font sets within the group by clicking the `>` button at the right end of the group in the command palette.

	`name`: The group name, which appears in the command palette.
	`fontSets`: A list of font sets included in this group. The structure here is the same as that in `Romly-FontSetSwitcher.primaryFontSets`.

	#### Writing Example

	Please see [書き方の例](#書き方の例).

* `Romly-FontSetSwitcher.secondaryFontSets`:
Defines the list of sub-fonts. The setup is the same as `primaryFontSets`. This is likely where you would put Japanese fonts.

* `Romly-FontSetSwitcher.editorPrimaryFont`, `Romly-FontSetSwitcher.editorSecondaryFont`:
**You don't have to set this. It's used internally.** This hold the primary and secondary fonts selected by the user for the editor.

* `Romly-FontSetSwitcher.markdownPreviewPrimaryFont`, `Romly-FontSetSwitcher.markdownPreviewSecondaryFont`:
**You don't have to set this. It's used internally.** This hold the primary and secondary fonts selected by the user for the markdown preview.

* `Romly-FontSetSwitcher.terminalPrimaryFont`, `Romly-FontSetSwitcher.terminalSecondaryFont`:
**You don't have to set this. It's used internally.** This hold the primary and secondary fonts selected by the user for the terminal.

* `Romly-FontSetSwitcher.debugConsolePrimaryFont`, `Romly-FontSetSwitcher.debugConsoleSecondaryFont`:
**You don't have to set this. It's used internally.** This hold the primary and secondary fonts selected by the user for the debug console.

### About Font Sets and Groups
A Font set can hold multiple fonts, so why does Group exist? Originally, font sets were intended for a single font, taking into account slight variations in font name depending on the OS.

Groups are intended to compile variations like different weights of the same font. For fonts with many weight options, you can group them together to avoid redundancy in the list. And if you want to select a specific weight, you can do so by entering the group with the `>` button.

### Release Notes

Please see the [CHANGELOG.md](CHANGELOG.md).
