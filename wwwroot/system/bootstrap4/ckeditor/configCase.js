/*
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config ) 
{
	// For complete reference see: http://docs.ckeditor.com/#!/api/CKEDITOR.config
		
	//allow tag content below
	config.extraAllowedContent = 'span(list-start-text),p(list-start-text)';
		
	// some plugins have dependencies - scayt required several plugins to display menus etc
	config.extraPlugins = 'button,contextmenu,dialog,dialogui,lite,menu,menubutton,ocelotAdditions,panel,floatpanel,scayt';

	//Spellchecker plugin - Guidance Team default settings
	config.scayt_autoStartup = true;
	config.scayt_sLang = 'en_GB'; //set language
	config.scayt_maxSuggestions = 3; 
	config.scayt_moreSuggestions = 'on';
	
	// The toolbar sections with items - group toolbar not used so can specify only items to be displayed.
	// This requires manual declaration of plugins - see 'lite'.
	config.toolbar = 
	[
		{ name: 'clipboard',	items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
		{ name: 'editing', 		items: [ 'Scayt' ] },
		{ name: 'basicstyles', 	items: [ 'Bold', '-', 'RemoveFormat' ] },
		{ name: 'paragraph', 	items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
		{ name: 'links', 		items: [ 'Link', 'Unlink', 'Anchor'] },
		{ name: 'lite', 		items: [ 'lite-toggletracking', 'lite-toggleshow', '-', 'lite-acceptall', 'lite-rejectall', '-', 'lite-acceptone', 'lite-rejectone' ] }, 
		{ name: 'about', 		items: [ 'About' ] },
		'/',
		{ name: 'ocelot', 		items: [ 'Note', 'Danger' ] },
	];
	
	// Dialog windows are also simplified.
	config.removeDialogTabs = 'link:advanced';	
};
