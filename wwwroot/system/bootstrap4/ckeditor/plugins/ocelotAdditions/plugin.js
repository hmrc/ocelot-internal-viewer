CKEDITOR.plugins.add('ocelotAdditions', 
{
	icons: 'Note,Danger',
	init: function ( editor ) 
	{
		editor.addCommand('insertNote', 
		{
		    exec: function( editor ) 
		    {		        
		        editor.insertHtml( '<p>&lt;note&gt;&lt;/note&gt;</p>' );
		    }
		});
		
		editor.addCommand('insertDanger', 
		{
		    exec: function( editor ) 
		    {		        
		        editor.insertHtml( '<p>&lt;important&gt;&lt;/important&gt;</p>' );
		    }
		});
		
		editor.ui.addButton('Note', 
		{
		    label: 'Insert Note',
		    command: 'insertNote',
		    toolbar: 'ocelot'
		});
		
		editor.ui.addButton('Danger', 
		{
		    label: 'Insert Important Note',
		    command: 'insertDanger',
		    toolbar: 'ocelot'
		});
	}
});