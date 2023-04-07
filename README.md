# Romly Font Set Switcher

Visual Studio Codeのフォントをコーディング用のメインフォント／日本語用のサブフォントのように二種類設定するものと考え、それぞれを予め設定しておいたリストからコマンドパレットを使って素早く選択できるようにする拡張機能です。コードを表示するためのフォントを維持しつつ、日本語を表示するためのフォントのみを変更するといった事が可能です。また、それぞれの候補となるフォントはWindows／Macでフォント名が異なる場合などを考慮して複数のフォントを一つのフォントとして設定できます。

![Screencapture1](screencapture2-1.gif)<br/>
メインのフォントはそのまま、日本語フォントのみ変更できます。

![Screencapture2](screencapture2-2.gif)<br/>
同様に、日本語フォントそのままメインのコーディングフォントを変更できます。

昨今はプログラミング用に設計されたフォントがよりどりみどりである一方、それらに日本語が含まれている事はまず無く、日本語を母国語とする方は英語フォントに加えて日本語のフォントを指定している方も多いかと存じます。<br/>
推しフォントがコロコロと変わってしまう自分のような人間は、`editor.fontFamily`設定の値がこんな事になってしまっている方も多いのではないでしょうか。コードを表示するフォントの中に日本語用のフォントが入り乱れ、「このフォントも良かったけどこっちも試したい」と次々と足していくうちに同じフォントも何度も追加してしまっています。

> `"\"CascadiaCode-ExtraLight\", \"IBMPlexMono-ExtraLight\", \"IBM Plex Mono ExtraLight\", \"Cascadia Code ExtraLight\", \"PragmataPro Liga\", \"VictorMono-ExtraLight\", \"PragmataPro Mono Liga\", \"HiraginoSans-W0\", \"小塚ゴシック Pr6N ExtraLight\", \"小塚明朝 Pr6N ExtraLight\", \"源ノ角ゴシック Code JP\", \"Cascadia Code Light\", \"Victor Mono Light\", \"Monoid Regular\", \"Monoid-Regular\", \"Fira Code Retina\", \"ProFontWindows\", \"Source Code Pro ExtraLight\", \"PragmataPro Mono Liga\", \"Ink Free\", \"ChicagoFLF\", \"メイリオ\", \"游ゴシック\", \"貂明朝\", \"游明朝\", \"Fira Code\", \"Press Start K\", \"IBM Plex Mono Light\""`

この拡張機能は、コーディング用のメインフォントの候補と日本語フォントの候補を別々に保持しておくことで、それぞれを独立して変更できるようにします。仕組みとしては`editor.fontFamily`に複数のフォントを指定するだけです。

### English description

This extension enables users to choose a primary font and secondary font independently via the command palette, for the environment that users use two fonts at the same time for such as primary font that doesn't include Japanese characters for coding and secondary Japanese font for comments and etc.

![Screencapture1](screencapture2-1.gif)<br/>
You can change the Japanese font without affecting the main coding font.

![Screencapture2](screencapture2-2.gif)<br/>
In the same way, you can change the main coding font while keeping the Japanese font.

There is a lot of fonts made for coding these days, but they rarely have Japanese characters, still, I have to use them for comments or UI-related strings. So I write multiple fonts at the `editor.fontFamily` setting, but it makes a bit annoying when I want to change only the coding font or only the font for Japanese. Especially I often change the font along my mood, the `editor.fontFamily` value ends up messy like this:

> `"\"CascadiaCode-ExtraLight\", \"IBMPlexMono-ExtraLight\", \"IBM Plex Mono ExtraLight\", \"Cascadia Code ExtraLight\", \"PragmataPro Liga\", \"VictorMono-ExtraLight\", \"PragmataPro Mono Liga\", \"HiraginoSans-W0\", \"小塚ゴシック Pr6N ExtraLight\", \"小塚明朝 Pr6N ExtraLight\", \"源ノ角ゴシック Code JP\", \"Cascadia Code Light\", \"Victor Mono Light\", \"Monoid Regular\", \"Monoid-Regular\", \"Fira Code Retina\", \"ProFontWindows\", \"Source Code Pro ExtraLight\", \"PragmataPro Mono Liga\", \"Ink Free\", \"ChicagoFLF\", \"メイリオ\", \"游ゴシック\", \"貂明朝\", \"游明朝\", \"Fira Code\", \"Press Start K\", \"IBM Plex Mono Light\""`

Therefore, this extension enables selecting the primary font/secondary font independently from the pre-defined list, quickly through the command pallete.

## Features

- 予め設定しておいたフォントの候補から、コマンドパレットを使って素早くフォントを変更する。
- 一つのフォント候補には、複数のフォントを設定できる。
- フォントの候補はメインフォント用、サブフォント用と別々に設定できる。
- メインフォントを維持したまま、サブフォントだけを変更できる。逆もしかり。

## Extension Settings

* `Romly-FontSetSwitcher.primaryFontSets`:<br/>
メインフォントのリストを定義します。これは下記のプロパティを持つフォント候補のリストです。通常、ここにはコーディングで使用したいフォントの一覧を書いておくことになるかと思います。

	* `fonts`: このフォント候補が保持するフォントのリストです。最低一つのフォントを指定して下さい。
	* `name`: [省略可]コマンドパレットに表示される、このフォント候補の名前です。省略した場合は`fonts`に設定されたフォントが一通り表示されます。

	### 書き方の例
	```
	"Romly-FontSetSwitcher.primaryFontSets":
	[
		{
			"name": "IBMPlexMono Extra Light",
			"fonts": ["IBMPlexMono-ExtraLight", "IBM Plex Mono ExtraLight"],
		},
		{
			"name": "CascadiaCode Extra Light",
			"fonts": ["CascadiaCode-ExtraLight", "Cascadia Code ExtraLight"],
		},
		{
			"fonts": ["PragmataPro Mono Liga"],
		},
		{
			"fonts": ["ProFontWindows"],
		},
		{
			"fonts": ["源ノ角ゴシック Code JP"]
		},
	],
	```

* `Romly-FontSetSwitcher.secondaryFontSets`:<br/>
サブフォントのリストを定義します。書き方は`primaryFontSets`と同様です。こちらには日本語フォントの一覧を書いておくことになるかと思います。

* `Romly-FontSetSwitcher.editorPrimaryFont`:<br/>
`Romly-FontSetSwitcher.editorSecondaryFont`:<br/>ユーザーが選択したエディターのメインフォント、サブフォントをそれぞれ保持しておくための値です。*拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。*

* `Romly-FontSetSwitcher.markdownPreviewPrimaryFont`:<br/>
`Romly-FontSetSwitcher.markdownPreviewSecondaryFont`:<br/>
ユーザーが選択したマークダウンプレビューのメインフォント、サブフォントをそれぞれ保持しておくための値です。*拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。*

* `Romly-FontSetSwitcher.terminalPrimaryFont`:<br/>
`Romly-FontSetSwitcher.terminalSecondaryFont`:<br/>
ユーザーが選択したターミナルのメインフォント、サブフォントをそれぞれ保持しておくための値です。*拡張機能によって使用されるので、ユーザーが値を設定する必要はありません。*

## Release Notes

変更ログ(Changelog.md)をご覧下さい。<br/>Please see the changelog.